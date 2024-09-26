import { createTheme } from '@mui/material/styles';

// Light Theme
const lightTheme = createTheme({
  palette: {
    mode: 'light', // Light mode
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

// Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Dark mode
    primary: {
      main: '#90caf9', // Light Blue
      contrastText: '#000000',
    },
    secondary: {
      main: '#f48fb1', // Pink
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Slightly lighter dark
    },
    text: {
      primary: '#ffffff', // Light text
      secondary: '#bbbbbb', // Softer light gray
    },
    error: {
      main: '#f44336', // Bright red
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
      color: '#bbbbbb', // Softer gray for dark mode
    },
  },
  components: {
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

export { lightTheme, darkTheme };
