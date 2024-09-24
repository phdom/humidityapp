// api/cities.js

const axios = require('axios');

module.exports = async (req, res) => {
  const { q } = req.query;

  console.log('Query parameter (q):', q);

  // Validate the query parameter
  if (!q || q.length < 3) {
    console.log('Invalid query parameter');
    return res.status(400).json({ error: 'Query parameter "q" is required and should be at least 3 characters long.' });
  }

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

    console.log('GeoData received:', geoData);

    // If no cities found, return a 404 error
    if (!geoData.length) {
      console.log('No cities found for the given query');
      return res.status(404).json({ error: 'No cities found for the given query.' });
    }

    // Map the data to a simplified format
    const simplifiedCities = geoData.map((city) => {
      const countryContext = city.context.find((c) => c.id.startsWith('country'));
      const stateContext = city.context.find((c) => c.id.startsWith('region'));

      return {
        name: city.text,
        full_name: city.place_name,
        latitude: city.center[1],
        longitude: city.center[0],
        country: countryContext ? countryContext.text : null,
        state: stateContext ? stateContext.text : null,
      };
    });

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
};
