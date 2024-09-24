import axios from 'axios';

export default async function handler(req, res) {
  const { q } = req.query;

  // Log the query to check if it's being received correctly
  console.log('Query parameter (q):', q);

  // Validate the query parameter
  if (!q || q.length < 3) {
    console.log('Invalid query parameter');
    return res.status(400).json({ error: 'Query parameter "q" is required and should be at least 3 characters long.' });
  }

  // Log the API key to verify it's being read from environment variables
  console.log('API Key from env:', process.env.WEATHER_API_KEY);

  try {
    // Fetch city data from OpenWeatherMap's Geocoding API
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q,            // The city query from the user
        limit: 5,     // Limit the number of results
        appid: process.env.WEATHER_API_KEY  // Access the API key from the environment variables
      }
    });

    const cityData = response.data;

    // Log the response data to check if it's coming back correctly
    console.log('City data received:', cityData);

    // If no cities found, return an empty array
    if (!cityData.length) {
      console.log('No cities found for the given query');
      return res.status(404).json({ error: 'No cities found for the given query.' });
    }

    // Return the city data as JSON
    res.status(200).json(cityData);

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
