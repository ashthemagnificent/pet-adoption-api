const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_API_KEY = "AIzaSyBPk77UHG6rEdTOdAYr2GxbQscxqU9zyo0"; //process.env.GOOGLE_API_KEY; // Load API key from .env

// Get Nearby Veterinarians
router.get('/nearby', async (req, res) => {
  try {
    
    const { latitude, longitude, radius = 5000 } = req.query;

    // Check for required query parameters
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Build the Google Places API request URL
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=veterinary_care&key=${GOOGLE_API_KEY}`;

    // Fetch data from Google Places API
    const response = await axios.get(url);
    console.log('Google API Response:', response.data);

    // Process and send the response
    const veterinarians = response.data.results.map(vet => ({
      name: vet.name,
      address: vet.vicinity,
      rating: vet.rating || 'No rating',
      location: vet.geometry.location,
    }));

    res.json(veterinarians); // Send the processed data to the client
  } catch (err) {
    res.status(500).json({ error: 'Error fetching nearby veterinarians', details: err.message });
  }
});

module.exports = router;
