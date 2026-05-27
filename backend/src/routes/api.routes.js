const express = require('express');
const router = express.Router();
const processController = require('../controllers/process.controller');

// Main POST route for the 9-step flow
router.post('/analyze-road', processController.processAnalysis);

module.exports = router;
