import axios from 'axios';

export default async function handler(req, res) {
  const { q } = req.query;

  // Validate the query parameter
  if (!q || q.length < 3) {
    return res.status(400).json({ error: 'Query parameter "q" is required and should be at least 3 characters long.' });
  }

  try {
    // Fetch city data from OpenWeatherMap's Geocoding API
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q,            // The city query from the user
        limit: 5,     // Limit the number of results
        appid: process.env.WEATHER_API_KEY  // Now this matches your .env
  // Use your OpenWeatherMap API key from environment variables
      }
    });

    const cityData = response.data;

    // If no cities found, return an empty array
    if (!cityData.length) {
      return res.status(404).json({ error: 'No cities found for the given query.' });
    }

    // Return the city data as JSON
    res.status(200).json(cityData);

  } catch (error) {
    console.error('Error fetching city data:', error.message);
    res.status(500).json({ error: 'Failed to fetch city data.' });
  }
}
