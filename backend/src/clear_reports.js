require('dotenv').config();
const RoadDamage = require('./models/RoadDamage');

async function clearRoadDamage() {
  try {
    const result = await RoadDamage.deleteMany({});
    console.log(`✅ Cleared roaddamage collection — ${result.deletedCount} document(s) removed.`);
    console.log('ℹ️  All other collections (location, roads, testscore) are untouched.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing roaddamage:', error);
    process.exit(1);
  }
}

setTimeout(clearRoadDamage, 2000);
