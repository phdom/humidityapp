// CitySelector.js
import React, { useState } from 'react';

function CitySelector({ setCity }) {
  const [cityInput, setCityInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(cityInput.trim());
  };

  return (
    <div>
      <h2>Select Your City</h2>
      <form onSubmit={handleSubmit}>
        <label>
          City:
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            required
          />
        </label>
        <button type="submit">Get Weather</button>
      </form>
    </div>
  );
}

export default CitySelector;
