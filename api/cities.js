// api/cities.js

export default function handler(req, res) {
  const { q } = req.query;

  // Validate the query parameter
  if (!q || q.length < 3) {
    return res.status(400).json({ error: 'Query parameter "q" is required and should be at least 3 characters long.' });
  }

  // Mock data - Replace this with your actual data fetching logic (e.g., from a database or external API)
  const cities = [
    { name: 'New York', country: 'USA', state: 'NY' },
    { name: 'Los Angeles', country: 'USA', state: 'CA' },
    { name: 'Chicago', country: 'USA', state: 'IL' },
    { name: 'Houston', country: 'USA', state: 'TX' },
    { name: 'Phoenix', country: 'USA', state: 'AZ' },
    // Add more cities as needed
  ];

  // Filter cities based on the query
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(q.toLowerCase())
  );

  res.status(200).json(filteredCities);
}
