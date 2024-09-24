// Recommendation.js
import React from 'react';
import { calculateAbsoluteHumidity } from './utils';

function Recommendation({ indoorTemp, indoorRH, outdoorTemp, outdoorRH }) {
  if (
    indoorTemp == null ||
    indoorRH == null ||
    outdoorTemp == null ||
    outdoorRH == null
  ) {
    return <p>Please enter indoor data and wait for outdoor data.</p>;
  }

  const indoorAH = calculateAbsoluteHumidity(indoorTemp, indoorRH);
  const outdoorAH = calculateAbsoluteHumidity(outdoorTemp, outdoorRH);

  const shouldOpenWindows = outdoorAH < indoorAH;

  return (
    <div>
      <h2>Recommendation</h2>
      <p>
        {shouldOpenWindows
          ? 'You should open your windows to reduce indoor humidity.'
          : 'Keep your windows closed to maintain current humidity levels.'}
      </p>
      <p>
        <strong>Indoor Absolute Humidity:</strong> {indoorAH.toFixed(2)} g/m³
      </p>
      <p>
        <strong>Outdoor Absolute Humidity:</strong> {outdoorAH.toFixed(2)} g/m³
      </p>
    </div>
  );
}

export default Recommendation;
