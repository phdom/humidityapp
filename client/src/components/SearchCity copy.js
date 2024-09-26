// src/components/SearchCity.js

import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Autocomplete, Grid, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import debounce from 'lodash.debounce';

const SearchCity = ({ onCitySelect }) => {
  const [cityInput, setCityInput] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced fetch function to limit API calls
  const debouncedFetch = useMemo(
    () =>
      debounce(async (input) => {
        if (input.length < 3) {
          setCityOptions([]);
          setLoading(false);
          setError(null);
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`,
            {
              params: {
                access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN, // Ensure this is correctly set
                limit: 5, // Limit results to top 5
                types: 'place', // Restrict to cities
              },
            }
          );

          console.log('API response:', response.data.features); // Debugging log for API response

          // Validate that response.data.features is an array
          if (Array.isArray(response.data.features)) {
            setCityOptions(
              response.data.features.map((feature) => {
                // Extract country from context if available
                const countryContext = feature.context?.find((ctx) => ctx.id.startsWith('country'));
                return {
                  name: feature.text,
                  full_name: feature.place_name, // Full name for display
                  lat: feature.center[1], // Latitude
                  lon: feature.center[0], // Longitude
                  country: countryContext ? countryContext.text : 'Unknown', // Extracted country
                };
              })
            );
          } else {
            console.error('Unexpected response format:', response.data);
            setCityOptions([]);
            setError('Invalid response from server.');
          }
        } catch (err) {
          if (err.response) {
            console.error('Error response:', err.response.data);
            console.error('Status code:', err.response.status);
            console.error('Headers:', err.response.headers);
            setError(err.response.data.message || 'Error fetching city suggestions.');
          } else if (err.request) {
            console.error('No response received:', err.request);
            setError('No response from server.');
          } else {
            console.error('Error:', err.message);
            setError('Error fetching city suggestions.');
          }
          setCityOptions([]);
        } finally {
          setLoading(false);
        }
      }, 300), // 300ms debounce delay
    []
  );

  // Effect to handle input changes with debouncing
  useEffect(() => {
    debouncedFetch(cityInput);

    // Cleanup function to cancel debounce on unmount or input change
    return () => {
      debouncedFetch.cancel();
    };
  }, [cityInput, debouncedFetch]);

  // Debugging log to see if cityOptions is populated
  useEffect(() => {
    console.log('cityOptions:', cityOptions);
  }, [cityOptions]);

  // Handler for input change
  const handleInputChange = (event, value, reason) => {
    setCityInput(value);
  };

  // Handler for option selection
  const handleOptionSelect = (event, newValue) => {
    if (newValue) {
      console.log('Selected City:', newValue); // Debugging log
      onCitySelect(newValue);
    } else {
      console.log('No city selected or selection cleared');
      onCitySelect(null);
    }
  };

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12}>
        <Autocomplete
          disablePortal // Prevent dropdown from rendering in a portal
          options={cityOptions}
          getOptionLabel={(option) => `${option.full_name}`}
          onInputChange={handleInputChange}
          onChange={handleOptionSelect}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          loading={loading}
          noOptionsText={cityInput.length < 3 ? 'Type at least 3 characters to search' : 'No cities found'}
          autoHighlight // Automatically highlight the first matching option
          fullWidth
          ListboxProps={{
            style: {
              maxHeight: '200px', // Limit the height to make the dropdown scrollable
            },
          }}
          renderOption={(props, option) => (
            <li {...props} key={option.full_name}>
              {option.full_name}
            </li>
          )}
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
              helperText={error ? <span style={{ color: 'red' }}>{error}</span> : null}
              sx={{
                // Optional: Adjust font sizes and padding for better mobile usability
                '& .MuiInputBase-root': {
                  fontSize: '1rem',
                },
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default SearchCity;
