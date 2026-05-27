const axios = require('axios');
const Location = require('../models/Location');
const Road = require('../models/Road');
const RoadDamage = require('../models/RoadDamage');
const TestScore = require('../models/TestScore');

// 5. Backend maps road type
const mapRoadType = (highwayTag) => {
  if (highwayTag === 'trunk') return 'National Highway';
  if (highwayTag === 'primary') return 'State Highway';
  if (highwayTag === 'secondary') return 'Major District Road';
  return 'Local Road'; // Fallback
};

exports.processAnalysis = async (req, res) => {
  try {
    // 1. Frontend gets latitude & longitude
    // 2. Frontend sends coordinates to Backend
    const { lat, lng } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Save location to Frontend Cluster
    const location = await Location.create({ latitude: lat, longitude: lng });

    // 3. Backend sends latitude & longitude to Overpass API
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];way(around:20,${lat},${lng})[highway];out tags;`;
    const overpassRes = await axios.get(overpassUrl);
    
    // 4. Overpass API returns highway tag
    let highwayTag = 'unknown';
    if (overpassRes.data && overpassRes.data.elements.length > 0) {
      highwayTag = overpassRes.data.elements[0].tags.highway;
    }

    // 5. Backend maps road type
    const mappedRoadType = mapRoadType(highwayTag);

    // 6. Backend fetches matching dummy road data from roads cluster
    // Using $sample to randomly pick a contractor if multiple exist for the same roadType
    const matchingRoadData = await Road.aggregate([
      { $match: { roadType: mappedRoadType } },
      { $sample: { size: 1 } }
    ]);
    const roadInfo = matchingRoadData.length > 0 ? matchingRoadData[0] : null;

    // 7. Image is directly sent to AI for analysis
    // For hackathon dummy logic, we simulate the AI response based on a description or randomly
    const dummyAiResponse = {
      issueType: 'Pothole',
      severity: 'High',
      condition: 'Poor',
      testScore: Math.floor(Math.random() * (99 - 70 + 1)) + 70 // Random score between 70-99
    };

    // 8. AI stores testscore and roaddamage in AI Cluster
    await RoadDamage.create({
      locationId: location._id,
      issueType: dummyAiResponse.issueType,
      severity: dummyAiResponse.severity,
      condition: dummyAiResponse.condition
    });

    await TestScore.create({
      locationId: location._id,
      testScore: dummyAiResponse.testScore
    });

    // 9. Frontend displays the combined data
    res.json({
      success: true,
      data: {
        roadType: mappedRoadType,
        contractor: roadInfo ? roadInfo.contractor : 'Unknown',
        budgetAllocated: roadInfo ? roadInfo.budgetAllocated : 'N/A',
        amountSpent: roadInfo ? roadInfo.amountSpent : 'N/A',
        lastRelayingDate: roadInfo ? roadInfo.lastRelayingDate : 'N/A',
        authority: roadInfo ? roadInfo.authority : 'Unknown',
        roadDamage: dummyAiResponse.condition, // Based on spec requirements
        testScore: dummyAiResponse.testScore
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Server error processing analysis' });
  }
};
