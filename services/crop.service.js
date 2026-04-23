/**
 * Crop Recommendation Service
 * Business logic for crop recommendations
 * Integrates with Python ML service for AI-based recommendations
 */

const CropRecommendation = require('../models/Crop.schema');
const { calculatePotentialYield } = require('../utils/calculation.utils');
const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

/**
 * AI-based crop recommendation logic
 * Calls Python ML service for prediction
 * Falls back to rule-based logic if ML service is unavailable
 * @param {Object} soilData - Soil parameters (N, P, K, pH)
 * @param {Object} weatherData - Environmental parameters (temp, humidity, rainfall)
 * @returns {Object} Recommendation result with crop and confidence
 */
const recommendCrop = async (soilData, weatherData) => {
  let recommendedCrop = '';
  let confidence = 0;
  let reasoning = '';
  let useML = false;

  try {
    // Try to call Python ML service
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
      soil: soilData,
      weather: weatherData
    }, { timeout: 3000 });

    if (response.data && response.data.recommended_crop) {
      recommendedCrop = response.data.recommended_crop;
      confidence = response.data.confidence;
      reasoning = 'ML-based prediction from trained model';
      useML = true;
    }
  } catch (error) {
    console.log('ML service unavailable, using rule-based prediction:', error.message);
    // Fall back to rule-based prediction
  }

  // Rule-based fallback (if ML service fails or returns no result)
  if (!recommendedCrop) {
    const { nitrogen, phosphorus, potassium, ph } = soilData;
    const { temperature, humidity, rainfall } = weatherData;

    // Decision tree based on soil and environmental conditions
    if (ph >= 6.0 && ph <= 7.5) {
      // Neutral pH - most crops grow well
      if (rainfall > 500 && temperature > 25) {
        recommendedCrop = 'Rice';
        confidence = 85;
        reasoning = 'High rainfall and warm temperature with neutral pH ideal for rice cultivation';
      } else if (rainfall < 300 && temperature >= 15 && temperature <= 25) {
        if (nitrogen > 100) {
          recommendedCrop = 'Wheat';
          confidence = 90;
          reasoning = 'Moderate rainfall, cool temperature, and high nitrogen favor wheat';
        } else {
          recommendedCrop = 'Chickpea';
          confidence = 75;
          reasoning = 'Moderate conditions suitable for legumes like chickpea';
        }
      } else if (temperature > 30) {
        recommendedCrop = 'Maize';
        confidence = 80;
        reasoning = 'High temperature suitable for maize cultivation';
      } else {
        recommendedCrop = 'Soybean';
        confidence = 78;
        reasoning = 'Neutral pH conditions suitable for soybean';
      }
    } else if (ph < 5.5) {
      // Acidic soil
      if (rainfall > 400 && temperature > 25) {
        recommendedCrop = 'Tea';
        confidence = 82;
        reasoning = 'Acidic soil with high rainfall and humidity ideal for tea';
      } else {
        recommendedCrop = 'Potato';
        confidence = 70;
        reasoning = 'Acidic soil conditions suitable for potato cultivation';
      }
    } else {
      // Alkaline soil
      if (rainfall < 400 && temperature >= 20 && temperature <= 30) {
        recommendedCrop = 'Cotton';
        confidence = 85;
        reasoning = 'Alkaline soil with moderate conditions suitable for cotton';
      } else {
        recommendedCrop = 'Sugarcane';
        confidence = 75;
        reasoning = 'Alkaline soil tolerant crops like sugarcane';
      }
    }

    // Adjust confidence based on nutrient levels
    if (nitrogen < 50 || phosphorus < 30 || potassium < 30) {
      confidence -= 15;
      reasoning += ' (Note: Soil nutrients are low, consider fertilization)';
    }
  }

  // Calculate potential yield
  const yieldPrediction = calculatePotentialYield(soilData, weatherData, recommendedCrop);

  // Store recommendation in MongoDB
  const recommendationRecord = await CropRecommendation.create({
    inputs: {
      soil: soilData,
      weather: weatherData
    },
    recommendedCrop,
    confidence,
    reasoning,
    yieldPrediction
  });

  return {
    recommendedCrop,
    confidence: Math.max(confidence, 50), // Minimum 50% confidence
    reasoning,
    yieldPrediction,
    recommendationId: recommendationRecord.id,
    timestamp: recommendationRecord.timestamp,
    useML
  };
};

/**
 * Get recommendation history for a user
 * @param {String} userId - User identifier
 * @returns {Array} Array of recommendation records
 */
const getRecommendationHistory = async (userId) => {
  return await CropRecommendation.find({ userId }).sort({ timestamp: -1 });
};

/**
 * Get a specific recommendation by ID
 * @param {String} id - Recommendation ID (MongoDB ObjectId)
 * @returns {Object} Recommendation record or null
 */
const getRecommendationById = async (id) => {
  return await CropRecommendation.findById(id);
};

/**
 * Get all recommendations (admin function)
 * @returns {Array} All recommendation records
 */
const getAllRecommendations = async () => {
  return await CropRecommendation.find().sort({ timestamp: -1 });
};

module.exports = {
  recommendCrop,
  getRecommendationHistory,
  getRecommendationById,
  getAllRecommendations
};
