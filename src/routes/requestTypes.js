const express = require('express');
const RequestType = require('../models/RequestType');

const router = express.Router();


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


router.post('/', async (req, res) => {
  try {
    const { code, name, description, priority, category, estimatedResponseTime } = req.body;

    if (!code || !name || !description || !category || !estimatedResponseTime) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs requis doivent être fournis',
        required: ['code', 'name', 'description', 'category', 'estimatedResponseTime']
      });
    }

    const existingType = await RequestType.findOne({ code: code.toUpperCase() });
    if (existingType) {
      return res.status(409).json({
        success: false,
        message: 'Un type de demande avec ce code existe déjà'
      });
    }

    const requestType = await RequestType.create({
      code: code.toUpperCase(),
      name,
      description,
      priority,
      category,
      estimatedResponseTime
    });

    res.status(201).json({
      success: true,
      message: 'Type de demande créé avec succès',
      data: requestType
    });

  } catch (error) {

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: messages
      });
    }

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
