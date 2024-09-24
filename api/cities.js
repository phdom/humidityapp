// api/cities.js

import axios from 'axios';

export default async function handler(req, res) {
  const { q } = req.query;

  // Log the query parameter for debugging
  console.log('Query parameter (q):', q);

  // Validate the query parameter
  if (!q || q.length < 3) {
    console.log('Invalid query parameter');
    return res.status(400).json({ error: 'Query parameter "q" is required and should be at least 3 characters long.' });
  }

  // Log the Mapbox API key to verify it's being accessed (remove in production)
  console.log('Mapbox API Key:', process.env.MAPBOX_ACCESS_TOKEN);

  try {
    // Fetch city data from Mapbox Geocoding API
    const geoResponse = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`, {
      params: {
        access_token: process.env.MAPBOX_ACCESS_TOKEN, // Use your Mapbox access token
        limit: 5, // Limit the number of results
        types: 'place', // Restrict results to cities
      },
    });

    const geoData = geoResponse.data.features;

    // Log the received city data
    console.log('GeoData received:', geoData);

    // If no cities found, return a 404 error
    if (!geoData.length) {
      console.log('No cities found for the given query');
      return res.status(404).json({ error: 'No cities found for the given query.' });
    }

    // Map the data to a simplified format
    const simplifiedCities = geoData.map((city) => ({
      name: city.text,
      full_name: city.place_name,
      latitude: city.center[1],
      longitude: city.center[0],
      country: city.context.find((c) => c.id.startsWith('country')).text,
      state: city.context.find((c) => c.id.startsWith('region')) ? city.context.find((c) => c.id.startsWith('region')).text : null,
    }));

    // Return the simplified city data as JSON
    res.status(200).json(simplifiedCities);

  } catch (error) {
    console.error('Error fetching city data:', error.message);

    // Detailed error logging
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error in setting up request:', error.message);
    }

    // Return a 500 error if something goes wrong
    res.status(500).json({ error: 'Failed to fetch city data.' });
  }
}
