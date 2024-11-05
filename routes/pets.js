const express = require('express');
const router = express.Router();

// Dummy data for pets
let pets = []; // This will be an array to store pet objects

// List all pets
router.get('/', (req, res) => {
    res.json(pets); // Return the list of pets
});

// Add a new pet
router.post('/', (req, res) => {
    const pet = req.body; // Get pet data from the request body
    pets.push(pet); // Add the pet to the array
    res.status(201).json(pet); // Respond with the created pet
});

module.exports = router; // Export the router
