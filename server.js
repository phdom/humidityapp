// server.js
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

// Endpoint to fetch city suggestions using OpenWeatherMap Geocoding API
app.get('/api/cities', async (req, res) => {
  const query = req.query.q;
  const API_KEY = process.env.WEATHER_API_KEY; // Ensure this key is set in your .env file

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/geo/1.0/direct',
      {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching city suggestions:', error.message);
    res.status(500).json({ error: 'Error fetching city suggestions' });
  }
});

// Serve static files from the React app (if applicable)
// const path = require('path');
// app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all handler to serve the React app for any requests that don't match the above
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
