/**
 * Weather Service
 * Fetches weather data from Open-Meteo API (Free, no API key required)
 */

const axios = require('axios');

const WEATHER_API_BASE_URL = process.env.WEATHER_API_BASE_URL || 'https://api.open-meteo.com/v1';

/**
 * Get current weather data for a location
 * @param {Number} latitude - Latitude of the location
 * @param {Number} longitude - Longitude of the location
 * @returns {Object} Weather data including temperature, humidity, rainfall
 */
const getCurrentWeather = async (latitude, longitude) => {
  try {
    const url = `${WEATHER_API_BASE_URL}/forecast`;
    const params = {
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,rain',
      timezone: 'auto'
    };

    const response = await axios.get(url, { params });
    
    const current = response.data.current;
    
    return {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      rainfall: current.rain,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw new Error('Failed to fetch weather data from Open-Meteo API');
  }
};

/**
 * Get weather data by city name (using geocoding)
 * @param {String} city - City name
 * @returns {Object} Weather data for the city
 */
const getWeatherByCity = async (city) => {
  try {
    // First, get coordinates for the city using Open-Meteo Geocoding API
    const geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    const geocodingParams = {
      name: city,
      count: 1,
      language: 'en',
      format: 'json'
    };

    const geoResponse = await axios.get(geocodingUrl, { params: geocodingParams });
    
    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      throw new Error(`City not found: ${city}`);
    }

    const location = geoResponse.data.results[0];
    const { latitude, longitude, name, country } = location;

    // Get weather data using coordinates
    const weatherData = await getCurrentWeather(latitude, longitude);
    
    return {
      ...weatherData,
      location: {
        city: name,
        country,
        latitude,
        longitude
      }
    };
  } catch (error) {
    console.error('Error fetching weather by city:', error.message);
    throw new Error(`Failed to fetch weather for city: ${city}`);
  }
};

/**
 * Get weather forecast for multiple days
 * @param {Number} latitude - Latitude
 * @param {Number} longitude - Longitude
 * @param {Number} days - Number of days to forecast (default: 7)
 * @returns {Array} Array of daily weather forecasts
 */
const getWeatherForecast = async (latitude, longitude, days = 7) => {
  try {
    const url = `${WEATHER_API_BASE_URL}/forecast`;
    const params = {
      latitude,
      longitude,
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
      forecast_days: days,
      timezone: 'auto'
    };

    const response = await axios.get(url, { params });
    
    const daily = response.data.daily;
    
    return daily.time.map((date, index) => ({
      date,
      maxTemp: daily.temperature_2m_max[index],
      minTemp: daily.temperature_2m_min[index],
      precipitation: daily.precipitation_sum[index]
    }));
  } catch (error) {
    console.error('Error fetching weather forecast:', error.message);
    throw new Error('Failed to fetch weather forecast from Open-Meteo API');
  }
};

module.exports = {
  getCurrentWeather,
  getWeatherByCity,
  getWeatherForecast
};
