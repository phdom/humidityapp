// src/components/IndoorData.js

import React, { useState, useEffect } from 'react';
import { TextField, Grid, Box } from '@mui/material';

const IndoorData = ({ onDataChange, isCelsius }) => {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');

  // Function to convert Fahrenheit to Celsius
  const toCelsius = (tempF) => (tempF - 32) * 5 / 9;

  // Handle temperature input change
  const handleTemperatureChange = (e) => {
    const value = e.target.value;
    setTemperature(value);

    let tempC = parseFloat(value);
    if (!isCelsius && !isNaN(tempC)) {
      tempC = toCelsius(tempC);
    }

    onDataChange({ temperature: isNaN(tempC) ? '' : tempC, humidity: parseFloat(humidity) || 0 });
  };

  // Handle humidity input change
  const handleHumidityChange = (e) => {
    const value = e.target.value;
    setHumidity(value);

    let tempC = isCelsius ? parseFloat(temperature) : toCelsius(parseFloat(temperature));
    tempC = isNaN(tempC) ? '' : tempC;

    onDataChange({ temperature: tempC, humidity: parseFloat(value) || 0 });
  };

  // Determine the placeholder and unit based on selected temperature unit
  const tempPlaceholder = isCelsius ? '°C' : '°F';

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={`Indoor Temperature (${isCelsius ? '°C' : '°F'})`}
            variant="outlined"
            fullWidth
            value={temperature}
            onChange={handleTemperatureChange}
            type="number"
            InputProps={{
              endAdornment: <span>{tempPlaceholder}</span>,
            }}
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
            inputProps={{ min: 0, max: 100 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default IndoorData;
