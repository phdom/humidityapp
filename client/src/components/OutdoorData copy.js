import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, CircularProgress, Alert, Grid, Box } from '@mui/material';
import axios from 'axios';
import { getHumidityAdvice } from '../utils';
import { Thermostat, Opacity, WbSunny, Cloud, Grain, Air, Umbrella } from '@mui/icons-material';

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

const COMPASS_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const getWeatherIcon = (code) => {
  const { Icon, color } = WEATHER_CODES[code] || WEATHER_CODES[1];
  return <Icon fontSize="medium" style={{ color }} />;
};

const convertWindDirection = (deg) => COMPASS_DIRECTIONS[Math.round(deg / 45) % 8];

const getAdviceStyle = (humidity) => ({
  icon: <Opacity fontSize="large" style={{ color: '#ffffff' }} />,
  backgroundColor: '#3881A1',
  textColor: '#ffffff',
});

const WeatherInfo = ({ icon, label, value }) => (
  <Grid container spacing={1} alignItems="center">
    <Grid item>{icon}</Grid>
    <Grid item>
      <Typography variant="body1">
        <strong>{label}:</strong> {value}
      </Typography>
    </Grid>
  </Grid>
);

const OutdoorData = ({ city, state, country, indoorData }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [humidityAdvice, setHumidityAdvice] = useState('');
  const [error, setError] = useState(null);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'temperature_2m,relativehumidity_2m,winddirection_10m,precipitation,weathercode',
          current_weather: true,
        },
      });

      const currentHour = new Date(data.current_weather.time).getHours();
      setWeatherData({
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        winddirection: data.hourly.winddirection_10m[currentHour],
        precipitation: data.hourly.precipitation[currentHour],
        weathercode: data.current_weather.weathercode,
        relativehumidity: data.hourly.relativehumidity_2m[currentHour],
      });
    } catch (err) {
      console.error('Error fetching weather data:', err.message);
      setError('Error fetching weather data. Please try again.');
    }
  };

  const fetchCoordinates = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)},${encodeURIComponent(state)},${encodeURIComponent(country)}.json`,
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

  useEffect(() => {
    if (city && country) fetchCoordinates();
  }, [city, state, country, fetchCoordinates]);

  useEffect(() => {
    if (weatherData && indoorData.temperature && indoorData.humidity) {
      const advice = getHumidityAdvice(
        parseFloat(indoorData.temperature),
        parseFloat(indoorData.humidity),
        weatherData.temperature,
        weatherData.relativehumidity
      );
      setHumidityAdvice(advice);
    }
  }, [weatherData, indoorData]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!weatherData) return <Typography align="center"><CircularProgress /></Typography>;

  const adviceStyle = getAdviceStyle(weatherData.relativehumidity);

  return (
    <Card sx={{ mb: 4, backgroundColor: '#ffffff', borderRadius: '15px' }}>
      <CardContent>
        {/* Updated to show city, state, and country */}
        <Typography variant="h5" gutterBottom>
          Weather in {city}, {state ? `${state}, ` : ''}{country}
        </Typography>
        <WeatherInfo
          icon={getWeatherIcon(weatherData.weathercode)}
          label="Condition"
          value={WEATHER_CODES[weatherData.weathercode]?.description || 'Unknown'}
        />
        <WeatherInfo icon={<Thermostat color="error" />} label="Temperature" value={`${weatherData.temperature}°C`} />
        <WeatherInfo icon={<Opacity color="primary" />} label="Humidity" value={`${weatherData.relativehumidity}%`} />
        <WeatherInfo
          icon={<Air color="action" />}
          label="Wind"
          value={`${weatherData.windspeed} m/s, ${convertWindDirection(weatherData.winddirection)}`}
        />
        <WeatherInfo icon={<Umbrella color="primary" />} label="Precipitation" value={`${weatherData.precipitation} mm`} />

        {humidityAdvice && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, p: 2, backgroundColor: adviceStyle.backgroundColor, borderRadius: '10px' }}>
            {adviceStyle.icon}
            <Typography variant="h6" sx={{ ml: 2, color: adviceStyle.textColor }}>{humidityAdvice}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OutdoorData;
