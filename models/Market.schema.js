/**
 * Market Price Schema
 * Mongoose schema for market (mandi) price data
 */

const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
marketPriceSchema.index({ cropName: 1, location: 1 });
marketPriceSchema.index({ timestamp: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
