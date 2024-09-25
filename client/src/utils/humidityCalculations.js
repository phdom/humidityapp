// src/utils/humidityCalculations.js

// Function to calculate Absolute Humidity (in g/m³)
function calculateAbsoluteHumidity(tempC, relativeHumidity) {
  const Es = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
  const E = Es * (relativeHumidity / 100);
  const AH = (2.1674 * E) / (tempC + 273.15);
  return AH; // in g/m³
}

// Function to determine if opening windows will reduce indoor humidity
function getHumidityAdvice(indoorTemp, indoorRH, outdoorTemp, outdoorRH) {
  const AH_indoor = calculateAbsoluteHumidity(indoorTemp, indoorRH);
  const AH_outdoor = calculateAbsoluteHumidity(outdoorTemp, outdoorRH);

  const AH_difference = AH_indoor - AH_outdoor;

  if (AH_difference > 1) {
    return 'Open your windows to lower indoor humidity.';
  } else if (AH_difference > 0) {
    return 'Opening windows may slightly reduce indoor humidity.';
  } else {
    return 'Keep your windows closed right now to avoid raising your indoor humidity.';
  }
}

export { calculateAbsoluteHumidity, getHumidityAdvice };
