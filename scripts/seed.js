const mongoose = require('mongoose');
const RequestType = require('../src/models/RequestType');
require('dotenv').config();

(async () => {
  try {
    console.log('Seeding database...');

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/support_api';
    await mongoose.connect(uri);

    await RequestType.deleteMany();

    await RequestType.insertMany([
      {
        code: 'BUG',
        name: 'Bug Technique',
        description: 'Problème technique',
        category: 'Incident',
        priority: 'high',
        estimatedResponseTime: 24,
        isActive: true
      },
      {
        code: 'REQ',
        name: 'Requête',
        description: 'Demande générale',
        category: 'Service',
        priority: 'medium',
        estimatedResponseTime: 48,
        isActive: true
      }
    ]);

    console.log('✔ Seed completed');
    process.exit(0);

  } catch (err) {
    console.error(' Seed failed:', err);
    process.exit(1);
  }
})();
