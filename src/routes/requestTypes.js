const express = require('express');

const RequestType = require('../models/RequestType');

const router = express.Router();

// GET /api/request-types - Liste tous les types actifs
router.get('/', async (req, res) => {
  try {
    const requestTypes = await RequestType.findActive();
    
    res.status(200).json({
      success: true,
      count: requestTypes.length,
      data: requestTypes
    });
  } catch (error) {
    console.error('Error fetching request types:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des types de demande',
      error: error.message
    });
  }
});

// GET /api/request-types/:id - Récupère un type par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const requestType = await RequestType.findById(id);
    
    if (!requestType) {
      return res.status(404).json({
        success: false,
        message: 'Type de demande non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: requestType
    });
  } catch (error) {
    console.error('Error fetching request type:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du type de demande',
      error: error.message
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
    
    const requestType = new RequestType({
      code,
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

