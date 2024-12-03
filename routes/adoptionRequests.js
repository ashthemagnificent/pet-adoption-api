const express = require('express');
const router = express.Router();
const { AdoptionRequest, Pet, User } = require('../models');

// Submit an Adoption Request
router.post('/', async (req, res) => {
  try {
    const { petId, userId } = req.body;

    const pet = await Pet.findById(petId);
    const user = await User.findById(userId);
    if (!pet || !user) return res.status(404).json({ error: 'Pet or user not found' });

    const request = new AdoptionRequest({ pet: petId, user: userId });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Error submitting adoption request', details: err.message });
  }
});

// List All Adoption Requests
router.get('/', async (req, res) => {
  try {
    const requests = await AdoptionRequest.find().populate('pet user');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching adoption requests', details: err.message });
  }
});

module.exports = router;
