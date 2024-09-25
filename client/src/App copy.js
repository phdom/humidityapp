import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Switch, FormControlLabel } from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';  // Import both themes
import SearchCity from './components/SearchCity';
import IndoorData from './components/IndoorData';
import OutdoorData from './components/OutdoorData';
import Logo from './assets/images/logo.png';  // Ensure this is the correct path to your logo
import useMediaQuery from '@mui/material/useMediaQuery';

const App = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [indoorData, setIndoorData] = useState({});
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  // Automatically switch to dark mode based on user's system preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Sync dark mode state with system preference on load
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  // Select theme based on dark mode toggle or system preference
  const theme = darkMode ? darkTheme : lightTheme;

  // Debugging: Log the selected city and indoor data
  console.log('Selected City:', selectedCity);  // Log to check if city is being selected correctly
  console.log('Indoor Data:', indoorData);      // Log to check if indoor data is updating

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* CssBaseline applies global styles based on the selected theme */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Dark Mode Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}  // Toggle dark mode
                  name="darkModeToggle"
                />
              }
              label="Dark Mode"
            />
          </Box>

          {/* Logo, App Name, and Tagline */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', mb: 2 }}>
            <img 
              src={Logo} 
              alt="App Logo" 
              style={{ width: '60px', marginRight: '15px' }}  // Set logo size and spacing
            />
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: '600',  // Clean, modern font weight
                color: theme.palette.primary.main,  // App name color based on theme
                fontFamily: '"Oswald", sans-serif'  // Use a modern, clean font
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
          <IndoorData onDataChange={setIndoorData} />

          {/* Render Outdoor Data only when city is selected and valid */}
          {selectedCity && selectedCity.name && selectedCity.country && (
            <OutdoorData
              city={selectedCity.name}       // Pass the selected city's name
              state={selectedCity.state}     // Pass the selected state's name
              country={selectedCity.country} // Pass the selected country's name
              indoorData={indoorData}        // Pass indoor data (temperature, humidity)
            />
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
