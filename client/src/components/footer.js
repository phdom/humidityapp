import React from 'react';
import { Box, Typography } from '@mui/material';
import UmbrellaIcon from '@mui/icons-material/Umbrella'; // Umbrella icon for rainy weather

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        textAlign: 'center',
        mt: 4,
        mb: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
        Developed in the humid, rainy charm of Aveiro, Portugal&nbsp;
        <UmbrellaIcon sx={{ fontSize: '18px', color: 'lightblue' }} />
      </Typography>
    </Box>
  );
};

export default Footer;
