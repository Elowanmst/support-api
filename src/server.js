const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const requestTypesRoutes = require('./routes/requestTypes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS middleware (pour les requêtes cross-origin si nécessaire)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});



// Middleware de logging des requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connexion à la base de données
connectDB();
main

// Routes
app.use('/api/request-types', requestTypesRoutes);

// GET /health - Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route de base
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Support API - Système de Support Client',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      requestTypes: '/api/request-types'
    }
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Middleware global de gestion d'erreurs
app.use((err, req, res, next) => {
feature/ci-cd-setup
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', err.stack);
  }

  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API endpoints: http://localhost:${PORT}/api/request-types`);
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt gracieux...');
  server.close(() => {
    console.log('Serveur fermé');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu, arrêt gracieux...');
  server.close(() => {
    console.log('Serveur fermé');
    process.exit(0);
  });
});


module.exports = app;
