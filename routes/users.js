const express = require('express');
const router = express.Router();

// Dummy data for users
let users = []; // This will be an array to store user objects

// Create a new user
router.post('/', (req, res) => {
    const user = req.body; // Get user data from the request body
    users.push(user); // Add the user to the array
    res.status(201).json(user); // Respond with the created user
});

// Get a user by ID
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id)); // Find user by ID
    if (user) {
        res.json(user); // Return user if found
    } else {
        res.status(404).send('User not found'); // Return 404 if not found
    }
});

module.exports = router; // Export the router
