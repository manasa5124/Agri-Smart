/**
 * Market Price Model
 * Defines the structure for market (mandi) price data
 * Uses in-memory storage (no database)
 */

class MarketModel {
  constructor() {
    // In-memory storage for market prices
    this.marketPrices = [];
    this.idCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  /**
   * Initialize with sample market data
   */
  initializeSampleData() {
    this.marketPrices = [
      {
        id: this.idCounter++,
        cropName: 'Wheat',
        price: 2100,
        location: 'Punjab Mandi',
        timestamp: new Date().toISOString()
      },
      {
        id: this.idCounter++,
        cropName: 'Rice',
        price: 2800,
        location: 'Haryana Mandi',
        timestamp: new Date().toISOString()
      },
      {
        id: this.idCounter++,
        cropName: 'Cotton',
        price: 6500,
        location: 'Maharashtra Mandi',
        timestamp: new Date().toISOString()
      },
      {
        id: this.idCounter++,
        cropName: 'Soybean',
        price: 4200,
        location: 'Madhya Pradesh Mandi',
        timestamp: new Date().toISOString()
      },
      {
        id: this.idCounter++,
        cropName: 'Maize',
        price: 1800,
        location: 'Karnataka Mandi',
        timestamp: new Date().toISOString()
      }
    ];
  }

  /**
   * Create a new market price record
   * @param {String} cropName - Name of the crop
   * @param {Number} price - Current price per quintal
   * @param {String} location - Mandi location
   * @returns {Object} The created market price record
   */
  createMarketPrice(cropName, price, location) {
    const marketPrice = {
      id: this.idCounter++,
      cropName,
      price,
      location,
      timestamp: new Date().toISOString()
    };
    
    this.marketPrices.push(marketPrice);
    return marketPrice;
  }

  /**
   * Get all market prices
   * @returns {Array} All market price records
   */
  getAllMarketPrices() {
    return this.marketPrices;
  }

  /**
   * Get market prices by crop name
   * @param {String} cropName - Name of the crop to filter
   * @returns {Array} Filtered market price records
   */
  getMarketPricesByCrop(cropName) {
    return this.marketPrices.filter(mp => 
      mp.cropName.toLowerCase() === cropName.toLowerCase()
    );
  }

  /**
   * Get market prices by location
   * @param {String} location - Mandi location to filter
   * @returns {Array} Filtered market price records
   */
  getMarketPricesByLocation(location) {
    return this.marketPrices.filter(mp => 
      mp.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  /**
   * Search market prices by crop name or location
   * @param {String} searchTerm - Search term for crop or location
   * @returns {Array} Filtered market price records
   */
  searchMarketPrices(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.marketPrices.filter(mp => 
      mp.cropName.toLowerCase().includes(term) ||
      mp.location.toLowerCase().includes(term)
    );
  }

  /**
   * Get a specific market price by ID
   * @param {Number} id - Market price ID
   * @returns {Object|null} The market price record or null
   */
  getMarketPriceById(id) {
    return this.marketPrices.find(mp => mp.id === id) || null;
  }

  /**
   * Update a market price record
   * @param {Number} id - Market price ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated market price record or null
   */
  updateMarketPrice(id, updates) {
    const index = this.marketPrices.findIndex(mp => mp.id === id);
    if (index === -1) return null;
    
    this.marketPrices[index] = {
      ...this.marketPrices[index],
      ...updates,
      timestamp: new Date().toISOString()
    };
    
    return this.marketPrices[index];
  }

  /**
   * Delete a market price record
   * @param {Number} id - Market price ID
   * @returns {Boolean} Success status
   */
  deleteMarketPrice(id) {
    const index = this.marketPrices.findIndex(mp => mp.id === id);
    if (index === -1) return false;
    
    this.marketPrices.splice(index, 1);
    return true;
  }
}

// Export singleton instance
module.exports = new MarketModel();
