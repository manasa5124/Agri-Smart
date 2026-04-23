
/**
 * Server Entry Point
 * Starts the Express server
 */

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const initScheduler = require('./config/scheduler');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB()
  .then(() => {
    // Initialize scheduler after database connection
    initScheduler();
  });

// Start the server
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🌱 Agri-Smart Backend API`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API Base: http://localhost:${PORT}/api`);
  console.log('=================================');
  console.log('\nAvailable Endpoints:');
  console.log('  POST   /api/recommend                    - Get crop recommendation');
  console.log('  GET    /api/recommendations/history     - Get recommendation history');
  console.log('  GET    /api/recommendations/:id         - Get specific recommendation');
  console.log('  GET    /api/recommendations             - Get all recommendations');
  console.log('  GET    /api/market-prices               - Get all market prices');
  console.log('  POST   /api/market-prices               - Create market price');
  console.log('  GET    /api/market-prices/:id           - Get specific market price');
  console.log('  PUT    /api/market-prices/:id           - Update market price');
  console.log('  DELETE /api/market-prices/:id           - Delete market price');
  console.log('  GET    /api/market-prices/crop/:cropName/average - Get average price');
  console.log('=================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
