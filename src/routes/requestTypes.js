const express = require('express');
const router = express.Router();
const RequestType = require('../models/RequestType');

// GET /api/request-types
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

// GET /api/request-types/:id
router.get('/:id', async (req, res) => {
  try {
    const requestType = await RequestType.findById(req.params.id);
    
    if (!requestType) {
      return res.status(404).json({ 
        success: false,
        message: 'RequestType non trouvé' 
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

// POST /api/request-types
router.post('/', async (req, res) => {
  try {
    // Vérifier si le code existe déjà
    const existingType = await RequestType.findOne({ code: req.body.code });
    if (existingType) {
      return res.status(409).json({
        success: false,
        message: `Un RequestType avec le code "${req.body.code}" existe déjà`
      });
    }

    const requestType = new RequestType(req.body);
    const savedRequestType = await requestType.save();
    
    res.status(201).json({
      success: true,
      data: savedRequestType
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;