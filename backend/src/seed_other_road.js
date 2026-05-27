require('dotenv').config();
const Road = require('./models/Road');

const otherRoadEntry = {
  roadType: "Other Road",
  contractor: "Local Road Contractor",
  budgetAllocated: "₹50 Lakhs",
  amountSpent: "₹42 Lakhs",
  lastRelayingDate: new Date("2024-08-15"),
  authority: "Local Municipal Corporations"
};

async function appendOtherRoad() {
  try {
    // Check if an "Other Road" entry already exists to avoid duplicates
    const existing = await Road.findOne({ roadType: "Other Road" });
    if (existing) {
      console.log("ℹ️  'Other Road' entry already exists in BackendCluster. Skipping insert.");
      process.exit(0);
    }

    await Road.create(otherRoadEntry);
    console.log("✅ 'Other Road' dummy entry appended to BackendCluster (roads collection).");
    console.log("📋 Existing data (NH, SH, MDR) is untouched.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting Other Road entry:", error);
    process.exit(1);
  }
}

// Delay to let DB connections establish
setTimeout(appendOtherRoad, 2000);
