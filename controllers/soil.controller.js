/**
 * Soil Data Controller
 * Handles request/response logic for soil data prediction
 */

const soilService = require('../services/soil.service');

/**
 * POST /api/soil/predict
 * Predict soil data based on location
 */
const predictSoilData = async (req, res, next) => {
  try {
    const { state, district, taluk } = req.body;
    
    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State is required'
      });
    }
    
    const soilData = await soilService.predictSoilData(state, district, taluk);
    
    res.status(200).json({
      success: true,
      data: soilData,
      message: 'Soil data predicted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/soil/states
 * Get all available states and districts
 */
const getAvailableStates = async (req, res, next) => {
  try {
    const states = soilService.getAvailableStates();
    
    res.status(200).json({
      success: true,
      data: states,
      count: states.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  predictSoilData,
  getAvailableStates
};
