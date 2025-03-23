const express = require('express');
const axios = require('axios');
const router = express.Router();
const IPSTACK_API_KEY = process.env.IPSTACK_API_KEY || 'ff078eadccf3564421591c7bf1ee1c3f';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyBPk77UHG6rEdTOdAYr2GxbQscxqU9zyo0'; // Replace with your Google API key
//const GOOGLE_API_KEY = "AIzaSyBPk77UHG6rEdTOdAYr2GxbQscxqU9zyo0"; //process.env.GOOGLE_API_KEY; // Load API key from .env
// Helper function to get location from IP (server-side fallback)
/*const getLocationFromIP = async (ip) => {
  const IPSTACK_API_KEY = "ff078eadccf3564421591c7bf1ee1c3f_API_KEY"; // Replace with your actual key
  const url = `http://api.ipstack.com/${ip}?access_key=${IPSTACK_API_KEY}`;
  const response = await axios.get(url);
  const { latitude, longitude } = response.data;
  return { latitude, longitude };
};*/
// Get Nearby Veterinarians Using Dynamic Location
router.get('/nearby', async (req, res) => {
  try {
    let { latitude, longitude, radius = 5000 } = req.query;

    // If latitude and longitude are not provided, fetch them from IPStack
    if (!latitude || !longitude) {
      const ipstackUrl = `http://api.ipstack.com/check?access_key=${IPSTACK_API_KEY}`;
      const ipstackResponse = await axios.get(ipstackUrl);

      if (!ipstackResponse.data || !ipstackResponse.data.latitude || !ipstackResponse.data.longitude) {
        return res
          .status(500)
          .json({ error: 'Latitude and longitude are required or could not be retrieved from IPStack.' });
      }

      latitude = ipstackResponse.data.latitude;
      longitude = ipstackResponse.data.longitude;
    }

    // Build the Google Places API request URL
    const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=veterinary_care&key=${GOOGLE_API_KEY}`;

    // Fetch data from Google Places API
    const googleResponse = await axios.get(googlePlacesUrl);

    // Process the response
    const veterinarians = googleResponse.data.results.map(vet => ({
      name: vet.name,
      address: vet.vicinity,
      rating: vet.rating || 'No rating',
      location: vet.geometry.location,
    }));

    // Send the processed data to the client
    res.json(veterinarians);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching nearby veterinarians', details: err.message });
  }
});

module.exports = router;