/**
 * Weather Routes
 * Defines API endpoints for weather data
 */

const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');

/**
 * GET /api/weather/current
 * Get current weather by coordinates
 * Query params: latitude, longitude
 */
router.get('/weather/current', weatherController.getCurrentWeather);

/**
 * GET /api/weather/city/:city
 * Get current weather by city name
 */
router.get('/weather/city/:city', weatherController.getWeatherByCity);

/**
 * GET /api/weather/forecast
 * Get weather forecast by coordinates
 * Query params: latitude, longitude, days (optional, default 7)
 */
router.get('/weather/forecast', weatherController.getWeatherForecast);

module.exports = router;
