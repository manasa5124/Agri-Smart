/**
 * Database Seed Script
 * Populates MongoDB with initial sample data
 */

require('dotenv').config();
const connectDB = require('./config/database');
const MarketPrice = require('./models/Market.schema');

const seedMarketPrices = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await MarketPrice.deleteMany({});
    console.log('✅ Cleared existing market price data');
    
    // Sample market price data
    const sampleData = [
      {
        cropName: 'Wheat',
        price: 2100,
        location: 'Punjab Mandi'
      },
      {
        cropName: 'Rice',
        price: 2800,
        location: 'Haryana Mandi'
      },
      {
        cropName: 'Cotton',
        price: 6500,
        location: 'Maharashtra Mandi'
      },
      {
        cropName: 'Soybean',
        price: 4200,
        location: 'Madhya Pradesh Mandi'
      },
      {
        cropName: 'Maize',
        price: 1800,
        location: 'Karnataka Mandi'
      },
      {
        cropName: 'Wheat',
        price: 2150,
        location: 'Haryana Mandi'
      },
      {
        cropName: 'Rice',
        price: 2900,
        location: 'Punjab Mandi'
      },
      {
        cropName: 'Barley',
        price: 1950,
        location: 'Rajasthan Mandi'
      },
      {
        cropName: 'Mustard',
        price: 5200,
        location: 'Rajasthan Mandi'
      },
      {
        cropName: 'Gram',
        price: 4800,
        location: 'Madhya Pradesh Mandi'
      }
    ];
    
    // Insert sample data
    await MarketPrice.insertMany(sampleData);
    console.log('✅ Inserted sample market price data');
    
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedMarketPrices();
