const express = require('express');
const router = express.Router();
const { CareTip } = require('../models');


// Example route for testing
router.get('/', (req, res) => {
  res.send('Care tips route is working!');
});

module.exports = router; // Export the router

// List All Care Tips
router.get('/', async (req, res) => {
  try {
    const tips = await CareTip.find();
    res.json(tips);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching care tips', details: err.message });
  }
});

// Get Care Tips by Pet Type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const tips = await CareTip.findOne({ type });
    if (!tips) return res.status(404).json({ error: 'Care tips not found for this type' });

    res.json(tips);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching care tips', details: err.message });
  }
});

// Add New Care Tips
router.post('/', async (req, res) => {
  try {
    const { type, tips } = req.body;
    if (!type || !tips || !Array.isArray(tips))
      return res.status(400).json({ error: 'Type and tips array are required' });

    const newCareTip = new CareTip({ type, tips });
    await newCareTip.save();
    res.status(201).json(newCareTip);
  } catch (err) {
    res.status(500).json({ error: 'Error adding care tips', details: err.message });
  }
});

// Update Care Tips
router.put('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const updatedTips = await CareTip.findOneAndUpdate({ type }, req.body, { new: true });

    if (!updatedTips) return res.status(404).json({ error: 'Care tips not found for this type' });
    res.json(updatedTips);
  } catch (err) {
    res.status(500).json({ error: 'Error updating care tips', details: err.message });
  }
});

// Delete Care Tips by Pet Type
router.delete('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const deletedTips = await CareTip.findOneAndDelete({ type });

    if (!deletedTips) return res.status(404).json({ error: 'Care tips not found for this type' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting care tips', details: err.message });
  }
});

module.exports = router;
