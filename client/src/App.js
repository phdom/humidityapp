// src/App.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  IconButton,
} from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme'; // Ensure these themes are correctly defined
import SearchCity from './components/SearchCity';
import IndoorData from './components/IndoorData';
import OutdoorData from './components/OutdoorData';
import Logo from './assets/images/logo.png'; // Verify the path to your logo
import useMediaQuery from '@mui/material/useMediaQuery';
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for light mode
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for dark mode
import ThermostatIcon from '@mui/icons-material/Thermostat'; // Celsius icon
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined'; // Fahrenheit icon
import Footer from './components/footer'; // Import the Footer component



const App = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [indoorData, setIndoorData] = useState({ temperature: '', humidity: '' });
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [isCelsius, setIsCelsius] = useState(true); // State for temperature unit

  // Automatically switch to dark mode based on user's system preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Sync dark mode state with system preference on load
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  // Persist temperature unit preference
  useEffect(() => {
    // Retrieve temperature unit preference from localStorage on mount
    const storedUnit = localStorage.getItem('isCelsius');
    if (storedUnit !== null) {
      setIsCelsius(storedUnit === 'true');
    }
  }, []);

  useEffect(() => {
    // Store temperature unit preference in localStorage whenever it changes
    localStorage.setItem('isCelsius', isCelsius);
  }, [isCelsius]);

  // Persist dark mode preference
  useEffect(() => {
    // Retrieve dark mode preference from localStorage on mount
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    // Store dark mode preference in localStorage whenever it changes
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Select theme based on dark mode toggle or system preference
  const theme = darkMode ? darkTheme : lightTheme;

  // Debugging: Log the selected city and indoor data
  console.log('Selected City:', selectedCity); // Log to check if city is being selected correctly
  console.log('Indoor Data:', indoorData); // Log to check if indoor data is updating

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* CssBaseline applies global styles based on the selected theme */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Toggle Buttons for Dark Mode and Temperature Unit */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, alignItems: 'center' }}>
            {/* Temperature Unit Toggle */}
            <IconButton
              onClick={() => setIsCelsius(!isCelsius)} // Toggle temperature unit
              color="inherit"
              aria-label="Toggle temperature unit"
            >
              {isCelsius ? <ThermostatIcon /> : <ThermostatOutlinedIcon />}
            </IconButton>

            {/* Dark Mode Toggle */}
            <IconButton
              onClick={() => setDarkMode(!darkMode)} // Toggle dark mode
              color="inherit"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          {/* Logo, App Name, and Tagline */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', mb: 2 }}>
            <img
              src={Logo}
              alt="App Logo"
              style={{ width: '60px', marginRight: '15px' }} // Set logo size and spacing
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: '600', // Clean, modern font weight
                color: theme.palette.primary.main, // App name color based on theme
                fontFamily: '"Oswald", sans-serif', // Use a modern, clean font
              }}
            >
              AirAware
            </Typography>
          </Box>

          {/* Tagline beneath the logo and app name */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontStyle: 'normal', color: theme.palette.text.primary, fontFamily: 'Roboto, sans-serif' }}
            >
              Lower humidity inside your home by opening your windows at the right time.
            </Typography>
          </Box>

          {/* City Search and Indoor Data Components */}
          <SearchCity onCitySelect={setSelectedCity} />
          <IndoorData onDataChange={setIndoorData} isCelsius={isCelsius} /> {/* Pass isCelsius and onDataChange */}

          {/* Render Outdoor Data only when city is selected and valid */}
          {selectedCity && selectedCity.name && selectedCity.country && (
            <OutdoorData
              city={selectedCity.name}       // Pass the selected city's name
              state={selectedCity.state}     // Pass the selected state's name
              country={selectedCity.country} // Pass the selected country's name
              indoorData={indoorData}        // Pass indoor data (temperature, humidity)
              isCelsius={isCelsius}          // Pass temperature unit
            />
          )}
        </Paper>
      </Container>
    <Footer /> {/* Add Footer at the bottom */}
    </ThemeProvider>
  );
};

export default App;
