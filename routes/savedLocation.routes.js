/**
 * Saved Location Routes
 * Defines API endpoints for saved locations with reminders
 */

const express = require('express');
const router = express.Router();
const savedLocationController = require('../controllers/savedLocation.controller');
const { auth } = require('../middlewares/auth.middleware');

/**
 * POST /api/saved-locations
 * Save a location with soil data (optional auth)
 */
router.post('/saved-locations', savedLocationController.saveLocation);

/**
 * GET /api/saved-locations
 * Get all saved locations for the current user (optional auth)
 */
router.get('/saved-locations', savedLocationController.getSavedLocations);

/**
 * GET /api/saved-locations/reminders
 * Get upcoming reminders for the current user (optional auth)
 */
router.get('/saved-locations/reminders', savedLocationController.getUpcomingReminders);

/**
 * DELETE /api/saved-locations/:id
 * Delete a saved location (requires auth)
 */
router.delete('/saved-locations/:id', auth, savedLocationController.deleteSavedLocation);

/**
 * POST /api/saved-locations/:id/notify
 * Mark a location as notified (internal use)
 */
router.post('/saved-locations/:id/notify', savedLocationController.markAsNotified);

module.exports = router;
