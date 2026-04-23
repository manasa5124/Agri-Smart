/**
 * Soil Data Routes
 * Defines API endpoints for soil data prediction
 */

const express = require('express');
const router = express.Router();
const soilController = require('../controllers/soil.controller');

/**
 * POST /api/soil/predict
 * Predict soil data based on location
 * Body: { state, district?, taluk? }
 */
router.post('/soil/predict', soilController.predictSoilData);

/**
 * GET /api/soil/states
 * Get all available states and districts
 */
router.get('/soil/states', soilController.getAvailableStates);

module.exports = router;
