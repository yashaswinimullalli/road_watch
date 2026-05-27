const mongoose = require('mongoose');
const { aiDB } = require('../config/db');

const roadDamageSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, required: true },
  issueType: { type: String, required: true },
  severity: { type: String, required: true },
  condition: { type: String, required: true }
}, { collection: 'roaddamage' });

module.exports = aiDB.model('RoadDamage', roadDamageSchema);
