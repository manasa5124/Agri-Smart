/**
 * Crop Recommendation Model
 * Defines the structure for crop recommendation records
 * Uses in-memory storage (no database)
 */

class CropModel {
  constructor() {
    // In-memory storage for recommendation history
    this.recommendations = [];
    this.idCounter = 1;
  }

  /**
   * Create a new recommendation record
   * @param {Object} soilData - Soil parameters (N, P, K, pH)
   * @param {Object} weatherData - Environmental data (temp, humidity, rainfall)
   * @param {String} recommendedCrop - The recommended crop
   * @returns {Object} The created recommendation record
   */
  createRecommendation(soilData, weatherData, recommendedCrop) {
    const recommendation = {
      id: this.idCounter++,
      inputs: {
        soil: soilData,
        weather: weatherData
      },
      recommendedCrop,
      timestamp: new Date().toISOString()
    };
    
    this.recommendations.push(recommendation);
    return recommendation;
  }

  /**
   * Get all recommendation history
   * @returns {Array} All recommendation records
   */
  getAllRecommendations() {
    return this.recommendations;
  }

  /**
   * Get recommendations by user ID (simulated)
   * @param {String} userId - User identifier
   * @returns {Array} Recommendations for the user
   */
  getRecommendationsByUser(userId) {
    // In a real app, this would filter by userId
    // For this prototype, we return all recommendations
    return this.recommendations;
  }

  /**
   * Get a specific recommendation by ID
   * @param {Number} id - Recommendation ID
   * @returns {Object|null} The recommendation record or null
   */
  getRecommendationById(id) {
    return this.recommendations.find(rec => rec.id === id) || null;
  }
}

// Export singleton instance
module.exports = new CropModel();
