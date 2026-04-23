/**
 * Crop Recommendation Controller
 * Handles request/response logic for crop recommendations
 */

const cropService = require('../services/crop.service');

/**
 * POST /api/recommend
 * Accepts soil data and environmental data, returns crop recommendation
 */
const getRecommendation = async (req, res, next) => {
  try {
    const { nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall } = req.body;
    
    // Prepare data objects
    const soilData = { nitrogen, phosphorus, potassium, ph };
    const weatherData = { temperature, humidity, rainfall };
    
    // Call service layer
    const result = await cropService.recommendCrop(soilData, weatherData);
    
    // Send response with 201 status for created recommendation
    res.status(201).json({
      success: true,
      data: result,
      message: 'Crop recommendation generated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/recommendations/history
 * Retrieve previous recommendation logs for a specific user
 */
const getRecommendationHistory = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'default';
    
    const history = await cropService.getRecommendationHistory(userId);
    
    res.status(200).json({
      success: true,
      data: history,
      count: history.length,
      message: 'Recommendation history retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/recommendations/:id
 * Get a specific recommendation by ID
 */
const getRecommendationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const recommendation = await cropService.getRecommendationById(id);
    
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/recommendations
 * Get all recommendations (admin function)
 */
const getAllRecommendations = async (req, res, next) => {
  try {
    const recommendations = await cropService.getAllRecommendations();
    
    res.status(200).json({
      success: true,
      data: recommendations,
      count: recommendations.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendation,
  getRecommendationHistory,
  getRecommendationById,
  getAllRecommendations
};
