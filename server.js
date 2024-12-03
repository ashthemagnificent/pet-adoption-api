const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const petRoutes = require('./routes/pets');
const adoptionRequestRoutes = require('./routes/adoptionRequests');
const careTipRoutes = require('./routes/careTips');
const messageRoutes = require('./routes/messages');
const veterinarianRoutes = require('./routes/veterinarians');



// Load environment variables
dotenv.config();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const server = express();
const port = 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/petAdoption', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
server.use(express.json());

// Routes

server.use('/api/users', userRoutes);
server.use('/api/pets', petRoutes);
server.use('/api/adoption-requests', adoptionRequestRoutes);
server.use('/api/care-tips', careTipRoutes);
server.use('/api/messages', messageRoutes);
server.use('/api/veterinarians', veterinarianRoutes);

// Default Route
server.get('/', (req, res) => {
  res.send('Welcome to the Pet Adoption API!');
});

// Start Server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
