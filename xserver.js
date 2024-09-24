const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Endpoint to fetch weather data (Using Open Meteo)
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Coordinates (lat, lon) are required' });
  }

  try {
    // Open Meteo API call
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'temperature_2m,humidity_2m', // Add more parameters as needed
      },
    });
    
    // Send weather data back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

// Endpoint to fetch city suggestions using Mapbox Geocoding API
app.get('/api/cities', async (req, res) => {
  const query = req.query.q;
  const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN; // Ensure this key is set in your .env file

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
      {
        params: {
          access_token: MAPBOX_ACCESS_TOKEN,
          limit: 5, // Limit the number of results
          types: 'place', // Restrict results to cities or places
        },
      }
    );
    const cityData = response.data.features.map((feature) => {
      const countryContext = feature.context.find(c => c.id.startsWith('country'));
      const stateContext = feature.context.find(c => c.id.startsWith('region'));
      
      return {
        name: feature.text,
        full_name: feature.place_name,
        latitude: feature.center[1],
        longitude: feature.center[0],
        country: countryContext ? countryContext.text : null,
        state: stateContext ? stateContext.text : null,
      };
    });
    
    res.json(cityData);
  } catch (error) {
    console.error('Error fetching city suggestions:', error.message);
    res.status(500).json({ error: 'Error fetching city suggestions' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
