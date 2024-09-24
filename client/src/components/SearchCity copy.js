// client/src/components/SearchCity.js

import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Autocomplete, Grid, InputAdornment, CircularProgress, Typography } from '@mui/material';
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
          const response = await axios.get('/api/cities', {
            params: { q: input },
          });

          console.log('City suggestions:', response.data); // Debugging log

          // Validate that response.data is an array
          if (Array.isArray(response.data)) {
            setCityOptions(response.data);
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
            setError(err.response.data.error || 'Error fetching city suggestions.');
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

  // Handler for input change
  const handleInputChange = (event, value) => {
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
          options={cityOptions}
          getOptionLabel={(option) =>
            `${option.full_name}`
          }
          onInputChange={handleInputChange}
          onChange={handleOptionSelect}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          loading={loading}
          noOptionsText={cityInput.length < 3 ? 'Type at least 3 characters to search' : 'No cities found'}
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
