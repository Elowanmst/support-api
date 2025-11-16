const mongoose = require('mongoose');
const RequestType = require('../src/models/RequestType');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/support_api';
require('dotenv').config();

(async () => {
  try {
    console.log(' Seeding database...');

    await mongoose.connect(uri);

    await RequestType.deleteMany();

    await RequestType.insertMany([
      {
        code: 'BUG',
        label: 'Bug Technique',
        description: 'Problème technique',
      },
      { code: 'REQ', label: 'Requête', description: 'Demande générale' },
    ]);

    console.log('✔ Seed completed');
    process.exit(0);
  } catch (err) {
    console.error(' Seed failed:', err);
    process.exit(1);
  }
})();
