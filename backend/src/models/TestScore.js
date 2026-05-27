const mongoose = require('mongoose');
const { aiDB } = require('../config/db');

const testScoreSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, required: true },
  testScore: { type: Number, required: true }
}, { collection: 'testscore' });

module.exports = aiDB.model('TestScore', testScoreSchema);
