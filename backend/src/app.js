require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Initialize Database Connections
require('./config/db'); 

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api.routes');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
