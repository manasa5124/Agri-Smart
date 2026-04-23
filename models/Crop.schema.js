/**
 * Crop Recommendation Schema
 * Mongoose schema for crop recommendation records
 */

const mongoose = require('mongoose');

const soilDataSchema = new mongoose.Schema({
  nitrogen: {
    type: Number,
    required: true,
    min: 0,
    max: 500
  },
  phosphorus: {
    type: Number,
    required: true,
    min: 0,
    max: 300
  },
  potassium: {
    type: Number,
    required: true,
    min: 0,
    max: 500
  },
  ph: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  }
});

const weatherDataSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true,
    min: -20,
    max: 60
  },
  humidity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  rainfall: {
    type: Number,
    required: true,
    min: 0,
    max: 2000
  }
});

const inputsSchema = new mongoose.Schema({
  soil: {
    type: soilDataSchema,
    required: true
  },
  weather: {
    type: weatherDataSchema,
    required: true
  }
});

const yieldPredictionSchema = new mongoose.Schema({
  yieldScore: {
    type: Number,
    required: true
  },
  soilHealth: {
    type: Number,
    required: true
  },
  waterRequirement: {
    type: Number,
    required: true
  },
  recommendedSeason: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid', 'Mixed'],
    required: true
  },
  phCategory: {
    type: String,
    enum: ['Acidic', 'Neutral', 'Alkaline'],
    required: true
  },
  yieldPotential: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true
  }
});

const cropRecommendationSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default'
  },
  inputs: {
    type: inputsSchema,
    required: true
  },
  recommendedCrop: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  reasoning: {
    type: String,
    required: true
  },
  yieldPrediction: {
    type: yieldPredictionSchema
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
cropRecommendationSchema.index({ userId: 1, timestamp: -1 });
cropRecommendationSchema.index({ recommendedCrop: 1 });

module.exports = mongoose.model('CropRecommendation', cropRecommendationSchema);
