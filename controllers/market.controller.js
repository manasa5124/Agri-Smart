/**
 * Market Price Controller
 * Handles request/response logic for market price operations
 */

const marketService = require('../services/market.service');

/**
 * POST /api/market-prices
 * Create a new market price record
 */
const createMarketPrice = async (req, res, next) => {
  try {
    const { cropName, price, location } = req.body;
    
    const newPrice = await marketService.createMarketPrice(cropName, price, location);
    
    res.status(201).json({
      success: true,
      data: newPrice,
      message: 'Market price record created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/market-prices
 * Get all market prices with optional filters
 */
const getAllMarketPrices = async (req, res, next) => {
  try {
    const { crop, location, search } = req.query;
    
    let prices;
    
    if (search) {
      prices = await marketService.searchMarketPrices(search);
    } else if (crop && location) {
      prices = await marketService.getMarketPricesByCropAndLocation(crop, location);
    } else if (crop) {
      prices = await marketService.getMarketPricesByCrop(crop);
    } else if (location) {
      prices = await marketService.getMarketPricesByLocation(location);
    } else {
      prices = await marketService.getAllMarketPrices();
    }
    
    res.status(200).json({
      success: true,
      data: prices,
      count: prices.length,
      message: 'Market prices retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/market-prices/:id
 * Get a specific market price by ID
 */
const getMarketPriceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const price = await marketService.getMarketPriceById(id);
    
    res.status(200).json({
      success: true,
      data: price
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/market-prices/:id
 * Update a market price record
 */
const updateMarketPrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedPrice = await marketService.updateMarketPrice(id, updates);
    
    res.status(200).json({
      success: true,
      data: updatedPrice,
      message: 'Market price updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/market-prices/:id
 * Delete a market price record
 */
const deleteMarketPrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await marketService.deleteMarketPrice(id);
    
    res.status(200).json({
      success: true,
      message: 'Market price deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/market-prices/crop/:cropName/average
 * Get average price for a specific crop across all locations
 */
const getAveragePriceByCrop = async (req, res, next) => {
  try {
    const { cropName } = req.params;
    
    const stats = await marketService.getAveragePriceByCrop(cropName);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMarketPrice,
  getAllMarketPrices,
  getMarketPriceById,
  updateMarketPrice,
  deleteMarketPrice,
  getAveragePriceByCrop
};
