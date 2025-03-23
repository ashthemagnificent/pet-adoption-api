const express = require('express');
const router = express.Router();
const { User } = require('../models');
//const AdoptionRequest = require('../models/AdoptionRequest'); 
// Create a User
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error creating user', details: err.message });
  }
});

// Get All Users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('favorites'); // Populate 'favorites' if needed
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users', details: err.message });
  }
});

// Get User by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favorites');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user', details: err.message });
  }
});
// Update User
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error updating user', details: err.message });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user', details: err.message });
  }
});

// Add a Pet to Favorites
router.post('/:id/favorites/:petId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.favorites.push(req.params.petId);
    await user.save();
    res.json({ message: 'Pet added to favorites', user });
  } catch (err) {
    res.status(500).json({ error: 'Error adding to favorites', details: err.message });
  }
});

// Get User Favorites
router.get('/:id/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favorites');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching favorites', details: err.message });
  }                       
});                  
 

// Remove a Pet from Favorites
router.delete('/:id/favorites/:petId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const index = user.favorites.indexOf(req.params.petId);
    if (index === -1) {
      return res.status(404).json({ error: 'Pet not found in favorites' });
    }

    // Remove the petId from favorites
    user.favorites.splice(index, 1);
    await user.save();
    res.json({ message: 'Pet removed from favorites', user });
  } catch (err) {
    res.status(500).json({ error: 'Error removing from favorites', details: err.message });
  }
});
// Rate a User
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.rating = rating; //add the single rating field
    await user.save();
    res.json({ message: 'Rating added', user });
  } catch (err) {
    res.status(500).json({ error: 'Error adding rating', details: err.message });
  }
});

// Get Rating for a User
router.get('/:id/rate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ rating: user.rating });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching rating', details: err.message });
  }
});
// Update Rating for a User
router.put('/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.rating = rating; // Update the single rating field
    await user.save();
    res.json({ message: 'Rating updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Error updating rating', details: err.message });
  }
});


// Delete Rating for a User
router.delete('/:id/rate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.rating = null; // Set the rating to null to "delete" it
    await user.save();
    res.json({ message: 'Rating deleted', user });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting rating', details: err.message });
  }
});


module.exports = router;
