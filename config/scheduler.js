/**
 * Scheduler Configuration
 * Runs scheduled tasks like reminder notifications
 */

const cron = require('node-cron');
const notificationService = require('../services/notification.service');

/**
 * Initialize all scheduled tasks
 */
const initScheduler = () => {
  console.log('⏰ Initializing scheduler...');
  
  // Run reminder check every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    await notificationService.checkAndSendReminders();
  });
  
  // Also run immediately on startup for testing
  // Comment this out in production if you don't want immediate checks
  setTimeout(async () => {
    await notificationService.checkAndSendReminders();
  }, 5000);
  
  console.log('✅ Scheduler initialized - Reminders will be checked daily at 9:00 AM');
};

module.exports = initScheduler;
