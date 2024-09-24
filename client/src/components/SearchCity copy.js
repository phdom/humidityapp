// src/components/SearchCity.js

import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Grid } from '@mui/material';
import axios from 'axios';

const SearchCity = ({ onCitySelect }) => {
  const [cityInput, setCityInput] = useState('');
  const [cityOptions, setCityOptions] = useState([]);

  // Event handler for input change
  const handleCityInputChange = (event, value) => {
    setCityInput(value);
  };

  // Fetch city suggestions when cityInput changes
 useEffect(() => {
  const fetchCitySuggestions = async () => {
    if (cityInput.length > 2) {
      try {
        const response = await axios.get('/api/cities', {
          params: { q: cityInput },
        });
        console.log('City suggestions:', response.data); // Log the city suggestions here
        setCityOptions(response.data);
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Error response:', error.response.data);
          console.error('Status code:', error.response.status);
          console.error('Headers:', error.response.headers);
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
        } else {
          // Something else happened
          console.error('Error:', error.message);
        }
      }
    } else {
      setCityOptions([]);
    }
  };

  fetchCitySuggestions();
}, [cityInput]);

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12}>
        <Autocomplete
          options={cityOptions}
          getOptionLabel={(option) =>
            `${option.name}, ${option.country} ${
              option.state ? `(${option.state})` : ''
            }`
          }
          onInputChange={handleCityInputChange}
          onChange={(event, newValue) => {
            if (newValue) {
              console.log('Selected City:', newValue); // Log selected city
              onCitySelect(newValue);
            } else {
              console.log('No city selected or selection cleared');
              onCitySelect(null);
            }
          }}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search City"
              variant="outlined"
              fullWidth
              color="primary"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default SearchCity;
