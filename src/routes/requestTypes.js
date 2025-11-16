const express = require('express');
const router = express.Router();
const RequestType = require('../models/RequestType');


router.get('/', async (req, res) => {
  try {
    const requestTypes = await RequestType.find({ isActive: true });
    res.json(requestTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const requestType = await RequestType.findById(req.params.id);
    
    if (!requestType) {
      return res.status(404).json({ error: 'RequestType not found' });
    }
    
    res.json(requestType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const requestType = new RequestType(req.body);
    const savedRequestType = await requestType.save();
    res.status(201).json(savedRequestType);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;