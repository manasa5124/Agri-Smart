/**
 * Saved Location Controller
 * Handles request/response logic for saved locations with reminders
 */

const savedLocationService = require('../services/savedLocation.service');

/**
 * POST /api/saved-locations
 * Save a location with soil data
 */
const saveLocation = async (req, res, next) => {
  try {
    const userId = req.user?._id; // Will be null if not authenticated
    const locationData = req.body;
    
    const savedLocation = await savedLocationService.saveLocation(userId, locationData);
    
    res.status(201).json({
      success: true,
      data: savedLocation,
      message: 'Location saved successfully. You will be reminded in 3 months.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/saved-locations
 * Get all saved locations for the current user
 */
const getSavedLocations = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      // Return empty array for non-authenticated users
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Please login to view saved locations'
      });
    }
    
    const locations = await savedLocationService.getSavedLocations(userId);
    
    res.status(200).json({
      success: true,
      data: locations,
      count: locations.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/saved-locations/reminders
 * Get upcoming reminders for the current user
 */
const getUpcomingReminders = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Please login to view reminders'
      });
    }
    
    const reminders = await savedLocationService.getUpcomingReminders(userId);
    
    res.status(200).json({
      success: true,
      data: reminders,
      count: reminders.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/saved-locations/:id
 * Delete a saved location
 */
const deleteSavedLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    
    await savedLocationService.deleteSavedLocation(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/saved-locations/:id/notify
 * Mark a location as notified (internal use)
 */
const markAsNotified = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const location = await savedLocationService.markAsNotified(id);
    
    res.status(200).json({
      success: true,
      data: location,
      message: 'Location marked as notified'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveLocation,
  getSavedLocations,
  getUpcomingReminders,
  deleteSavedLocation,
  markAsNotified
};
