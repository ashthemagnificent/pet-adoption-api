const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_URL = 'https://pets-guide-book.p.rapidapi.com/rapidApi/v1/all';
const API_HEADERS = {
  'x-rapidapi-key': 'f558b5ea2emshd3a2a77f23dbe6bp155bfdjsn9f9f2e2aeaf2',
  'x-rapidapi-host': 'pets-guide-book.p.rapidapi.com',
  Referer: 'rapidapi.com',
};

// Get all care tips or filter by pet type
router.get('/', async (req, res) => {
  try {
    const { type } = req.query; // e.g., ?type=Dog
    const response = await axios.get(API_URL, { headers: API_HEADERS });

    // Filter by `common_name.en` if `type` is specified
    let careTips = response.data;

    if (type) {
      careTips = careTips.filter((tip) => tip.common_name.en.toLowerCase() === type.toLowerCase());
    }

    // Limit results to 10
    const limitedTips = careTips.slice(0, 10);

    // Map to desired shape
    const formattedTips = limitedTips.map((tip) => ({
      common_name: tip.common_name,
      scientific_name: tip.scientific_name,
      category: tip.category,
      description: tip.description,
      average_size: tip.average_size,
      average_weight: tip.average_weight,
      average_lifespan: tip.average_lifespan,
      general_temperament: tip.general_temperament,
      common_health_issues: tip.common_health_issues,
      feeding_recommendations: tip.feeding_recommendations,
      createdAt: tip.createdAt,
    }));

    res.json(formattedTips);
  } catch (err) {
    console.error('Error fetching care tips:', err.message);
    res.status(500).json({ error: 'Error fetching care tips from RapidAPI', details: err.message });
  }
});

module.exports = router;
