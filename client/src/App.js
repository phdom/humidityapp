import React, { useState } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import SearchCity from './components/SearchCity';
import IndoorData from './components/IndoorData';
import OutdoorData from './components/OutdoorData';
import Logo from './assets/images/logo.png';  // Ensure this is the correct path to your logo

const App = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [indoorData, setIndoorData] = useState({});

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        
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
              color: '#3881A1',  // App name color
              fontFamily: '"Oswald", sans-serif'  // Use a modern, clean font
            }}
          >
            Breeze Buddy 
          </Typography>
        </Box>

        {/* Tagline beneath the logo and app name */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontStyle: 'normal', color: '#0C3752', fontFamily: 'Roboto, sans-serif' }}
          >
           Manage humidity inside your home by opening your windows at the right time.
          </Typography>
        </Box>

        <SearchCity onCitySelect={setSelectedCity} />
        <IndoorData onDataChange={setIndoorData} />
        {selectedCity && (
          <OutdoorData
            city={selectedCity.name}
            country={selectedCity.country}
            indoorData={indoorData}
          />
        )}
      </Paper>
    </Container>
  );
};

export default App;
