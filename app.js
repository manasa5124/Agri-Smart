/**
 * Main Application File
 * Configures Express app with middleware and routes
 */

const express = require('express');
const cors = require('cors');
const requestLogger = require('./middlewares/requestLogger.middleware');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler.middleware');

// Import route modules
const cropRoutes = require('./routes/crop.routes');
const marketRoutes = require('./routes/market.routes');
const weatherRoutes = require('./routes/weather.routes');
const authRoutes = require('./routes/auth.routes');
const soilRoutes = require('./routes/soil.routes');
const savedLocationRoutes = require('./routes/savedLocation.routes');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
})); // Enable CORS
app.use(requestLogger); // Log all requests

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Agri-Smart API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', cropRoutes);
app.use('/api', marketRoutes);
app.use('/api', weatherRoutes);
app.use('/api', authRoutes);
app.use('/api', soilRoutes);
app.use('/api', savedLocationRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

module.exports = app;
