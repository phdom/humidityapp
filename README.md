# AirAware - Smart Humidity Control

**Lower humidity inside your home by opening your windows at the right time.**

AirAware is a web application that helps you make informed decisions about when to open or close your windows based on real-time humidity comparisons between indoor and outdoor conditions. By analyzing temperature and humidity data, AirAware calculates absolute humidity levels to give you science-based recommendations.

## Features

- **Real-time Weather Data** - Fetches current outdoor conditions for any city worldwide
- **Indoor Monitoring** - Input your current indoor temperature and humidity
- **Smart Recommendations** - Calculates absolute humidity to determine if opening windows will help reduce indoor moisture
- **Dark Mode** - Automatic dark mode based on system preferences with manual toggle
- **Temperature Units** - Switch between Celsius and Fahrenheit
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **City Search** - Intelligent city search with autocomplete powered by Mapbox

## Tech Stack

- **Frontend**: React, Material-UI (MUI), Axios
- **Backend**: Node.js, Express
- **APIs**:
  - [Open-Meteo](https://open-meteo.com/) for weather data (free, no API key required)
  - [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/) for city search
- **Deployment**: Vercel-ready configuration

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Mapbox API Token** (free tier available)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/humidityapp.git
cd humidityapp
```

### 2. Get your Mapbox API Token

1. Sign up for a free account at [Mapbox](https://account.mapbox.com/auth/signup/)
2. Navigate to your [Access Tokens](https://account.mapbox.com/access-tokens/) page
3. Copy your default public token or create a new one

### 3. Set up environment variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Mapbox token
# MAPBOX_ACCESS_TOKEN=your_actual_token_here
```

### 4. Install dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 5. Run the application

#### Development Mode (runs both server and client)
```bash
npm run dev
```

This will start:
- Backend server at `http://localhost:5001`
- React frontend at `http://localhost:3000`

#### Production Mode
```bash
# Build the client
cd client
npm run build
cd ..

# Start the server
npm start
```

## Project Structure

```
humidityapp/
├── api/                    # Vercel serverless functions
│   ├── cities.js          # City search endpoint
│   └── weather.js         # Weather data endpoint
├── client/                # React frontend
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # React components
│       ├── assets/       # Images and logos
│       └── utils/        # Utility functions
├── xserver.js            # Express server (for local development)
├── vercel.json           # Vercel deployment configuration
└── package.json          # Root dependencies
```

## How It Works

AirAware uses the concept of **absolute humidity** (the actual amount of water vapor in the air) rather than just relative humidity to make recommendations:

1. **Input Your Data**: Enter your indoor temperature and relative humidity
2. **Select Location**: Search for your city to get current outdoor conditions
3. **Analysis**: The app calculates absolute humidity for both indoor and outdoor environments
4. **Recommendation**: If outdoor absolute humidity is lower than indoor, opening windows will help reduce indoor moisture

### The Science

Relative humidity alone isn't enough to determine if opening windows will help. A cold day at 80% relative humidity may have less moisture than a warm room at 50% relative humidity. AirAware calculates absolute humidity using temperature and relative humidity to give you accurate advice.

## Deployment

### Deploy to Vercel

The easiest way to deploy AirAware is using Vercel:

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your `MAPBOX_ACCESS_TOKEN` environment variable in Vercel project settings
4. Deploy!

The included `vercel.json` is already configured for deployment.

### Other Platforms

You can deploy to any platform that supports Node.js:
- Heroku
- Railway
- DigitalOcean App Platform
- Render

Just ensure you:
1. Set the `MAPBOX_ACCESS_TOKEN` environment variable
2. Build the client: `cd client && npm run build`
3. Start the server: `npm start`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MAPBOX_ACCESS_TOKEN` | Yes | Your Mapbox API access token for geocoding |
| `PORT` | No | Server port (defaults to 5001) |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Geocoding by [Mapbox](https://www.mapbox.com/)
- Developed in the humid, rainy charm of Aveiro, Portugal 🌂

## Support

If you find AirAware helpful, please consider giving it a star on GitHub!

## Future Enhancements

- [ ] Historical data tracking
- [ ] Push notifications for optimal window-opening times
- [ ] Multi-room monitoring
- [ ] Weather forecasts for planning ahead
- [ ] PWA support for mobile installation
