/**
 * Market Price Service
 * Business logic for market price operations
 */

const MarketPrice = require('../models/Market.schema');

/**
 * Create a new market price record
 * @param {String} cropName - Name of the crop
 * @param {Number} price - Current price per quintal
 * @param {String} location - Mandi location
 * @returns {Object} Created market price record
 */
const createMarketPrice = async (cropName, price, location) => {
  return await MarketPrice.create({ cropName, price, location });
};

/**
 * Get all market prices
 * @returns {Array} All market price records
 */
const getAllMarketPrices = async () => {
  return await MarketPrice.find().sort({ timestamp: -1 });
};

/**
 * Get market prices by crop name
 * @param {String} cropName - Name of the crop to filter
 * @returns {Array} Filtered market price records
 */
const getMarketPricesByCrop = async (cropName) => {
  const prices = await MarketPrice.find({ 
    cropName: { $regex: cropName, $options: 'i' } 
  }).sort({ timestamp: -1 });
  
  if (prices.length === 0) {
    throw new Error(`No market data found for crop: ${cropName}`);
  }
  
  return prices;
};

/**
 * Get market prices by location
 * @param {String} location - Mandi location to filter
 * @returns {Array} Filtered market price records
 */
const getMarketPricesByLocation = async (location) => {
  const prices = await MarketPrice.find({ 
    location: { $regex: location, $options: 'i' } 
  }).sort({ timestamp: -1 });
  
  if (prices.length === 0) {
    throw new Error(`No market data found for location: ${location}`);
  }
  
  return prices;
};

/**
 * Search market prices by crop name or location
 * @param {String} searchTerm - Search term for crop or location
 * @returns {Array} Filtered market price records
 */
const searchMarketPrices = async (searchTerm) => {
  const prices = await MarketPrice.find({ 
    $or: [
      { cropName: { $regex: searchTerm, $options: 'i' } },
      { location: { $regex: searchTerm, $options: 'i' } }
    ]
  }).sort({ timestamp: -1 });
  
  if (prices.length === 0) {
    throw new Error(`No market data found for search term: ${searchTerm}`);
  }
  
  return prices;
};

/**
 * Get market prices by both crop name and location
 * @param {String} cropName - Name of the crop to filter
 * @param {String} location - Mandi location to filter
 * @returns {Array} Filtered market price records
 */
const getMarketPricesByCropAndLocation = async (cropName, location) => {
  const prices = await MarketPrice.find({ 
    cropName: { $regex: cropName, $options: 'i' },
    location: { $regex: location, $options: 'i' }
  }).sort({ timestamp: -1 });
  
  if (prices.length === 0) {
    throw new Error(`No market data found for crop: ${cropName} in location: ${location}`);
  }
  
  return prices;
};

/**
 * Get a specific market price by ID
 * @param {String} id - Market price ID (MongoDB ObjectId)
 * @returns {Object} Market price record or throws error if not found
 */
const getMarketPriceById = async (id) => {
  const price = await MarketPrice.findById(id);
  
  if (!price) {
    throw new Error(`Market price record with ID ${id} not found`);
  }
  
  return price;
};

/**
 * Update a market price record
 * @param {String} id - Market price ID (MongoDB ObjectId)
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated market price record
 */
const updateMarketPrice = async (id, updates) => {
  const updatedPrice = await MarketPrice.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );
  
  if (!updatedPrice) {
    throw new Error(`Market price record with ID ${id} not found`);
  }
  
  return updatedPrice;
};

/**
 * Delete a market price record
 * @param {String} id - Market price ID (MongoDB ObjectId)
 * @returns {Boolean} Success status
 */
const deleteMarketPrice = async (id) => {
  const deletedPrice = await MarketPrice.findByIdAndDelete(id);
  
  if (!deletedPrice) {
    throw new Error(`Market price record with ID ${id} not found`);
  }
  
  return true;
};

/**
 * Get average price for a specific crop across all locations
 * @param {String} cropName - Name of the crop
 * @returns {Object} Average price and statistics
 */
const getAveragePriceByCrop = async (cropName) => {
  const prices = await MarketPrice.find({ 
    cropName: { $regex: cropName, $options: 'i' } 
  });
  
  if (prices.length === 0) {
    throw new Error(`No market data found for crop: ${cropName}`);
  }
  
  const total = prices.reduce((sum, p) => sum + p.price, 0);
  const average = total / prices.length;
  const min = Math.min(...prices.map(p => p.price));
  const max = Math.max(...prices.map(p => p.price));
  
  return {
    cropName,
    averagePrice: Math.round(average),
    minPrice,
    maxPrice,
    dataPoints: prices.length,
    locations: [...new Set(prices.map(p => p.location))]
  };
};

module.exports = {
  createMarketPrice,
  getAllMarketPrices,
  getMarketPricesByCrop,
  getMarketPricesByLocation,
  getMarketPricesByCropAndLocation,
  searchMarketPrices,
  getMarketPriceById,
  updateMarketPrice,
  deleteMarketPrice,
  getAveragePriceByCrop
};
