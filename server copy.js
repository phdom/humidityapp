// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Endpoint to fetch weather data
app.get('/api/weather', async (req, res) => {
  const { city, lat, lon } = req.query;
  const API_KEY = process.env.WEATHER_API_KEY;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({ error: 'City or coordinates are required' });
  }

  try {
    const params = {
      units: 'metric',
      appid: API_KEY,
    };

    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else if (city) {
      params.q = city;
    }

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      { params }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

// Endpoint to fetch city suggestions
app.get('/api/cities', async (req, res) => {
  const query = req.query.q;
  const API_KEY = process.env.WEATHER_API_KEY;

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
