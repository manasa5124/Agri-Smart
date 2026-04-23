/**
 * Market Price Routes
 * Defines API endpoints for market price operations
 */

const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market.controller');
const { validateMarketPriceData } = require('../middlewares/inputValidator.middleware');

/**
 * POST /api/market-prices
 * Create a new market price record
 * Body: { cropName, price, location }
 */
router.post('/market-prices', validateMarketPriceData, marketController.createMarketPrice);

/**
 * GET /api/market-prices
 * Get all market prices with optional filters
 * Query params:
 *   - crop: Filter by crop name
 *   - location: Filter by mandi location
 *   - search: Search by crop name or location (bonus feature)
 */
router.get('/market-prices', marketController.getAllMarketPrices);

/**
 * GET /api/market-prices/:id
 * Get a specific market price by ID
 */
router.get('/market-prices/:id', marketController.getMarketPriceById);

/**
 * PUT /api/market-prices/:id
 * Update a market price record
 * Body: { cropName?, price?, location? }
 */
router.put('/market-prices/:id', marketController.updateMarketPrice);

/**
 * DELETE /api/market-prices/:id
 * Delete a market price record
 */
router.delete('/market-prices/:id', marketController.deleteMarketPrice);

/**
 * GET /api/market-prices/crop/:cropName/average
 * Get average price for a specific crop across all locations
 */
router.get('/market-prices/crop/:cropName/average', marketController.getAveragePriceByCrop);

module.exports = router;
