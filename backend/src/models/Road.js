const mongoose = require('mongoose');
const { backendDB } = require('../config/db');

const roadSchema = new mongoose.Schema({
  roadType: { type: String, required: true },
  contractor: { type: String, required: true },
  budgetAllocated: { type: String, required: true },
  amountSpent: { type: String, required: true },
  lastRelayingDate: { type: Date, required: true },
  authority: { type: String, required: true }
}, { collection: 'roads' });

module.exports = backendDB.model('Road', roadSchema);
