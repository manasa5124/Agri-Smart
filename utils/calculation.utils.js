/**
 * Calculation Utility Functions
 * Helper functions for agricultural calculations
 */

/**
 * Calculate soil health score based on N, P, K levels
 * @param {Number} nitrogen - Nitrogen level
 * @param {Number} phosphorus - Phosphorus level
 * @param {Number} potassium - Potassium level
 * @returns {Number} Soil health score (0-100)
 */
const calculateSoilHealthScore = (nitrogen, phosphorus, potassium) => {
  // Normalize each parameter to a 0-100 scale
  const nScore = Math.min((nitrogen / 200) * 100, 100);
  const pScore = Math.min((phosphorus / 150) * 100, 100);
  const kScore = Math.min((potassium / 250) * 100, 100);
  
  // Calculate average
  return Math.round((nScore + pScore + kScore) / 3);
};

/**
 * Calculate pH suitability for different crops
 * @param {Number} ph - Soil pH value
 * @returns {String} pH category (Acidic, Neutral, Alkaline)
 */
const getPHCategory = (ph) => {
  if (ph < 5.5) return 'Acidic';
  if (ph <= 7.5) return 'Neutral';
  return 'Alkaline';
};

/**
 * Calculate water requirement based on temperature and humidity
 * @param {Number} temperature - Temperature in Celsius
 * @param {Number} humidity - Humidity percentage
 * @returns {Number} Water requirement index (0-100)
 */
const calculateWaterRequirement = (temperature, humidity) => {
  // Higher temperature and lower humidity = higher water requirement
  const tempFactor = (temperature + 20) / 80; // Normalize -20 to 60 range
  const humidityFactor = (100 - humidity) / 100;
  
  return Math.round(tempFactor * humidityFactor * 100);
};

/**
 * Calculate growing season suitability
 * @param {Number} temperature - Temperature in Celsius
 * @param {Number} rainfall - Rainfall in mm
 * @returns {String} Season recommendation (Kharif, Rabi, or Zaid)
 */
const determineGrowingSeason = (temperature, rainfall) => {
  // Kharif: Monsoon season (June-September), high rainfall
  if (rainfall > 500 && temperature > 25) {
    return 'Kharif';
  }
  
  // Rabi: Winter season (October-March), lower rainfall, moderate temp
  if (rainfall < 300 && temperature >= 15 && temperature <= 25) {
    return 'Rabi';
  }
  
  // Zaid: Summer season (March-June), high temperature
  if (temperature > 30) {
    return 'Zaid';
  }
  
  return 'Mixed';
};

/**
 * Calculate potential yield based on soil health and environmental factors
 * @param {Object} soilData - Soil parameters
 * @param {Object} weatherData - Environmental parameters
 * @param {String} cropType - Type of crop
 * @returns {Object} Yield prediction with score and factors
 */
const calculatePotentialYield = (soilData, weatherData, cropType) => {
  const soilHealth = calculateSoilHealthScore(
    soilData.nitrogen,
    soilData.phosphorus,
    soilData.potassium
  );
  
  const waterReq = calculateWaterRequirement(
    weatherData.temperature,
    weatherData.humidity
  );
  
  const season = determineGrowingSeason(
    weatherData.temperature,
    weatherData.rainfall
  );
  
  // Base yield score
  let yieldScore = soilHealth * 0.4; // 40% weight to soil health
  
  // Adjust for water availability
  if (weatherData.rainfall > 500) {
    yieldScore += 25; // Good rainfall
  } else if (weatherData.rainfall > 300) {
    yieldScore += 15; // Moderate rainfall
  } else {
    yieldScore += 5; // Low rainfall
  }
  
  // Adjust for temperature
  if (weatherData.temperature >= 20 && weatherData.temperature <= 30) {
    yieldScore += 20; // Optimal temperature
  } else if (weatherData.temperature >= 15 && weatherData.temperature <= 35) {
    yieldScore += 10; // Acceptable temperature
  }
  
  // Adjust for pH
  if (soilData.ph >= 6.0 && soilData.ph <= 7.5) {
    yieldScore += 15; // Optimal pH
  } else if (soilData.ph >= 5.5 && soilData.ph <= 8.0) {
    yieldScore += 5; // Acceptable pH
  }
  
  // Cap at 100
  yieldScore = Math.min(Math.round(yieldScore), 100);
  
  return {
    yieldScore,
    soilHealth,
    waterRequirement: waterReq,
    recommendedSeason: season,
    phCategory: getPHCategory(soilData.ph),
    yieldPotential: yieldScore >= 70 ? 'High' : yieldScore >= 40 ? 'Medium' : 'Low'
  };
};

module.exports = {
  calculateSoilHealthScore,
  getPHCategory,
  calculateWaterRequirement,
  determineGrowingSeason,
  calculatePotentialYield
};
