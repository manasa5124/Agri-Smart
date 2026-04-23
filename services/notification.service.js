/**
 * Notification Service
 * Handles checking and sending reminders for saved locations
 */

const savedLocationService = require('./savedLocation.service');

/**
 * Check for locations that need reminders and send notifications
 */
const checkAndSendReminders = async () => {
  try {
    console.log('🔔 Checking for location reminders...');
    
    const locationsNeedingReminder = await savedLocationService.getLocationsNeedingReminder();
    
    if (locationsNeedingReminder.length === 0) {
      console.log('No locations need reminders at this time.');
      return;
    }
    
    console.log(`Found ${locationsNeedingReminder.length} locations needing reminders.`);
    
    // Process each location
    for (const location of locationsNeedingReminder) {
      try {
        // Here you would send actual notifications (email, SMS, push, etc.)
        console.log(`📧 Sending reminder for location: ${location.state}${location.district ? `, ${location.district}` : ''}`);
        console.log(`   User: ${location.userId?.name || 'Unknown'} (${location.userId?.email || 'No email'})`);
        console.log(`   Reminder Date: ${new Date(location.reminderDate).toLocaleDateString()}`);
        console.log(`   Soil Data: N=${location.soilData.nitrogen}, P=${location.soilData.phosphorus}, K=${location.soilData.potassium}, pH=${location.soilData.ph}`);
        
        // Mark as notified
        await savedLocationService.markAsNotified(location._id);
        console.log(`   ✅ Marked as notified`);
      } catch (error) {
        console.error(`   ❌ Failed to process location ${location._id}:`, error.message);
      }
    }
    
    console.log('✅ Reminder check completed.');
  } catch (error) {
    console.error('❌ Error checking reminders:', error);
  }
};

module.exports = {
  checkAndSendReminders
};
