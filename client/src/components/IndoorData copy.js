// src/components/IndoorData.js

import React, { useState } from 'react';
import { TextField, Grid } from '@mui/material';

const IndoorData = ({ onDataChange }) => {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');

  const handleTemperatureChange = (e) => {
    const value = e.target.value;
    setTemperature(value);
    onDataChange({ temperature: value, humidity });
  };

  const handleHumidityChange = (e) => {
    const value = e.target.value;
    setHumidity(value);
    onDataChange({ temperature, humidity: value });
  };

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Indoor Temperature (°C)"
          variant="outlined"
          fullWidth
          value={temperature}
          onChange={handleTemperatureChange}
          type="number"
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Indoor Humidity (%)"
          variant="outlined"
          fullWidth
          value={humidity}
          onChange={handleHumidityChange}
          type="number"
          color="primary"
        />
      </Grid>
    </Grid>
  );
};

export default IndoorData;
