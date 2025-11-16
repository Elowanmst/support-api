const mongoose = require('mongoose');
const RequestType = require('../src/models/RequestType');
require('dotenv').config();

(async () => {
  try {
    console.log(' Seeding database...');

    await mongoose.connect(process.env.MONGO_URI);

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
