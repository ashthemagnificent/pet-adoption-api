const express = require('express');
const router = express.Router();
const { Pet } = require('../models');

// List All Pets with Optional Filters
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const pets = type ? await Pet.find({ type }) : await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pets', details: err.message });
  }
});

// Get Pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pet', details: err.message });
  }
});

// Add a Pet
router.post('/', async (req, res) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Error adding pet', details: err.message });
  }
});

// Update Pet
router.put('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Error updating pet', details: err.message });
  }
});

// Delete Pet
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting pet', details: err.message });
  }
});

// Mark Pet as Adopted
router.post('/:id/adopt', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    pet.adoptionStatus = 'Adopted';
    await pet.save();
    res.json({ message: 'Pet adopted', pet });
  } catch (err) {
    res.status(500).json({ error: 'Error marking pet as adopted', details: err.message });
  }
});

module.exports = router;
