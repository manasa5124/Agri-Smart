/**
 * Weather Controller
 * Handles request/response logic for weather data
 */

const weatherService = require('../services/weather.service');

/**
 * GET /api/weather/current
 * Get current weather by coordinates
 * Query params: latitude, longitude
 */
const getCurrentWeather = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }
    
    const weather = await weatherService.getCurrentWeather(
      parseFloat(latitude),
      parseFloat(longitude)
    );
    
    res.status(200).json({
      success: true,
      data: weather
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/weather/city/:city
 * Get current weather by city name
 */
const getWeatherByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    
    const weather = await weatherService.getWeatherByCity(city);
    
    res.status(200).json({
      success: true,
      data: weather
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/weather/forecast
 * Get weather forecast by coordinates
 * Query params: latitude, longitude, days (optional, default 7)
 */
const getWeatherForecast = async (req, res, next) => {
  try {
    const { latitude, longitude, days } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }
    
    const forecast = await weatherService.getWeatherForecast(
      parseFloat(latitude),
      parseFloat(longitude),
      days ? parseInt(days) : 7
    );
    
    res.status(200).json({
      success: true,
      data: forecast
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentWeather,
  getWeatherByCity,
  getWeatherForecast
};
