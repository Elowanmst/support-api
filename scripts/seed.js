const mongoose = require('mongoose');
require('dotenv').config();
const RequestType = require('../src/models/RequestType');

const seedData = [
  {
    code: 'BUG_REPORT',
    name: 'Bug Report',
    description: 'Signaler un dysfonctionnement dans le système',
    category: 'Technique',
    priority: 'high',
    estimatedResponseTime: 24
  },
  {
    code: 'FEATURE_REQUEST',
    name: 'Demande de fonctionnalité',
    description: 'Proposer une nouvelle fonctionnalité',
    category: 'Évolution',
    priority: 'medium',
    estimatedResponseTime: 72
  },
  {
    code: 'SUPPORT',
    name: 'Support technique',
    description: 'Aide et assistance technique',
    category: 'Support',
    priority: 'medium',
    estimatedResponseTime: 12
  },
  {
    code: 'ACCOUNT_ISSUE',
    name: 'Problème de compte',
    description: 'Questions relatives aux comptes utilisateurs',
    category: 'Compte',
    priority: 'high',
    estimatedResponseTime: 6
  },
  {
    code: 'GENERAL_INQUIRY',
    name: 'Question générale',
    description: 'Questions générales et informations',
    category: 'Général',
    priority: 'low',
    estimatedResponseTime: 48
  }
];

const seedDatabase = async () => {
  try {

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/support_api';
    await mongoose.connect(mongoURI);
    
    console.log('Connected to MongoDB for seeding...');
    
    // Nettoyer et réinsérer les données

    await RequestType.deleteMany({});
    const inserted = await RequestType.insertMany(seedData);
    
    console.log(`Database seeded successfully! Inserted ${inserted.length} RequestTypes.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Exécuter uniquement si le fichier est appelé directement
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedData, seedDatabase };