require('dotenv').config();
const Location = require('./models/Location');

async function clearLocations() {
  try {
    const result = await Location.deleteMany({});
    console.log(`✅ Cleared location collection — ${result.deletedCount} document(s) removed.`);
    console.log('ℹ️  All other collections (roads, roaddamage, testscore) are untouched.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing locations:', error);
    process.exit(1);
  }
}

// Small delay to ensure the DB connection is established before running
setTimeout(clearLocations, 2000);
