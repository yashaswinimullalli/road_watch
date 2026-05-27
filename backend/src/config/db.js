const mongoose = require('mongoose');

const connectDatabases = () => {
  const baseUri = process.env.MONGODB_URI;
  
  // Create 3 distinct connections for the 3 clusters
  const frontendUri = baseUri.replace('/roadwatch?', '/FrontendCluster?');
  const backendUri = baseUri.replace('/roadwatch?', '/BackendCluster?');
  const aiUri = baseUri.replace('/roadwatch?', '/AICluster?');

  const frontendDB = mongoose.createConnection(frontendUri);
  const backendDB = mongoose.createConnection(backendUri);
  const aiDB = mongoose.createConnection(aiUri);

  frontendDB.on('connected', () => console.log('✅ Connected to Frontend Cluster'));
  backendDB.on('connected', () => console.log('✅ Connected to Backend Cluster'));
  aiDB.on('connected', () => console.log('✅ Connected to AI Cluster'));

  return { frontendDB, backendDB, aiDB };
};

module.exports = connectDatabases();
