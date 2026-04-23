/**
 * Soil Data Prediction Service
 * Predicts soil parameters (N, P, K, pH) based on location (state, district, taluk)
 * Uses regional soil data for estimation
 */

// Regional soil data database (simplified for prototype)
const regionalSoilData = {
  'karnataka': {
    default: { nitrogen: 180, phosphorus: 45, potassium: 120, ph: 6.5 },
    districts: {
      'belagavi': { nitrogen: 200, phosphorus: 50, potassium: 140, ph: 6.8 },
      'dharwad': { nitrogen: 190, phosphorus: 48, potassium: 130, ph: 6.6 },
      'bangalore': { nitrogen: 170, phosphorus: 42, potassium: 110, ph: 6.4 },
      'mysore': { nitrogen: 185, phosphorus: 46, potassium: 125, ph: 6.7 },
      'mandya': { nitrogen: 195, phosphorus: 52, potassium: 135, ph: 6.9 },
      'tumkur': { nitrogen: 175, phosphorus: 44, potassium: 115, ph: 6.3 },
      'hassan': { nitrogen: 188, phosphorus: 47, potassium: 128, ph: 6.5 },
      'shivamogga': { nitrogen: 182, phosphorus: 45, potassium: 122, ph: 6.6 },
      'chikmagalur': { nitrogen: 210, phosphorus: 55, potassium: 150, ph: 7.0 },
      'udupi': { nitrogen: 205, phosphorus: 53, potassium: 145, ph: 6.9 }
    }
  },
  'punjab': {
    default: { nitrogen: 220, phosphorus: 65, potassium: 180, ph: 7.2 },
    districts: {
      'ludhiana': { nitrogen: 240, phosphorus: 70, potassium: 200, ph: 7.4 },
      'amritsar': { nitrogen: 235, phosphorus: 68, potassium: 195, ph: 7.3 },
      'jalandhar': { nitrogen: 230, phosphorus: 67, potassium: 190, ph: 7.2 },
      'firozpur': { nitrogen: 225, phosphorus: 66, potassium: 185, ph: 7.1 },
      'bathinda': { nitrogen: 215, phosphorus: 62, potassium: 175, ph: 7.0 }
    }
  },
  'haryana': {
    default: { nitrogen: 210, phosphorus: 60, potassium: 170, ph: 7.1 },
    districts: {
      'karnal': { nitrogen: 230, phosphorus: 65, potassium: 190, ph: 7.3 },
      'panipat': { nitrogen: 225, phosphorus: 63, potassium: 185, ph: 7.2 },
      'sonipat': { nitrogen: 220, phosphorus: 62, potassium: 180, ph: 7.1 },
      'hisar': { nitrogen: 200, phosphorus: 58, potassium: 165, ph: 6.9 },
      'rohtak': { nitrogen: 215, phosphorus: 61, potassium: 175, ph: 7.0 }
    }
  },
  'maharashtra': {
    default: { nitrogen: 160, phosphorus: 40, potassium: 100, ph: 6.2 },
    districts: {
      'pune': { nitrogen: 175, phosphorus: 45, potassium: 115, ph: 6.5 },
      'nagpur': { nitrogen: 165, phosphorus: 42, potassium: 105, ph: 6.3 },
      'mumbai': { nitrogen: 155, phosphorus: 38, potassium: 95, ph: 6.0 },
      'nashik': { nitrogen: 170, phosphorus: 44, potassium: 110, ph: 6.4 },
      'aurangabad': { nitrogen: 158, phosphorus: 40, potassium: 98, ph: 6.1 }
    }
  },
  'madhya pradesh': {
    default: { nitrogen: 175, phosphorus: 48, potassium: 125, ph: 6.6 },
    districts: {
      'indore': { nitrogen: 190, phosphorus: 52, potassium: 140, ph: 6.8 },
      'bhopal': { nitrogen: 185, phosphorus: 50, potassium: 135, ph: 6.7 },
      'gwalior': { nitrogen: 180, phosphorus: 49, potassium: 130, ph: 6.6 },
      'jabalpur': { nitrogen: 178, phosphorus: 48, potassium: 128, ph: 6.5 }
    }
  },
  'rajasthan': {
    default: { nitrogen: 140, phosphorus: 35, potassium: 85, ph: 7.5 },
    districts: {
      'jaipur': { nitrogen: 155, phosphorus: 40, potassium: 100, ph: 7.8 },
      'jodhpur': { nitrogen: 130, phosphorus: 32, potassium: 75, ph: 7.6 },
      'udaipur': { nitrogen: 145, phosphorus: 37, potassium: 90, ph: 7.4 },
      'kota': { nitrogen: 150, phosphorus: 38, potassium: 95, ph: 7.5 }
    }
  },
  'tamil nadu': {
    default: { nitrogen: 165, phosphorus: 42, potassium: 110, ph: 6.3 },
    districts: {
      'chennai': { nitrogen: 155, phosphorus: 38, potassium: 100, ph: 6.0 },
      'coimbatore': { nitrogen: 175, phosphorus: 45, potassium: 120, ph: 6.5 },
      'madurai': { nitrogen: 170, phosphorus: 44, potassium: 115, ph: 6.4 },
      'trichy': { nitrogen: 168, phosphorus: 43, potassium: 112, ph: 6.3 }
    }
  },
  'andhra pradesh': {
    default: { nitrogen: 170, phosphorus: 45, potassium: 115, ph: 6.4 },
    districts: {
      'hyderabad': { nitrogen: 180, phosphorus: 48, potassium: 125, ph: 6.6 },
      'vijayawada': { nitrogen: 175, phosphorus: 46, potassium: 120, ph: 6.5 },
      'visakhapatnam': { nitrogen: 172, phosphorus: 45, potassium: 118, ph: 6.4 }
    }
  },
  'gujarat': {
    default: { nitrogen: 150, phosphorus: 38, potassium: 95, ph: 7.0 },
    districts: {
      'ahmedabad': { nitrogen: 165, phosphorus: 42, potassium: 110, ph: 7.2 },
      'surat': { nitrogen: 160, phosphorus: 40, potassium: 105, ph: 7.1 },
      'vadodara': { nitrogen: 158, phosphorus: 39, potassium: 102, ph: 7.0 }
    }
  },
  'uttar pradesh': {
    default: { nitrogen: 190, phosphorus: 55, potassium: 145, ph: 7.0 },
    districts: {
      'lucknow': { nitrogen: 205, phosphorus: 60, potassium: 160, ph: 7.2 },
      'kanpur': { nitrogen: 200, phosphorus: 58, potassium: 155, ph: 7.1 },
      'agra': { nitrogen: 195, phosphorus: 56, potassium: 150, ph: 7.0 },
      'varanasi': { nitrogen: 198, phosphorus: 57, potassium: 152, ph: 7.1 }
    }
  }
};

/**
 * Predict soil data based on location
 * @param {String} state - State name
 * @param {String} district - District name (optional)
 * @param {String} taluk - Taluk name (optional)
 * @returns {Object} Predicted soil parameters
 */
const predictSoilData = async (state, district = null, taluk = null) => {
  const stateLower = state?.toLowerCase().trim();
  const districtLower = district?.toLowerCase().trim();
  
  if (!stateLower) {
    throw new Error('State is required for soil data prediction');
  }

  // Find state data
  const stateData = regionalSoilData[stateLower];
  
  if (!stateData) {
    // Return default values for unknown states
    return {
      nitrogen: 150,
      phosphorus: 40,
      potassium: 100,
      ph: 6.5,
      source: 'default',
      note: 'Regional data not available for this state. Using default values.'
    };
  }

  // Check if district data exists
  if (districtLower && stateData.districts[districtLower]) {
    return {
      ...stateData.districts[districtLower],
      source: 'district',
      note: `Soil data estimated for ${district} district, ${state}`
    };
  }

  // Return state default
  return {
    ...stateData.default,
    source: 'state',
    note: district 
      ? `District-specific data not available for ${district}. Using state average for ${state}.`
      : `Soil data estimated for ${state} state.`
  };
};

/**
 * Get all available states
 * @returns {Array} List of available states
 */
const getAvailableStates = () => {
  return Object.keys(regionalSoilData).map(state => ({
    name: state.charAt(0).toUpperCase() + state.slice(1),
    districts: Object.keys(regionalSoilData[state].districts).map(d => 
      d.charAt(0).toUpperCase() + d.slice(1)
    )
  }));
};

module.exports = {
  predictSoilData,
  getAvailableStates
};
