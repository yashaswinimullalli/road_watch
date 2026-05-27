const mongoose = require('mongoose');
const { frontendDB } = require('../config/db');

const locationSchema = new mongoose.Schema({
  latitude: { type: Number },
  longitude: { type: Number },
  location: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { collection: 'location' });

module.exports = frontendDB.model('Location', locationSchema);
