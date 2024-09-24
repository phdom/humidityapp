// src/utils/humidityCalculations.js

// Function to calculate Absolute Humidity (in g/m³)
function calculateAbsoluteHumidity(tempC, relativeHumidity) {
  // Calculate the saturation vapor pressure (Es) in hPa
  const Es = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
  // Calculate the actual vapor pressure (E) in hPa
  const E = Es * (relativeHumidity / 100);
  // Calculate the absolute humidity (AH) in g/m³
  const AH = (2.1674 * E) / (tempC + 273.15);
  return AH; // in g/m³
}

// Function to determine if opening windows will reduce indoor humidity
function getHumidityAdvice(indoorTemp, indoorRH, outdoorTemp, outdoorRH) {
  const AH_indoor = calculateAbsoluteHumidity(indoorTemp, indoorRH);
  const AH_outdoor = calculateAbsoluteHumidity(outdoorTemp, outdoorRH);

  // Calculate the difference in absolute humidity
  const AH_difference = AH_indoor - AH_outdoor;

  if (AH_difference > 1) {
    // Significant difference
    return 'Open your windows to lower indoor humidity.';
  } else if (AH_difference > 0) {
    // Small difference
    return 'Opening windows may slightly reduce indoor humidity.';
  } else {
    return 'Keep your windows closed right now to avoid raising your indoor humidity.';
  }
}

export { calculateAbsoluteHumidity, getHumidityAdvice };
