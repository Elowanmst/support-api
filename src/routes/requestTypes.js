const express = require('express');

const router = express.Router();
const RequestType = require('../models/RequestType');

// GET /api/request-types - Liste tous les types actifs
router.get('/', async (req, res) => {
  try {
    const requestTypes = await RequestType.find({ isActive: true });
    res.json({
      success: true,
      data: requestTypes,
      count: requestTypes.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// GET /api/request-types/:id - Récupère un type par ID
router.get('/:id', async (req, res) => {
  try {
    const requestType = await RequestType.findById(req.params.id);
    
    if (!requestType) {
      return res.status(404).json({ 
        success: false,
        message: 'Type de demande non trouvé' 
      });
    }
    
    res.json({
      success: true,
      data: requestType
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// POST /api/request-types - Crée un nouveau type
router.post('/', async (req, res) => {
  try {
    const { code, name, description, priority, category, estimatedResponseTime } = req.body;
    
    // Validation des champs requis
    if (!code || !name || !description || !category || !estimatedResponseTime) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs requis doivent être fournis',
        required: ['code', 'name', 'description', 'category', 'estimatedResponseTime']
      });
    }
    
    // Vérifier si le code existe déjà
    const existingType = await RequestType.findOne({ code: code.toUpperCase() });
    if (existingType) {
      return res.status(409).json({
        success: false,
        message: 'Un type de demande avec ce code existe déjà'
      });
    }

    const requestType = new RequestType({
      code: code.toUpperCase(),
      name,
      description,
      priority,
      category,
      estimatedResponseTime
    });
    
    const savedRequestType = await requestType.save();
    
    res.status(201).json({
      success: true,
      message: 'Type de demande créé avec succès',
      data: savedRequestType
    });
  } catch (error) {
    console.error('Error creating request type:', error);
    
    // Gestion des erreurs de validation MongoDB
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: messages
      });
    }
    
    // Gestion des erreurs de duplication
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Un type de demande avec ce code existe déjà'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du type de demande',
      error: error.message
    });
  }
});

module.exports = router;

