
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', err.stack);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const server = app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` API endpoints: http://localhost:${PORT}/api/request-types`);
});


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
