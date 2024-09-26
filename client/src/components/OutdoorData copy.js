import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { getHumidityAdvice, calculateAbsoluteHumidity } from '../utils/humidityCalculations';
import {
  WbSunny,
  Cloud,
  Grain,
  Opacity,
  Thermostat,
  Air,
  WbTwilight,
  WaterDrop,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import MathExplanation from './MathExplanation';

// Mapping of weather codes to descriptions, icons, and colors
const WEATHER_CODES = {
  0: { description: 'Clear sky', Icon: WbSunny, color: '#fbc02d' },
  1: { description: 'Mainly clear', Icon: Cloud, color: '#9e9e9e' },
  2: { description: 'Partly cloudy', Icon: Cloud, color: '#9e9e9e' },
  3: { description: 'Overcast', Icon: Cloud, color: '#616161' },
  45: { description: 'Foggy', Icon: Cloud, color: '#b0bec5' },
  48: { description: 'Foggy with rime', Icon: Cloud, color: '#b0bec5' },
  51: { description: 'Light drizzle', Icon: Grain, color: '#64b5f6' },
  53: { description: 'Moderate drizzle', Icon: Grain, color: '#42a5f5' },
  55: { description: 'Dense drizzle', Icon: Grain, color: '#2196f3' },
  61: { description: 'Slight rain', Icon: Grain, color: '#1e88e5' },
  63: { description: 'Moderate rain', Icon: Grain, color: '#1976d2' },
  65: { description: 'Heavy rain', Icon: Grain, color: '#1565c0' },
  71: { description: 'Slight snow', Icon: Grain, color: '#90caf9' },
  73: { description: 'Moderate snow', Icon: Grain, color: '#64b5f6' },
  75: { description: 'Heavy snow', Icon: Grain, color: '#42a5f5' },
  95: { description: 'Thunderstorm', Icon: Grain, color: '#ffa000' },
  96: { description: 'Thunderstorm with slight hail', Icon: Grain, color: '#ff8f00' },
  99: { description: 'Thunderstorm with heavy hail', Icon: Grain, color: '#ff6f00' },
};

// Array for compass direction mapping
const COMPASS_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// Function to get the appropriate weather icon based on weather code
const getWeatherIcon = (code) => {
  const weather = WEATHER_CODES[code] || WEATHER_CODES[1] || { Icon: HelpOutlineIcon, color: '#000000' };
  const { Icon, color } = weather;
  return <Icon fontSize="medium" style={{ color }} />;
};

// Function to convert wind direction degrees to compass directions
const convertWindDirection = (deg) => COMPASS_DIRECTIONS[Math.round(deg / 45) % 8];

// Function to get styling for humidity advice box
const getAdviceStyle = (humidity) => ({
  icon: <Opacity fontSize="large" style={{ color: '#ffffff' }} />,
  backgroundColor: '#3881A1',
  textColor: '#ffffff',
});

// Component to display individual weather information
const WeatherInfo = ({ icon, label, value }) => (
  <Grid item xs={12} sm={6}>
    <Box display="flex" alignItems="center">
      {icon}
      <Typography variant="body1" sx={{ ml: 1 }}>
        <strong>{label}:</strong> {value}
      </Typography>
    </Box>
  </Grid>
);

// Main OutdoorData component
const OutdoorData = ({ city, state, country, indoorData, isCelsius }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [humidityAdvice, setHumidityAdvice] = useState('');
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Function to fetch weather data from Open-Meteo
  const fetchWeatherData = async (lat, lon) => {
    try {
      const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'temperature_2m,apparent_temperature,relativehumidity_2m,winddirection_10m,precipitation_probability,weathercode',
          current_weather: true,
          timezone: 'auto',
        },
      });

      const currentHour = new Date(data.current_weather.time).getHours();
      setWeatherData({
        temperature: data.current_weather.temperature,
        apparentTemperature: data.hourly.apparent_temperature[currentHour],
        windspeed: data.current_weather.windspeed,
        winddirection: data.hourly.winddirection_10m[currentHour],
        precipitationProbability: data.hourly.precipitation_probability[currentHour],
        weathercode: data.current_weather.weathercode,
        relativehumidity: data.hourly.relativehumidity_2m[currentHour],
      });

      console.log(`Received Weather Code: ${data.current_weather.weathercode}`);
    } catch (err) {
      console.error('Error fetching weather data:', err.message);
      setError('Error fetching weather data. Please try again.');
    }
  };

  // Memoized fetchCoordinates function using Mapbox Geocoding API
  const fetchCoordinates = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          city
        )},${encodeURIComponent(state)},${encodeURIComponent(country)}.json`,
        {
          params: {
            access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
            limit: 1,
            types: 'place',
          },
        }
      );

      if (data.features.length) {
        const [lon, lat] = data.features[0].center;
        fetchWeatherData(lat, lon);
      } else {
        setError(`Could not find coordinates for "${city}, ${state}, ${country}".`);
      }
    } catch (err) {
      console.error('Error fetching coordinates:', err.message);
      setError(`Error fetching location for "${city}, ${state}, ${country}". Please try again.`);
    }
  }, [city, state, country]);

  // Fetch coordinates when the component mounts or city/country changes
  useEffect(() => {
    if (city && country) fetchCoordinates();
  }, [city, state, country, fetchCoordinates]);

  // Update humidity advice when weather data or indoor data changes
  useEffect(() => {
    if (
      weatherData &&
      indoorData.temperature !== '' &&
      indoorData.humidity !== '' &&
      !isNaN(indoorData.temperature) &&
      !isNaN(indoorData.humidity)
    ) {
      console.log('Calculating Humidity Advice with:');
      console.log(`Indoor Temp (C): ${indoorData.temperature}`);
      console.log(`Indoor RH: ${indoorData.humidity}%`);
      console.log(`Outdoor Temp (C): ${weatherData.temperature}`);
      console.log(`Outdoor RH: ${weatherData.relativehumidity}%`);

      const advice = getHumidityAdvice(
        indoorData.temperature,
        indoorData.humidity,
        weatherData.temperature,
        weatherData.relativehumidity
      );
      setHumidityAdvice(advice);
    } else {
      setHumidityAdvice('');
    }
  }, [weatherData, indoorData, isCelsius]);

  // Handle error states
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!weatherData) return <Typography align="center"><CircularProgress /></Typography>;

  const adviceStyle = getAdviceStyle(weatherData.relativehumidity);

  // Function to convert Celsius to Fahrenheit
  const toFahrenheit = (celsius) => (celsius * 9 / 5) + 32;

  // Determine the temperature based on selected unit
  const displayTemperature = (temp) => isCelsius
    ? `${temp}°C`
    : `${toFahrenheit(temp).toFixed(1)}°F`;

  // Calculate Absolute Humidity for explanation
  const AH_indoor = calculateAbsoluteHumidity(indoorData.temperature, indoorData.humidity);
  const AH_outdoor = calculateAbsoluteHumidity(weatherData.temperature, weatherData.relativehumidity);
  const AH_difference = AH_indoor - AH_outdoor;

  return (
    <Card
      sx={{
        mb: 4,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: '15px',
        boxShadow: theme.shadows[3],
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          Weather in {city}, {state ? `${state}, ` : ''}{country}
        </Typography>

        <Grid container spacing={2}>
          <WeatherInfo
            icon={getWeatherIcon(weatherData.weathercode)}
            label="Condition"
            value={WEATHER_CODES[weatherData.weathercode]?.description || 'Unknown'}
          />
          <WeatherInfo
            icon={<Thermostat sx={{ color: theme.palette.text.primary }} />}
            label="Temperature"
            value={displayTemperature(weatherData.temperature)}
          />
          <WeatherInfo
            icon={<WbTwilight sx={{ color: theme.palette.text.primary }} />}
            label="Feels Like"
            value={displayTemperature(weatherData.apparentTemperature)}
          />
          <WeatherInfo
            icon={<Opacity sx={{ color: theme.palette.text.primary }} />}
            label="Humidity"
            value={`${weatherData.relativehumidity}%`}
          />
          <WeatherInfo
            icon={<Air sx={{ color: theme.palette.text.primary }} />}
            label="Wind"
            value={`${weatherData.windspeed} m/s, ${convertWindDirection(weatherData.winddirection)}`}
          />
          <WeatherInfo
            icon={<WaterDrop sx={{ color: theme.palette.text.primary }} />}
            label="Precipitation Probability"
            value={`${weatherData.precipitationProbability}%`}
          />
        </Grid>

        {humidityAdvice && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              mt: 3,
              p: 2,
              backgroundColor: adviceStyle.backgroundColor,
              borderRadius: '10px',
              boxShadow: theme.shadows[2],
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {adviceStyle.icon}
              <Typography variant="h6" sx={{ ml: 2, color: adviceStyle.textColor, fontWeight: 'medium' }}>
                {humidityAdvice}
              </Typography>
            </Box>
            <MathExplanation
              indoorTemp={indoorData.temperature}
              indoorRH={indoorData.humidity}
              outdoorTemp={weatherData.temperature}
              outdoorRH={weatherData.relativehumidity}
              AH_indoor={AH_indoor}
              AH_outdoor={AH_outdoor}
              AH_difference={AH_difference}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OutdoorData;