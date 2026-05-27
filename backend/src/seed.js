require('dotenv').config();
const { frontendDB, backendDB, aiDB } = require('./config/db');
const Location = require('./models/Location');
const Road = require('./models/Road');
const TestScore = require('./models/TestScore');
const RoadDamage = require('./models/RoadDamage');

const dummyData = [
  { roadType: "National Highway", contractor: "L&T Constructions", budgetAllocated: "₹5.4 Crore", amountSpent: "₹4.8 Crore", lastRelayingDate: new Date("2025-01-10"), authority: "National Highways Authority of India" },
  { roadType: "National Highway", contractor: "GVK Infrastructure", budgetAllocated: "₹6.3 Crore", amountSpent: "₹5.5 Crore", lastRelayingDate: new Date("2025-01-28"), authority: "National Highways Authority of India" },
  { roadType: "State Highway", contractor: "ABC Infra Pvt Ltd", budgetAllocated: "₹3.2 Crore", amountSpent: "₹2.9 Crore", lastRelayingDate: new Date("2024-12-15"), authority: "Public Works Department" },
  { roadType: "State Highway", contractor: "ShivBuild Infra", budgetAllocated: "₹4.5 Crore", amountSpent: "₹4.0 Crore", lastRelayingDate: new Date("2025-02-11"), authority: "Public Works Department" },
  { roadType: "Major District Road", contractor: "Urban Roads Pvt Ltd", budgetAllocated: "₹2.1 Crore", amountSpent: "₹1.8 Crore", lastRelayingDate: new Date("2024-10-03"), authority: "Local Municipal Corporations" },
  { roadType: "Major District Road", contractor: "CityWorks Infra", budgetAllocated: "₹95 Lakhs", amountSpent: "₹80 Lakhs", lastRelayingDate: new Date("2024-07-30"), authority: "Local Municipal Corporations" }
];

async function seedDatabase() {
  try {
    // 1. Clear Frontend Cluster
    await Location.deleteMany({});
    console.log("✅ Cleared Frontend Cluster (location)");

    // 2. Clear & Seed Backend Cluster
    await Road.deleteMany({});
    await Road.insertMany(dummyData);
    console.log("✅ Seeded Backend Cluster (roads) with dummy data");

    // 3. Clear AI Cluster
    await TestScore.deleteMany({});
    await RoadDamage.deleteMany({});
    console.log("✅ Cleared AI Cluster (testscore, roaddamage)");

    console.log("🎉 Database structure is perfectly set up and seeded!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

// Small delay to ensure database connections are established
setTimeout(seedDatabase, 2000);
