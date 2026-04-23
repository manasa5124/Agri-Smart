# Agri-Smart Agricultural Support System

Full-stack AI-powered agricultural support system with crop recommendations, market price viewer, and weather information.

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Mongoose ODM)
- **Python (Flask)** - ML service for crop recommendations
- **scikit-learn** - Machine learning library

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **Recharts** - Data visualization

## Project Structure

```
agri-smart/
├── backend/                        # Node.js/Express backend
│   ├── app.js                     # Express app configuration
│   ├── server.js                  # Server entry point
│   ├── package.json               # Backend dependencies
│   ├── .env                      # Environment variables
│   ├── seed.js                   # Database seeding script
│   ├── config/                   # Configuration files
│   │   ├── database.js          # MongoDB connection
│   │   └── scheduler.js         # Cron job scheduler for reminders
│   ├── controllers/              # Request/response logic
│   │   ├── crop.controller.js   # Crop recommendations
│   │   ├── market.controller.js # Market prices
│   │   ├── weather.controller.js # Weather data
│   │   ├── auth.controller.js   # Authentication
│   │   ├── soil.controller.js   # Soil data prediction
│   │   └── savedLocation.controller.js # Saved locations & reminders
│   ├── services/                # Business logic layer
│   │   ├── crop.service.js     # Recommendation logic
│   │   ├── market.service.js   # Market operations
│   │   ├── weather.service.js  # Weather API integration
│   │   ├── soil.service.js     # Soil data prediction logic
│   │   ├── savedLocation.service.js # Saved locations management
│   │   └── notification.service.js # Reminder notifications
│   ├── models/                  # Mongoose schemas
│   │   ├── Crop.schema.js      # Crop recommendations
│   │   ├── Market.schema.js    # Market prices
│   │   ├── User.schema.js      # User authentication
│   │   ├── SoilData.schema.js  # Soil data records
│   │   └── SavedLocation.schema.js # Saved locations with reminders
│   ├── middlewares/             # Express middleware
│   │   ├── requestLogger.middleware.js
│   │   ├── inputValidator.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   └── auth.middleware.js  # JWT authentication
│   ├── routes/                 # API route definitions
│   │   ├── crop.routes.js
│   │   ├── market.routes.js
│   │   ├── weather.routes.js
│   │   ├── auth.routes.js
│   │   ├── soil.routes.js
│   │   └── savedLocation.routes.js
│   └── utils/                  # Helper functions
│       ├── validation.utils.js
│       ├── calculation.utils.js
│       └── auth.utils.js       # JWT utilities
├── ml-service/                   # Python ML service
│   ├── app.py                  # Flask API for ML predictions
│   ├── requirements.txt         # Python dependencies
│   └── README.md              # ML service documentation
└── frontend/                    # React frontend
    ├── index.html              # HTML entry point
    ├── package.json            # Frontend dependencies
    ├── vite.config.js          # Vite configuration
    ├── tailwind.config.js      # Tailwind configuration
    ├── postcss.config.js       # PostCSS configuration
    └── src/
        ├── main.jsx           # React entry point
        ├── App.jsx            # Main app component
        ├── index.css          # Global styles
        └── components/        # React components
            ├── Navbar.jsx
            ├── CropRecommendation.jsx
            ├── MarketPrices.jsx
            ├── WeatherInfo.jsx
            ├── SoilDataPrediction.jsx
            ├── Login.jsx
            └── Register.jsx
```

## Architecture Explanation

### Clean Architecture Layers

The application follows a layered architecture pattern for scalability and maintainability:

#### 1. **Routes Layer** (`routes/`)
- Defines API endpoints using Express Router
- Separates concerns: `crop.routes.js` for recommendations, `market.routes.js` for prices
- Applies middleware for validation
- Follows REST conventions (POST for creation, GET for retrieval, etc.)

#### 2. **Controllers Layer** (`controllers/`)
- Handles HTTP request/response logic
- Extracts data from `req.body`, `req.params`, `req.query`
- Calls appropriate service methods
- Sets proper HTTP status codes (201 for created, 200 for success, 400 for bad input, 404 for not found)
- Delegates business logic to services

#### 3. **Services Layer** (`services/`)
- Contains business logic
- Simulates future Python AI module integration (async/await patterns)
- Implements recommendation algorithm (currently rule-based, will be ML-based)
- Handles data transformations and calculations
- Returns data to controllers in standardized format

#### 4. **Models Layer** (`models/`)
- Defines data structures for Crop Recommendations and Market Prices
- Manages in-memory storage (arrays)
- Provides CRUD operations
- No database schema - uses JavaScript objects
- Singleton pattern for data persistence during runtime

#### 5. **Middleware Layer** (`middlewares/`)
- **Request Logger**: Logs method, URL, timestamp, and IP for every request
- **Input Validator**: Validates soil parameters (N, P, K, pH) and weather data
  - Ensures pH is between 0 and 14 (critical validation)
  - Checks numeric ranges for all parameters
- **Error Handler**: Centralized error handling with standardized JSON responses

#### 6. **Utils Layer** (`utils/`)
- **Validation Utils**: Reusable validation functions (DRY principle)
  - `validatePH()`, `validateNitrogen()`, `validateTemperature()`, etc.
  - `validateSoilData()`, `validateWeatherData()` for complete objects
- **Calculation Utils**: Agricultural calculations
  - `calculateSoilHealthScore()`: Scores soil based on N, P, K levels
  - `calculatePotentialYield()`: Predicts yield based on crop, soil, and weather
  - `determineGrowingSeason()`: Recommends Kharif/Rabi/Zaid season

### Data Flow: User Input → Recommendation Result

```
1. USER REQUEST
   POST /api/recommend
   Body: { nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall }

2. ROUTE LAYER (crop.routes.js)
   - Route receives request
   - Applies validateRecommendationRequest middleware

3. MIDDLEWARE LAYER (inputValidator.middleware.js)
   - Validates soil data (N, P, K, pH ranges)
   - Validates weather data (temp, humidity, rainfall)
   - Returns 400 error if validation fails

4. CONTROLLER LAYER (crop.controller.js)
   - Extracts data from req.body
   - Calls cropService.recommendCrop(soilData, weatherData)
   - Awaits service response
   - Returns 201 status with recommendation data

5. SERVICE LAYER (crop.service.js)
   - Receives soil and weather data
   - Runs recommendation algorithm (rule-based mock AI)
   - Calculates yield prediction using calculation.utils
   - Stores recommendation in crop model (in-memory)
   - Returns: { recommendedCrop, confidence, reasoning, yieldPrediction }

6. MODEL LAYER (crop.model.js)
   - Creates recommendation record with unique ID
   - Stores in recommendations array
   - Returns record to service

7. RESPONSE TO USER
   Status: 201 Created
   Body: {
     success: true,
     data: {
       recommendedCrop: "Wheat",
       confidence: 90,
       reasoning: "...",
       yieldPrediction: { yieldScore: 75, soilHealth: 80, ... },
       recommendationId: 1,
       timestamp: "2024-04-23T..."
     }
   }
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Python 3.8+ (for ML service)

### Backend Setup

```bash
# Install backend dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/agri-smart
# JWT_SECRET=your-secret-key
# ML_SERVICE_URL=http://localhost:5001

# Seed database with sample data
npm run seed

# Start backend server
npm start
```

Backend runs on `http://localhost:3000`

### ML Service Setup

```bash
cd ml-service

# Install Python dependencies
pip install -r requirements.txt

# Start ML service
python app.py
```

ML service runs on `http://localhost:5001`

### Frontend Setup

```bash
cd frontend

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### Crop Recommendations

#### POST /api/recommend
Get crop recommendation based on soil and weather data.

**Request Body:**
```json
{
  "nitrogen": 120,
  "phosphorus": 60,
  "potassium": 180,
  "ph": 6.5,
  "temperature": 22,
  "humidity": 65,
  "rainfall": 250
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "recommendedCrop": "Wheat",
    "confidence": 90,
    "reasoning": "Moderate rainfall, cool temperature, and high nitrogen favor wheat",
    "yieldPrediction": {
      "yieldScore": 78,
      "soilHealth": 77,
      "waterRequirement": 35,
      "recommendedSeason": "Rabi",
      "phCategory": "Neutral",
      "yieldPotential": "Medium"
    },
    "recommendationId": 1,
    "timestamp": "2024-04-23T06:00:00.000Z"
  },
  "message": "Crop recommendation generated successfully"
}
```

#### GET /api/recommendations/history
Get recommendation history for a user.

**Query Params:** `userId` (optional, defaults to 'default')

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "count": 5,
  "message": "Recommendation history retrieved successfully"
}
```

#### GET /api/recommendations/:id
Get a specific recommendation by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "inputs": { "soil": {...}, "weather": {...} },
    "recommendedCrop": "Wheat",
    "timestamp": "..."
  }
}
```

#### GET /api/recommendations
Get all recommendations (admin function).

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### Authentication

#### POST /api/auth/register
Register a new user with location and crop information.

**Request Body:**
```json
{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "password123",
  "location": "Punjab",
  "district": "Ludhiana",
  "state": "Punjab",
  "primaryCrop": "Wheat",
  "farmSize": "5 acres"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Farmer",
      "email": "john@example.com",
      "location": "Punjab",
      "district": "Ludhiana",
      "state": "Punjab",
      "primaryCrop": "Wheat",
      "farmSize": "5 acres",
      "role": "farmer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

#### POST /api/auth/login
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### GET /api/auth/me
Get current user profile (protected route).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Farmer",
    "email": "john@example.com",
    "location": "Punjab",
    "role": "farmer"
  }
}
```

### Weather

#### GET /api/weather/city/:city
Get current weather by city name.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "temperature": 22,
    "humidity": 65,
    "rainfall": 5,
    "location": {
      "city": "Punjab",
      "country": "India",
      "latitude": 30.73,
      "longitude": 76.77
    },
    "timestamp": "2024-04-23T..."
  }
}
```

#### GET /api/weather/current
Get current weather by coordinates.

**Query Params:**
- `latitude` - Latitude
- `longitude` - Longitude

#### GET /api/weather/forecast
Get weather forecast.

**Query Params:**
- `latitude` - Latitude
- `longitude` - Longitude
- `days` - Number of days (default: 7)

### Market Prices

#### GET /api/market-prices
Get all market prices with optional filters.

**Query Params:**
- `crop` - Filter by crop name (e.g., `?crop=Wheat`)
- `location` - Filter by mandi location (e.g., `?location=Punjab`)
- `search` - Search by crop name or location (e.g., `?search=Wheat`)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "cropName": "Wheat",
      "price": 2100,
      "location": "Punjab Mandi",
      "timestamp": "2024-04-23T06:00:00.000Z"
    }
  ],
  "count": 5,
  "message": "Market prices retrieved successfully"
}
```

#### POST /api/market-prices
Create a new market price record.

**Request Body:**
```json
{
  "cropName": "Rice",
  "price": 2800,
  "location": "Haryana Mandi"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "cropName": "Rice",
    "price": 2800,
    "location": "Haryana Mandi",
    "timestamp": "2024-04-23T06:00:00.000Z"
  },
  "message": "Market price record created successfully"
}
```

#### GET /api/market-prices/:id
Get a specific market price by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "cropName": "Wheat",
    "price": 2100,
    "location": "Punjab Mandi",
    "timestamp": "..."
  }
}
```

#### PUT /api/market-prices/:id
Update a market price record.

**Request Body:**
```json
{
  "price": 2200
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "cropName": "Wheat",
    "price": 2200,
    "location": "Punjab Mandi",
    "timestamp": "..."
  },
  "message": "Market price updated successfully"
}
```

#### DELETE /api/market-prices/:id
Delete a market price record.

**Response (200):**
```json
{
  "success": true,
  "message": "Market price deleted successfully"
}
```

#### GET /api/market-prices/crop/:cropName/average
Get average price for a specific crop across all locations.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "cropName": "Wheat",
    "averagePrice": 2150,
    "minPrice": 2100,
    "maxPrice": 2200,
    "dataPoints": 3,
    "locations": ["Punjab Mandi", "Haryana Mandi", "UP Mandi"]
  }
}
```

### Soil Data Prediction

#### POST /api/soil/predict
Predict soil parameters (N, P, K, pH) based on location.

**Request Body:**
```json
{
  "state": "Karnataka",
  "district": "Belagavi",
  "taluk": "Athani"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "nitrogen": 120,
    "phosphorus": 60,
    "potassium": 180,
    "ph": 6.5,
    "source": "regional_data",
    "note": "Based on regional soil data for Karnataka"
  }
}
```

#### GET /api/soil/states
Get available states for soil data prediction.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "name": "Karnataka",
      "districts": ["Belagavi", "Dharwad", "Bangalore", "Mysore"]
    }
  ]
}
```

### Saved Locations & Reminders

#### POST /api/saved-locations
Save a location with soil data for 3-month reminder.

**Request Body:**
```json
{
  "state": "Karnataka",
  "district": "Belagavi",
  "taluk": "Athani",
  "soilData": {
    "nitrogen": 120,
    "phosphorus": 60,
    "potassium": 180,
    "ph": 6.5
  },
  "source": "regional_data"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "state": "Karnataka",
    "district": "Belagavi",
    "taluk": "Athani",
    "soilData": {...},
    "reminderDate": "2024-07-23T...",
    "isNotified": false
  },
  "message": "Location saved successfully"
}
```

#### GET /api/saved-locations
Get all saved locations for the authenticated user.

**Response (200):**
```json
{
  "success": true,
  "data": [...]
}
```

#### GET /api/saved-locations/reminders
Get upcoming reminders (locations due for notification).

**Response (200):**
```json
{
  "success": true,
  "data": [...]
}
```

#### DELETE /api/saved-locations/:id
Delete a saved location.

**Response (200):**
```json
{
  "success": true,
  "message": "Location deleted successfully"
}
```

#### POST /api/saved-locations/:id/notify
Mark a location as notified.

**Response (200):**
```json
{
  "success": true,
  "message": "Location marked as notified"
}
```

## Sample curl Requests

### Get Crop Recommendation
```bash
curl -X POST http://localhost:3000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 120,
    "phosphorus": 60,
    "potassium": 180,
    "ph": 6.5,
    "temperature": 22,
    "humidity": 65,
    "rainfall": 250
  }'
```

### Get All Market Prices
```bash
curl http://localhost:3000/api/market-prices
```

### Filter Market Prices by Crop
```bash
curl http://localhost:3000/api/market-prices?crop=Wheat
```

### Filter Market Prices by Location
```bash
curl http://localhost:3000/api/market-prices?location=Punjab
```

### Search Market Prices (Bonus Feature)
```bash
curl http://localhost:3000/api/market-prices?search=Wheat
```

### Create Market Price
```bash
curl -X POST http://localhost:3000/api/market-prices \
  -H "Content-Type: application/json" \
  -d '{
    "cropName": "Barley",
    "price": 1950,
    "location": "Rajasthan Mandi"
  }'
```

### Get Recommendation History
```bash
curl http://localhost:3000/api/recommendations/history?userId=user123
```

### Get Average Price by Crop
```bash
curl http://localhost:3000/api/market-prices/crop/Wheat/average
```

## Error Handling

The application uses centralized error handling with standardized responses:

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Invalid pH value. Must be a number between 0 and 14"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "error": "Resource not found",
  "timestamp": "2024-04-23T06:00:00.000Z",
  "path": "/api/market-prices/999"
}
```

**Service Error (500):**
```json
{
  "success": false,
  "error": "No market data found for crop: UnknownCrop",
  "timestamp": "2024-04-23T06:00:00.000Z",
  "path": "/api/market-prices?crop=UnknownCrop"
}
```

## Key Features

### 1. Clean Architecture
- Separation of concerns across layers
- Easy to test and maintain
- Ready for database integration
- Prepared for AI module integration

### 2. Input Validation
- pH validation (0-14 range) - Critical for agricultural accuracy
- Numeric range validation for all parameters
- Comprehensive error messages

### 3. Service Layer Pattern
- Business logic isolated from controllers
- Async/await patterns for future API integration
- Simulates Python AI module connection

### 4. DRY Principle
- Reusable validation utilities
- Shared calculation functions
- Consistent error handling

### 5. REST API Conventions
- Proper HTTP status codes
- Standardized response format
- RESTful resource endpoints

### 6. Bonus Features
- Search filter for market prices (by crop or location)
- Potential yield calculation based on soil/weather
- Average price statistics per crop
- Growing season recommendation (Kharif/Rabi/Zaid)
- Real-time weather data from Open-Meteo API
- ML-based crop recommendations with Python service
- JWT authentication for user management
- Modern React UI with Tailwind CSS

## Architecture Overview

```
┌─────────────────┐
│  React Frontend │
│   (Vite +       │
│   Tailwind)     │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│  Express API    │
│  (Node.js)      │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌──────┐  ┌──────────┐
│MongoDB│  │Python ML │
│      │  │Service   │
└──────┘  └──────────┘
    ↑           ↑
    │           │
    └───────────┘
  Open-Meteo API
```

## Features Implemented

### Backend (Node.js/Express)
- ✅ Clean architecture with layers (Routes, Controllers, Services, Models)
- ✅ MongoDB integration with Mongoose
- ✅ JWT authentication system
- ✅ Weather API integration (Open-Meteo)
- ✅ Python ML service integration for crop recommendations
- ✅ Input validation and error handling
- ✅ Request logging middleware
- ✅ Database seeding script

### ML Service (Python/Flask)
- ✅ Flask API for ML predictions
- ✅ Rule-based fallback when ML model unavailable
- ✅ Model training endpoint with scikit-learn
- ✅ Random Forest classifier
- ✅ Model persistence with joblib

### Frontend (React/Vite)
- ✅ Modern UI with Tailwind CSS
- ✅ Crop recommendation form
- ✅ Market price dashboard with filtering
- ✅ Weather information display
- ✅ Responsive design
- ✅ API integration with axios

## Future Enhancements

1. **Real-time Updates**: WebSocket for live market price updates
2. **Advanced ML Models**: XGBoost, TensorFlow for better predictions
3. **Image Analysis**: Disease detection from crop images
4. **Multi-language Support**: Kannada and other regional languages
5. **Mobile App**: React Native for mobile accessibility
6. **Price Prediction**: ML regression for future price trends
7. **Voice Assistant**: Speech-to-text for farmer accessibility
8. **Data Visualization**: Charts and graphs for better insights 
