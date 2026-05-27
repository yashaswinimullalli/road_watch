const mongoose = require('mongoose');
const { frontendDB } = require('../config/db');

const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { collection: 'location' });

module.exports = frontendDB.model('Location', locationSchema);
