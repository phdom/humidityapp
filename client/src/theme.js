// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00A8CC', // Cyan Blue
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F4D06F', // Light Golden Yellow
      contrastText: '#333333',
    },
    background: {
      default: '#F9F9F9', // Very Light Gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333', // Dark Gray
      secondary: '#555555',
    },
    error: {
      main: '#FF6F61', // Coral Red
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontWeight: 700, // Bold titles
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      color: '#555555',
    },
  },
  components: {
    // Customize components here
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners
          textTransform: 'none', // Capitalization
        },
      },
    },
  },
});

export default theme;
