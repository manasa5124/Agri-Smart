/**
 * SavedLocation Schema
 * Mongoose schema for saving soil data locations with reminders
 */

const mongoose = require('mongoose');

const savedLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  state: {
    type: String,
    required: true
  },
  district: {
    type: String
  },
  taluk: {
    type: String
  },
  soilData: {
    nitrogen: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    ph: { type: Number, required: true }
  },
  source: {
    type: String,
    enum: ['state', 'district', 'default'],
    default: 'state'
  },
  reminderDate: {
    type: Date,
    default: function() {
      // Set reminder to 3 months from now
      const date = new Date();
      date.setMonth(date.getMonth() + 3);
      return date;
    }
  },
  isNotified: {
    type: Boolean,
    default: false
  },
  cropRecommendation: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
savedLocationSchema.index({ userId: 1, reminderDate: 1 });
savedLocationSchema.index({ reminderDate: 1, isNotified: 1 });

module.exports = mongoose.model('SavedLocation', savedLocationSchema);
