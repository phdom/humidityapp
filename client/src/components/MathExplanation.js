import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MathExplanation = ({
  indoorTemp,
  indoorRH,
  outdoorTemp,
  outdoorRH,
  AH_indoor,
  AH_outdoor,
  AH_difference,
}) => {
  const theme = useTheme();

  return (
    <Accordion
      sx={{
        mt: 2,
        width: '100%',
        backgroundColor: 'transparent', // Transparent background for Accordion
        boxShadow: 'none', // Remove default box shadow
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />} // White expand icon
        aria-controls="math-explanation-content"
        id="math-explanation-header"
        sx={{
          backgroundColor: 'transparent', // Transparent background when collapsed
          borderRadius: '10px',
          minHeight: '40px',
          '& .MuiAccordionSummary-content': {
            margin: 0,
          },
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)' // Subtle hover in dark mode
                : 'rgba(0, 0, 0, 0.04)', // Subtle hover in light mode
          },
          transition: 'background-color 0.3s',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#ffffff', // White text when collapsed
            fontWeight: 'bold',
            fontSize: '0.95rem',
          }}
        >
          Learn the science behind your result
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor:
            theme.palette.mode === 'dark' ? '#121212' : theme.palette.background.default,
          borderRadius: '0 0 10px 10px',
          padding: 2,
        }}
      >
        <Box>
          {/* TL;DR Section */}
           <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
            Simple Explanation
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
      
           
           We compared the indoor and outdoor humidity levels, taking both temperature and the true relative humidity into account.  
             <br />  <br />
           Since the air outside is{' '}
            {AH_difference > 0 ? 'drier' : 'more humid'} than the air inside, opening your windows will{' '}
            {AH_difference > 0 ? 'help bring down' : 'likely raise'} your indoor humidity levels. This happens because air
            always tries to balance moisture, moving humidity from wetter areas to drier areas.
              <br />  <br />
             The science behind these calculations is complex, as it requires considering both temperature and humidity to get an accurate picture of how moisture will behave indoors. 
          </Typography>

          {/* Detailed Explanation */}
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
            Detailed Explanation
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
            The humidity advice provided is based on comparing your indoor and outdoor humidity levels, along with the temperatures. Here's a step-by-step breakdown of how the calculation works:
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mt: 2 }}>
            Step 1: Calculate Absolute Humidity
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
            Absolute Humidity (AH) measures the actual amount of water vapor in the air, expressed in grams per cubic meter (g/m³). It is calculated using the following formula:
          </Typography>

          <Box
            component="pre"
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#2c3e50' : '#e3f2fd',
              p: 2,
              borderRadius: '8px',
              overflow: 'auto',
              fontFamily: 'Monospace',
              fontSize: '0.875rem',
              color: theme.palette.mode === 'dark' ? '#ecf0f1' : '#0d47a1',
              mb: 2,
            }}
          >
            AH = (2.1674 × E) / (T + 273.15)
          </Box>

          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
            Where:<br />
            <strong>AH</strong> = Absolute Humidity (g/m³)<br />
            <strong>E</strong> = Actual Vapor Pressure (hPa)<br />
            <strong>T</strong> = Temperature (°C)
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mt: 2 }}>
            Step 2: Calculate Vapor Pressure
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
            The Actual Vapor Pressure (E) is determined using the temperature (T) and Relative Humidity (RH) with the formula:
          </Typography>

          <Box
            component="pre"
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#2c3e50' : '#e3f2fd',
              p: 2,
              borderRadius: '8px',
              overflow: 'auto',
              fontFamily: 'Monospace',
              fontSize: '0.875rem',
              color: theme.palette.mode === 'dark' ? '#ecf0f1' : '#0d47a1',
              mb: 2,
            }}
          >
            E = 6.112 × e<sup>((17.67 × T) / (T + 243.5))</sup> × (RH / 100)
          </Box>

          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
            Where:<br />
            <strong>T</strong> = Temperature (°C)<br />
            <strong>RH</strong> = Relative Humidity (%)
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mt: 2 }}>
            Step 3: Compute Absolute Humidity
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
            Using your input values:
          </Typography>

          <Box
            component="pre"
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#2c3e50' : '#e3f2fd',
              p: 2,
              borderRadius: '8px',
              overflow: 'auto',
              fontFamily: 'Monospace',
              fontSize: '0.875rem',
              color: theme.palette.mode === 'dark' ? '#ecf0f1' : '#0d47a1',
              mb: 2,
            }}
          >
            AH_indoor = (2.1674 × E_indoor) / (Indoor Temp + 273.15)<br />
            AH_outdoor = (2.1674 × E_outdoor) / (Outdoor Temp + 273.15)
          </Box>

          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
            <strong>Indoor:</strong><br />
            Temperature (T<sub>in</sub>) = {indoorTemp}°C<br />
            Relative Humidity (RH<sub>in</sub>) = {indoorRH}%<br />
            <strong>Outdoor:</strong><br />
            Temperature (T<sub>out</sub>) = {outdoorTemp}°C<br />
            Relative Humidity (RH<sub>out</sub>) = {outdoorRH}%<br />
          </Typography>

          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
            After calculating, we obtain:<br />
            <strong>AH_indoor</strong> = {AH_indoor.toFixed(2)} g/m³<br />
            <strong>AH_outdoor</strong> = {AH_outdoor.toFixed(2)} g/m³<br />
            <strong>AH_difference</strong> = AH_indoor - AH_outdoor = {AH_difference.toFixed(2)} g/m³
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mt: 2 }}>
            Step 4: Determine Humidity Management Advice
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
            Based on the Absolute Humidity difference:
            <ul>
              <li><strong>If AH_difference &gt; 1 g/m³:</strong> It's effective to open windows to lower indoor humidity.</li>
              <li><strong>If 0 &lt; AH_difference &le; 1 g/m³:</strong> Opening windows may slightly reduce indoor humidity.</li>
              <li><strong>If AH_difference &le; 0 g/m³:</strong> Keep windows closed to avoid increasing indoor humidity.</li>
            </ul>
          </Typography>

          <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
            This calculation helps ensure optimal indoor humidity levels for comfort and health.
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

// Define PropTypes for type checking
MathExplanation.propTypes = {
  indoorTemp: PropTypes.number.isRequired,
  indoorRH: PropTypes.number.isRequired,
  outdoorTemp: PropTypes.number.isRequired,
  outdoorRH: PropTypes.number.isRequired,
  AH_indoor: PropTypes.number.isRequired,
  AH_outdoor: PropTypes.number.isRequired,
  AH_difference: PropTypes.number.isRequired,
};

export default MathExplanation;
