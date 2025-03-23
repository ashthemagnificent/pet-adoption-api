const express = require('express');
const router = express.Router();
const { AdoptionRequest, Pet, User } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { petId, userId } = req.body;

    const pet = await Pet.findById(petId);
    const user = await User.findById(userId);
    if (!pet || !user) return res.status(404).json({ error: 'Pet or user not found' });

    const request = new AdoptionRequest({
      pet: petId,
      user: userId,
      status: 'pending',
    });
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

// Update Adoption Request Status and Pet's Status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Allowed values: approved, rejected, pending.' });
    }

    // Find the adoption request
    const adoptionRequest = await AdoptionRequest.findById(id).populate('pet');
    if (!adoptionRequest) {
      return res.status(404).json({ error: 'Adoption request not found.' });
    }

    // Update the adoption request status
    adoptionRequest.status = status;
    await adoptionRequest.save();

    // If approved, update the pet's adoption status
    if (status === 'approved') {
      const pet = await Pet.findById(adoptionRequest.pet._id);
      if (pet) {
        pet.adoptionStatus = 'Adopted';
        await pet.save();
      }
    }

    res.json({
      message: 'Adoption request and pet status updated',
      adoptionRequest,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error updating adoption request and pet status', details: err.message });
  }
});
// Delete an Adoption Request (only if status is "pending")
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the adoption request
    const adoptionRequest = await AdoptionRequest.findById(id).populate('pet');
    if (!adoptionRequest) {
      return res.status(404).json({ error: 'Adoption request not found.' });
    }

    // Allow deletion only if the status is "pending"
    if (adoptionRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending adoption requests can be deleted.' });
    }

    // Delete the adoption request
    await AdoptionRequest.findByIdAndDelete(id);

    res.json({ message: 'Pending adoption request deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting adoption request', details: err.message });
  }
});

module.exports = router;
