// api/cities.js

const axios = require('axios');

module.exports = async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 3) {
    return res.status(400).json({ error: 'Query parameter "q" is required and should be at least 3 characters long.' });
  }

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`,
      {
        params: {
          access_token: process.env.MAPBOX_ACCESS_TOKEN,
          limit: 5,
          types: 'place',
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

    res.status(200).json(cityData);
  } catch (error) {
    console.error('Error fetching city suggestions:', error.message);
    res.status(500).json({ error: 'Error fetching city suggestions' });
  }
};
