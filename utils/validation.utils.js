/**
 * Validation Utility Functions
 * Helper functions for validating agricultural inputs
 * Implements DRY principle by reusing validation logic
 */

/**
 * Validate if a value is a number within a specified range
 * @param {Number} value - Value to validate
 * @param {Number} min - Minimum allowed value
 * @param {Number} max - Maximum allowed value
 * @returns {Boolean} True if valid, false otherwise
 */
const isNumberInRange = (value, min, max) => {
  return typeof value === 'number' && value >= min && value <= max;
};

/**
 * Validate soil pH (must be between 0 and 14)
 * @param {Number} ph - pH value to validate
 * @returns {Object} Validation result with isValid and message
 */
const validatePH = (ph) => {
  if (typeof ph !== 'number') {
    return { isValid: false, message: 'pH must be a number' };
  }
  if (ph < 0 || ph > 14) {
    return { isValid: false, message: 'pH must be between 0 and 14' };
  }
  return { isValid: true };
};

/**
 * Validate nitrogen level
 * @param {Number} nitrogen - Nitrogen value to validate
 * @returns {Object} Validation result
 */
const validateNitrogen = (nitrogen) => {
  if (typeof nitrogen !== 'number') {
    return { isValid: false, message: 'Nitrogen must be a number' };
  }
  if (nitrogen < 0 || nitrogen > 500) {
    return { isValid: false, message: 'Nitrogen must be between 0 and 500' };
  }
  return { isValid: true };
};

/**
 * Validate phosphorus level
 * @param {Number} phosphorus - Phosphorus value to validate
 * @returns {Object} Validation result
 */
const validatePhosphorus = (phosphorus) => {
  if (typeof phosphorus !== 'number') {
    return { isValid: false, message: 'Phosphorus must be a number' };
  }
  if (phosphorus < 0 || phosphorus > 300) {
    return { isValid: false, message: 'Phosphorus must be between 0 and 300' };
  }
  return { isValid: true };
};

/**
 * Validate potassium level
 * @param {Number} potassium - Potassium value to validate
 * @returns {Object} Validation result
 */
const validatePotassium = (potassium) => {
  if (typeof potassium !== 'number') {
    return { isValid: false, message: 'Potassium must be a number' };
  }
  if (potassium < 0 || potassium > 500) {
    return { isValid: false, message: 'Potassium must be between 0 and 500' };
  }
  return { isValid: true };
};

/**
 * Validate temperature
 * @param {Number} temperature - Temperature value to validate
 * @returns {Object} Validation result
 */
const validateTemperature = (temperature) => {
  if (typeof temperature !== 'number') {
    return { isValid: false, message: 'Temperature must be a number' };
  }
  if (temperature < -20 || temperature > 60) {
    return { isValid: false, message: 'Temperature must be between -20 and 60°C' };
  }
  return { isValid: true };
};

/**
 * Validate humidity
 * @param {Number} humidity - Humidity value to validate
 * @returns {Object} Validation result
 */
const validateHumidity = (humidity) => {
  if (typeof humidity !== 'number') {
    return { isValid: false, message: 'Humidity must be a number' };
  }
  if (humidity < 0 || humidity > 100) {
    return { isValid: false, message: 'Humidity must be between 0 and 100%' };
  }
  return { isValid: true };
};

/**
 * Validate rainfall
 * @param {Number} rainfall - Rainfall value to validate
 * @returns {Object} Validation result
 */
const validateRainfall = (rainfall) => {
  if (typeof rainfall !== 'number') {
    return { isValid: false, message: 'Rainfall must be a number' };
  }
  if (rainfall < 0 || rainfall > 2000) {
    return { isValid: false, message: 'Rainfall must be between 0 and 2000mm' };
  }
  return { isValid: true };
};

/**
 * Validate complete soil data object
 * @param {Object} soilData - Soil data object with N, P, K, pH
 * @returns {Object} Validation result with isValid and errors array
 */
const validateSoilData = (soilData) => {
  const errors = [];
  
  if (!soilData.nitrogen && soilData.nitrogen !== 0) {
    errors.push('Nitrogen is required');
  } else {
    const nValidation = validateNitrogen(soilData.nitrogen);
    if (!nValidation.isValid) errors.push(nValidation.message);
  }
  
  if (!soilData.phosphorus && soilData.phosphorus !== 0) {
    errors.push('Phosphorus is required');
  } else {
    const pValidation = validatePhosphorus(soilData.phosphorus);
    if (!pValidation.isValid) errors.push(pValidation.message);
  }
  
  if (!soilData.potassium && soilData.potassium !== 0) {
    errors.push('Potassium is required');
  } else {
    const kValidation = validatePotassium(soilData.potassium);
    if (!kValidation.isValid) errors.push(kValidation.message);
  }
  
  if (!soilData.ph && soilData.ph !== 0) {
    errors.push('pH is required');
  } else {
    const phValidation = validatePH(soilData.ph);
    if (!phValidation.isValid) errors.push(phValidation.message);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate complete weather data object
 * @param {Object} weatherData - Weather data object with temp, humidity, rainfall
 * @returns {Object} Validation result with isValid and errors array
 */
const validateWeatherData = (weatherData) => {
  const errors = [];
  
  if (!weatherData.temperature && weatherData.temperature !== 0) {
    errors.push('Temperature is required');
  } else {
    const tempValidation = validateTemperature(weatherData.temperature);
    if (!tempValidation.isValid) errors.push(tempValidation.message);
  }
  
  if (!weatherData.humidity && weatherData.humidity !== 0) {
    errors.push('Humidity is required');
  } else {
    const humValidation = validateHumidity(weatherData.humidity);
    if (!humValidation.isValid) errors.push(humValidation.message);
  }
  
  if (!weatherData.rainfall && weatherData.rainfall !== 0) {
    errors.push('Rainfall is required');
  } else {
    const rainValidation = validateRainfall(weatherData.rainfall);
    if (!rainValidation.isValid) errors.push(rainValidation.message);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  isNumberInRange,
  validatePH,
  validateNitrogen,
  validatePhosphorus,
  validatePotassium,
  validateTemperature,
  validateHumidity,
  validateRainfall,
  validateSoilData,
  validateWeatherData
};
