const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const userRoutes = require('./routes/users');
const petRoutes = require('./routes/pets');
const adoptionRequestRoutes = require('./routes/adoptionRequests');
const careTipRoutes = require('./routes/careTips');
const messageRoutes = require('./routes/messages');
const veterinarianRoutes = require('./routes/veterinarians');
const adoptionHistoryRoutes = require('./routes/adoptionHistory');

const server = express();
const port = 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/petAdoption', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to handle slow database startups
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
server.use(express.json());

// Routes
server.use('/api/users', userRoutes); // User-related routes
server.use('/api/pets', petRoutes); // Pet-related routes
server.use('/api/adoption-requests', adoptionRequestRoutes); // Adoption request routes
server.use('/api/care-tips', careTipRoutes); // Care tips routes
server.use('/api/messages', messageRoutes); // Message routes
server.use('/api/veterinarians', veterinarianRoutes); // Veterinarian routes
// Update server.js
server.use('/api/adoption-history', adoptionHistoryRoutes); // Change the base route for adoption history


// Default Route
server.get('/', (req, res) => {
  res.send('Welcome to the Pet Adoption API!');
});

// Start Server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
