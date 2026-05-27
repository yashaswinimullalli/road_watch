const axios = require('axios');
const FormData = require('form-data');
const Location = require('../models/Location');
const Road = require('../models/Road');
const RoadDamage = require('../models/RoadDamage');

const AI_SERVICE_URL = 'http://localhost:8000/api/v1/analyze';

// Maps Overpass highway tag → human-readable road type
const mapRoadType = (highwayTag) => {
  if (highwayTag === 'trunk')     return 'National Highway';
  if (highwayTag === 'primary')   return 'State Highway';
  if (highwayTag === 'secondary') return 'Major District Road';
  return 'Other Road'; // Fallback for any unmapped road type
};

// Formats a date value to YYYY-MM-DD string for the AI service
const toDateString = (dateVal) => {
  try {
    return new Date(dateVal).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

exports.processAnalysis = async (req, res) => {
  try {
    // ── Step 1 & 2: Receive coordinates + optional location string from frontend ──
    const lat           = parseFloat(req.body.lat);
    const lng           = parseFloat(req.body.lng);
    const locationString = req.body.locationString || null;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // ── Step 4: Call Overpass API to detect road type ──
    let highwayTag = 'unknown';
    let roadName   = 'Unnamed Road';
    try {
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];way(around:20,${lat},${lng})[highway];out tags;`;
      const overpassRes = await axios.get(overpassUrl, {
        timeout: 8000,
        headers: { 'User-Agent': 'RoadWatch/1.0 (road-transparency-app)' }
      });

      if (overpassRes.data && overpassRes.data.elements.length > 0) {
        const tags = overpassRes.data.elements[0].tags;
        highwayTag = tags.highway || 'unknown';
        roadName   = tags.name || tags['name:en'] || tags['name:local'] || 'Unnamed Road';
      }
    } catch (overpassErr) {
      console.warn('⚠️ Overpass API error, using fallbacks:', overpassErr.message);
    }

    // ── Step 5: Map highway tag → road type ──
    const mappedRoadType = mapRoadType(highwayTag);

    // ── Step 6: Fetch matching transparency data from BackendCluster ──
    const matchingRoadData = await Road.aggregate([
      { $match: { roadType: mappedRoadType } },
      { $sample: { size: 1 } }
    ]);
    const roadInfo = matchingRoadData.length > 0 ? matchingRoadData[0] : null;

    // ── Step 7: Forward image to Real AI Service (FastAPI + YOLOv8) ──
    let aiResult = null;

    if (req.file && req.file.buffer) {
      try {
        const formData = new FormData();

        // Attach the image buffer received from the frontend
        formData.append('image', req.file.buffer, {
          filename:    req.file.originalname || 'road-image.jpg',
          contentType: req.file.mimetype     || 'image/jpeg'
        });

        // Provide road context from Overpass + MongoDB to the AI
        const authority        = roadInfo?.authority || 'Local Municipal Corporations';
        const lastRelayingDate = roadInfo?.lastRelayingDate
          ? toDateString(roadInfo.lastRelayingDate)
          : toDateString(new Date());

        formData.append('location',          locationString || `${lat},${lng}`);
        formData.append('authority',         authority);
        formData.append('road_type',         mappedRoadType);
        formData.append('last_relaying_date', lastRelayingDate);
        formData.append('support_count',     '1');

        const aiRes = await axios.post(AI_SERVICE_URL, formData, {
          headers: { ...formData.getHeaders() },
          timeout: 30000
        });

        aiResult = aiRes.data;
        console.log(`✅ AI analysis complete — damage: ${aiResult.damage_type}, severity: ${aiResult.severity}`);

      } catch (aiErr) {
        console.error('⚠️  AI service error (using fallback):', aiErr.message);
      }
    } else {
      console.warn('⚠️  No image received — AI analysis skipped');
    }

    // ── Fallback AI values if AI service is unavailable or no image was sent ──
    const issueType  = aiResult?.damage_type   || 'Unknown';
    const severity   = aiResult?.severity      || 'Unknown';
    const condition  = aiResult?.severity      || 'Unknown';

    // ── Duplicate Issue Detection & Proximity Logic ──
    // Detect if there's a location within ~150 meters (0.0015 delta)
    const nearbyLocations = await Location.find({
      latitude: { $gte: lat - 0.0015, $lte: lat + 0.0015 },
      longitude: { $gte: lng - 0.0015, $lte: lng + 0.0015 }
    }).lean();

    const nearbyLocationIds = nearbyLocations.map(l => l._id);

    // Look for existing complaint of the same road damage type and road type
    const existingComplaint = await RoadDamage.findOne({
      locationId: { $in: nearbyLocationIds },
      roadType: mappedRoadType,
      $or: [
        { issueType: issueType },
        { roadDamage: issueType }
      ]
    });

    if (existingComplaint) {
      // Duplicate detected! Increment existing complaint supportCount/vote
      existingComplaint.supportCount = (existingComplaint.supportCount || 1) + 1;
      if (!existingComplaint.roadDamage) existingComplaint.roadDamage = issueType;
      if (!existingComplaint.roadType) existingComplaint.roadType = mappedRoadType;
      if (!existingComplaint.authority) existingComplaint.authority = roadInfo?.authority || 'Local Municipal Corporations';
      await existingComplaint.save();

      const matchedLoc = nearbyLocations.find(l => l._id.toString() === existingComplaint.locationId.toString()) || {};

      console.log(`🔄 Duplicate detected: Incrementing supportCount to ${existingComplaint.supportCount} for complaint ${existingComplaint._id}`);

      return res.json({
        success: true,
        duplicateDetected: true,
        message: "This issue has already been reported.\nYour submission has been counted as a support vote for this issue.",
        data: {
          _id:              existingComplaint._id,
          id:               `#RW-${existingComplaint._id.toString().slice(-4).toUpperCase()}`,
          location:         matchedLoc.location || locationString || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          roadName,
          highwayTag,
          roadType:         mappedRoadType,
          contractor:       roadInfo?.contractor      || 'Unknown',
          budgetAllocated:  roadInfo?.budgetAllocated || 'N/A',
          amountSpent:      roadInfo?.amountSpent     || 'N/A',
          lastRelayingDate: roadInfo?.lastRelayingDate || 'N/A',
          authority:        roadInfo?.authority       || 'Unknown',
          issueType,
          severity:         existingComplaint.severity || severity,
          condition:        existingComplaint.condition || condition,
          roadDamage:       issueType,
          confidence:       aiResult?.confidence              ?? null,
          priorityLevel:    aiResult?.priority_level          || null,
          priorityScore:    aiResult?.priority_score_normalized ?? null,
          severityScore:    aiResult?.severity_score           ?? null,
          roadHealthIndex:  aiResult?.road_health_index        ?? null,
          summary:          aiResult?.summary                  || null,
          report:           aiResult?.report                   || null,
          aiConnected:      aiResult !== null,
          supportCount:     existingComplaint.supportCount,
          status:           existingComplaint.status || 'Pending'
        }
      });
    }

    // ── No Duplicate Found: Create new complaint and location records ──
    const locationDoc = await Location.create({
      latitude: lat,
      longitude: lng,
      location: locationString || null
    });

    const newComplaint = await RoadDamage.create({
      locationId: locationDoc._id,
      issueType,
      severity,
      condition,
      roadDamage: issueType,
      roadType: mappedRoadType,
      supportCount: 1,
      status: 'Pending',
      authority: roadInfo?.authority || 'Local Municipal Corporations',
      submittedDate: new Date()
    });

    // Return combined response to frontend
    res.json({
      success: true,
      duplicateDetected: false,
      data: {
        _id:              newComplaint._id,
        id:               `#RW-${newComplaint._id.toString().slice(-4).toUpperCase()}`,
        location:         locationString || null,
        roadName,
        highwayTag,
        roadType:         mappedRoadType,
        contractor:       roadInfo?.contractor      || 'Unknown',
        budgetAllocated:  roadInfo?.budgetAllocated || 'N/A',
        amountSpent:      roadInfo?.amountSpent     || 'N/A',
        lastRelayingDate: roadInfo?.lastRelayingDate || 'N/A',
        authority:        roadInfo?.authority       || 'Unknown',
        issueType,
        severity,
        condition,
        roadDamage:              issueType,
        confidence:              aiResult?.confidence              ?? null,
        priorityLevel:           aiResult?.priority_level          || null,
        priorityScore:           aiResult?.priority_score_normalized ?? null,
        severityScore:           aiResult?.severity_score           ?? null,
        roadHealthIndex:         aiResult?.road_health_index        ?? null,
        summary:                 aiResult?.summary                  || null,
        report:                  aiResult?.report                   || null,
        aiConnected:             aiResult !== null,
        supportCount:            1,
        status:                  'Pending'
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Server error processing analysis' });
  }
};
