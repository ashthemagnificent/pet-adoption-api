const express = require('express');
const router = express.Router();
const { AdoptionRequest } = require('../models');


// Get Adoption History for a User (including pending status)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query; // Optional query parameter for filtering by status

    // Build query object
    const query = { user: id };
    if (status) query.status = status; // If `status` query is provided, filter by it

    // Fetch adoption requests for the given user ID (filtered by status if provided)
    const adoptionHistory = await AdoptionRequest.find(query)
      .populate('pet') // Populate pet details
      .populate('user', 'name email'); // Populate limited user details (optional)

    // Check if the user has any adoption history
    if (!adoptionHistory || adoptionHistory.length === 0) {
      return res.status(404).json({ error: 'No adoption history found for this user.' });
    }

    // Return the adoption history
    res.json(adoptionHistory);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching adoption history', details: err.message });
  }
});

module.exports = router;
