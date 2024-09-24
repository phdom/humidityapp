// src/components/SearchCity.js

import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Grid, InputAdornment, CircularProgress, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const SearchCity = ({ onCitySelect }) => {
  const [cityInput, setCityInput] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Event handler for input change
  const handleCityInputChange = (event, value) => {
    setCityInput(value);
  };

  // Fetch city suggestions when cityInput changes
  useEffect(() => {
    const fetchCitySuggestions = async () => {
      if (cityInput.length > 2) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get('/api/cities', {
            params: { q: cityInput },
          });
          console.log('City suggestions:', response.data); // Log the city suggestions here

          // Validate that response.data is an array
          if (Array.isArray(response.data)) {
            setCityOptions(response.data);
          } else {
            console.error('Unexpected response format:', response.data);
            setCityOptions([]);
            setError('Invalid response from server.');
          }
        } catch (error) {
          if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Status code:', error.response.status);
            console.error('Headers:', error.response.headers);
            setError('Error fetching city suggestions.');
          } else if (error.request) {
            console.error('No response received:', error.request);
            setError('No response from server.');
          } else {
            console.error('Error:', error.message);
            setError('Error fetching city suggestions.');
          }
          setCityOptions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setCityOptions([]);
        setError(null);
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
            `${option.name}, ${option.country} ${option.state ? `(${option.state})` : ''}`
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
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search City"
              variant="outlined"
              fullWidth
              color="primary"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  </>
                ),
              }}
              error={!!error}
              helperText={error ? <Typography color="error">{error}</Typography> : null}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default SearchCity;
