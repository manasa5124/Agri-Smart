/**
 * Crop Recommendation Routes
 * Defines API endpoints for crop recommendations
 */

const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');
const { validateRecommendationRequest } = require('../middlewares/inputValidator.middleware');

/**
 * POST /api/recommend
 * Accepts soil data (N, P, K, pH) and environmental data (Temp, Humidity, Rainfall)
 * Returns crop recommendation with yield prediction
 */
router.post('/recommend', validateRecommendationRequest, cropController.getRecommendation);

/**
 * GET /api/recommendations/history
 * Retrieve previous recommendation logs for a specific user
 * Query params: userId (optional)
 */
router.get('/recommendations/history', cropController.getRecommendationHistory);

/**
 * GET /api/recommendations/:id
 * Get a specific recommendation by ID
 */
router.get('/recommendations/:id', cropController.getRecommendationById);

/**
 * GET /api/recommendations
 * Get all recommendations (admin function)
 */
router.get('/recommendations', cropController.getAllRecommendations);

module.exports = router;
