const express = require('express');
const cors = require('cors');
require('dotenv').config();

const optimizadorRoutes = require('./src/interfaces/routes/optimizadorRoutes');
const ingestorRoutes = require('./src/interfaces/routes/ingestorRoutes');
const { getPool } = require('./src/infrastructure/database/mssqlClient');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Check DB connection on startup
getPool().catch(err => {
  console.error('Failed to connect to DB on startup');
});

// Routes
app.use('/api/optimizador', optimizadorRoutes);
app.use('/api/ingestor', ingestorRoutes);

app.listen(port, () => {
  console.log(`OptiPago Backend running on port ${port}`);
});
