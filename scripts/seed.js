const mongoose = require('mongoose');
const RequestType = require('../src/models/RequestType');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/support_api';

const seedData = [
  {
    code: 'TECH_ISSUE',
    name: 'Problème technique',
    description: 'Problèmes liés au fonctionnement technique de l\'application ou du service',
    priority: 'high',
    category: 'Technique',
    estimatedResponseTime: 4,
    isActive: true
  },
  {
    code: 'BILLING_QUESTION',
    name: 'Question de facturation',
    description: 'Questions relatives aux factures, paiements et abonnements',
    priority: 'medium',
    category: 'Finance',
    estimatedResponseTime: 24,
    isActive: true
  },
  {
    code: 'ACCOUNT_MODIFICATION',
    name: 'Demande de modification de compte',
    description: 'Demandes de modification des informations de profil ou paramètres du compte',
    priority: 'medium',
    category: 'Compte',
    estimatedResponseTime: 8,
    isActive: true
  },
  {
    code: 'FEATURE_REQUEST',
    name: 'Demande de fonctionnalité',
    description: 'Suggestions d\'amélioration ou demandes de nouvelles fonctionnalités',
    priority: 'low',
    category: 'Développement',
    estimatedResponseTime: 72,
    isActive: true
  },
  {
    code: 'COMPLAINT',
    name: 'Réclamation',
    description: 'Réclamations concernant le service ou l\'expérience utilisateur',
    priority: 'critical',
    category: 'Service Client',
    estimatedResponseTime: 2,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connexion réussie à MongoDB');

    console.log('🗑️  Suppression des données existantes...');
    await RequestType.deleteMany({});
    console.log('✅ Données existantes supprimées');

    console.log('🌱 Insertion des données initiales...');
    const insertedData = await RequestType.insertMany(seedData);
    console.log(`✅ ${insertedData.length} types de demande créés avec succès`);

    // Affichage des données créées
    console.log('\n📋 Types de demande créés :');
    insertedData.forEach((item, index) => {
      console.log(`${index + 1}. ${item.code} - ${item.name} (${item.priority})`);
    });

    console.log('\n🎉 Seeding terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
    process.exit(0);
  }
}

// Exécution du script si lancé directement
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedData };
