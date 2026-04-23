/**
 * Saved Location Service
 * Business logic for saving soil data locations with reminders
 */

const SavedLocation = require('../models/SavedLocation.schema');

/**
 * Save a location with soil data
 * @param {String} userId - User ID
 * @param {Object} locationData - Location and soil data
 * @returns {Object} Saved location record
 */
const saveLocation = async (userId, locationData) => {
  const { state, district, taluk, soilData, source, cropRecommendation } = locationData;
  
  // Calculate reminder date (3 months from now)
  const reminderDate = new Date();
  reminderDate.setMonth(reminderDate.getMonth() + 3);
  
  return await SavedLocation.create({
    userId,
    state,
    district,
    taluk,
    soilData,
    source,
    reminderDate,
    cropRecommendation
  });
};

/**
 * Get all saved locations for a user
 * @param {String} userId - User ID
 * @returns {Array} Saved location records
 */
const getSavedLocations = async (userId) => {
  return await SavedLocation.find({ userId })
    .sort({ createdAt: -1 });
};

/**
 * Get locations that need reminders (within 3 days of reminder date)
 * @returns {Array} Locations needing reminders
 */
const getLocationsNeedingReminder = async () => {
  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  
  return await SavedLocation.find({
    reminderDate: { $lte: threeDaysFromNow },
    isNotified: false
  }).populate('userId', 'name email');
};

/**
 * Mark a location as notified
 * @param {String} locationId - Location ID
 * @returns {Object} Updated location record
 */
const markAsNotified = async (locationId) => {
  return await SavedLocation.findByIdAndUpdate(
    locationId,
    { isNotified: true },
    { new: true }
  );
};

/**
 * Delete a saved location
 * @param {String} locationId - Location ID
 * @param {String} userId - User ID (for authorization)
 * @returns {Boolean} Success status
 */
const deleteSavedLocation = async (locationId, userId) => {
  const location = await SavedLocation.findOneAndDelete({
    _id: locationId,
    userId
  });
  
  if (!location) {
    throw new Error('Saved location not found or unauthorized');
  }
  
  return true;
};

/**
 * Get upcoming reminders for a user
 * @param {String} userId - User ID
 * @returns {Array} Upcoming reminders
 */
const getUpcomingReminders = async (userId) => {
  const now = new Date();
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  
  return await SavedLocation.find({
    userId,
    reminderDate: { $gte: now, $lte: oneMonthFromNow },
    isNotified: false
  }).sort({ reminderDate: 1 });
};

module.exports = {
  saveLocation,
  getSavedLocations,
  getLocationsNeedingReminder,
  markAsNotified,
  deleteSavedLocation,
  getUpcomingReminders
};
