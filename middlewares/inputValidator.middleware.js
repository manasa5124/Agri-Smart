/**
 * Input Validator Middleware
 * Ensures soil parameters (N, P, K, pH) are present and within valid numeric ranges
 * Also validates market price data
 */

const validateSoilData = (req, res, next) => {
  const { nitrogen, phosphorus, potassium, ph } = req.body;
  
  // Check if all required soil parameters are present
  if (nitrogen === undefined || phosphorus === undefined || 
      potassium === undefined || ph === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Insufficient soil data provided. Required: nitrogen, phosphorus, potassium, ph'
    });
  }
  
  // Validate nitrogen (should be positive number, typically 0-200)
  if (typeof nitrogen !== 'number' || nitrogen < 0 || nitrogen > 500) {
    return res.status(400).json({
      success: false,
      error: 'Invalid nitrogen value. Must be a number between 0 and 500'
    });
  }
  
  // Validate phosphorus (should be positive number, typically 0-200)
  if (typeof phosphorus !== 'number' || phosphorus < 0 || phosphorus > 300) {
    return res.status(400).json({
      success: false,
      error: 'Invalid phosphorus value. Must be a number between 0 and 300'
    });
  }
  
  // Validate potassium (should be positive number, typically 0-300)
  if (typeof potassium !== 'number' || potassium < 0 || potassium > 500) {
    return res.status(400).json({
      success: false,
      error: 'Invalid potassium value. Must be a number between 0 and 500'
    });
  }
  
  // Validate pH (MUST be between 0 and 14)
  if (typeof ph !== 'number' || ph < 0 || ph > 14) {
    return res.status(400).json({
      success: false,
      error: 'Invalid pH value. Must be a number between 0 and 14'
    });
  }
  
  next();
};

const validateWeatherData = (req, res, next) => {
  const { temperature, humidity, rainfall } = req.body;
  
  // Check if all required weather parameters are present
  if (temperature === undefined || humidity === undefined || rainfall === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Insufficient weather data provided. Required: temperature, humidity, rainfall'
    });
  }
  
  // Validate temperature (typically -20 to 50°C)
  if (typeof temperature !== 'number' || temperature < -20 || temperature > 60) {
    return res.status(400).json({
      success: false,
      error: 'Invalid temperature value. Must be a number between -20 and 60°C'
    });
  }
  
  // Validate humidity (0-100%)
  if (typeof humidity !== 'number' || humidity < 0 || humidity > 100) {
    return res.status(400).json({
      success: false,
      error: 'Invalid humidity value. Must be a number between 0 and 100%'
    });
  }
  
  // Validate rainfall (0-1000mm)
  if (typeof rainfall !== 'number' || rainfall < 0 || rainfall > 2000) {
    return res.status(400).json({
      success: false,
      error: 'Invalid rainfall value. Must be a number between 0 and 2000mm'
    });
  }
  
  next();
};

const validateMarketPriceData = (req, res, next) => {
  const { cropName, price, location } = req.body;
  
  // Check if all required market price parameters are present
  if (!cropName || price === undefined || !location) {
    return res.status(400).json({
      success: false,
      error: 'Insufficient market data provided. Required: cropName, price, location'
    });
  }
  
  // Validate crop name (non-empty string)
  if (typeof cropName !== 'string' || cropName.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid crop name. Must be a non-empty string'
    });
  }
  
  // Validate price (positive number)
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid price value. Must be a positive number'
    });
  }
  
  // Validate location (non-empty string)
  if (typeof location !== 'string' || location.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid location. Must be a non-empty string'
    });
  }
  
  next();
};

// Combined validator for complete recommendation request
const validateRecommendationRequest = (req, res, next) => {
  // First validate soil data
  const soilValidation = validateSoilData(req, res, () => {});
  if (res.headersSent) return;
  
  // Then validate weather data
  const weatherValidation = validateWeatherData(req, res, () => {});
  if (res.headersSent) return;
  
  next();
};

module.exports = {
  validateSoilData,
  validateWeatherData,
  validateMarketPriceData,
  validateRecommendationRequest
};
