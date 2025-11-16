const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const requestTypesRoutes = require('./routes/requestTypes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (désactivé en mode test)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Connexion DB
connectDB();

// Routes API
app.use('/api/request-types', requestTypesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Route de base
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Support API - Système de Support Client',
    version: '1.0.0',
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

// Middleware global d'erreurs
app.use((err, req, res) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', err.stack);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
  });
});

// Lancer serveur uniquement si pas en test
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });

  // Shutdown propre
  process.on('SIGTERM', () => {
    console.log('SIGTERM reçu, arrêt gracieux...');
    server.close(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    console.log('SIGINT reçu, arrêt gracieux...');
    server.close(() => process.exit(0));
  });
}

module.exports = app;
