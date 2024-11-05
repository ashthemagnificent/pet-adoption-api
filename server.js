const express = require('express');
const server = express(); 
const userRoutes = require('./routes/users');
const petRoutes = require('./routes/pets');
const port = 3000;

server.get('/', (req, res) => {
    res.send('Hello, Pet Adoption API!');
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
server.use(express.json()); // Middleware to parse JSON requests

server.use('/api/users', userRoutes); // Route for user-related endpoints
server.use('/api/pets', petRoutes);   // Route for pet-related endpoints
