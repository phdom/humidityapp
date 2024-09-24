// src/components/OutdoorData.js

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { getHumidityAdvice } from '../utils';

const OutdoorData = ({ city, country, indoorData }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [humidityAdvice, setHumidityAdvice] = useState('');
  const [error, setError] = useState(null);

  // Fetch coordinates from OpenWeatherMap Geocoding API
  const fetchCoordinates = async () => {
    try {
      const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: `${city},${country}`,
          limit: 1,
          appid: process.env.REACT_APP_OPENWEATHERMAP_API_KEY,
        },
      });

      if (response.data.length === 0) {
        setError(`Could not find coordinates for "${city}, ${country}".`);
        return;
      }

      const location = response.data[0];
      const lat = location.lat;
      const lon = location.lon;

      fetchWeatherData(lat, lon);
    } catch (error) {
      console.error('Error fetching coordinates:', error.message);
      setError(`Error fetching location for "${city}, ${country}". Please try again.`);
    }
  };

  // Fetch weather data from Open Meteo API
  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'temperature_2m,relativehumidity_2m', // Corrected parameter name
        },
      });

      const weatherData = response.data.hourly;
      setWeatherData(weatherData);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      setError('Error fetching weather data. Please try again.');
    }
  };

  useEffect(() => {
    if (city && country) {
      fetchCoordinates();
    }
  }, [city, country]);

  useEffect(() => {
    if (
      weatherData &&
      indoorData.temperature &&
      indoorData.humidity &&
      !isNaN(indoorData.temperature) &&
      !isNaN(indoorData.humidity)
    ) {
      // Parse indoor data
      const indoorTemp = parseFloat(indoorData.temperature);
      const indoorHumidity = parseFloat(indoorData.humidity);
      // Get outdoor data
      const outdoorTemp = weatherData.temperature_2m[0];
      const outdoorHumidity = weatherData.relativehumidity_2m[0];

      // Get humidity advice using the utility function
      const advice = getHumidityAdvice(
        indoorTemp,
        indoorHumidity,
        outdoorTemp,
        outdoorHumidity
      );
      setHumidityAdvice(advice);
    }
  }, [weatherData, indoorData]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!weatherData) {
    return (
      <Typography align="center">
        <CircularProgress />
      </Typography>
    );
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Weather in {city}, {country}
        </Typography>
        <Typography variant="body1">
          <strong>Temperature:</strong> {weatherData.temperature_2m[0]}°C
        </Typography>
        <Typography variant="body1">
          <strong>Humidity:</strong> {weatherData.relativehumidity_2m[0]}%
        </Typography>
        {humidityAdvice && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {humidityAdvice}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default OutdoorData;
