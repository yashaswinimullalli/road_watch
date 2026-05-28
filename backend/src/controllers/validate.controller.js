const axios = require('axios');
const FormData = require('form-data');

const AI_VALIDATE_URL = 'http://localhost:8000/api/v1/validate-road-image';

/**
 * Validate whether the uploaded image is road/infrastructure related.
 *
 * Proxies the image to the FastAPI AI service validation endpoint.
 * Falls back to { isValid: true } if the AI service is unreachable,
 * so existing functionality is NEVER broken by service downtime.
 */
exports.validateRoadImage = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        isValid: false,
        message: 'No image provided for validation.',
      });
    }

    // Forward image buffer to the FastAPI validation endpoint
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename:    req.file.originalname || 'upload.jpg',
      contentType: req.file.mimetype     || 'image/jpeg',
    });

    const aiRes = await axios.post(AI_VALIDATE_URL, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 15000, // 15 s — lighter than full analysis timeout
    });

    const { is_valid, class_name, confidence, message } = aiRes.data;

    return res.json({
      success:    true,
      isValid:    is_valid,
      className:  class_name,
      confidence: confidence,
      message:    message,
    });

  } catch (err) {
    // AI service unavailable → fail-open so existing workflow is unaffected
    console.warn('⚠️  Image validation service unavailable, allowing through:', err.message);
    return res.json({
      success:   true,
      isValid:   true,
      className: 'unknown',
      confidence: 0,
      message:   'Validation service unavailable — proceeding.',
    });
  }
};
