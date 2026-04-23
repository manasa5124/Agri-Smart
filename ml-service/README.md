# Agri-Smart ML Service

Python Flask service for ML-based crop recommendations using scikit-learn.

## Installation

```bash
cd ml-service
pip install -r requirements.txt
```

## Running the Service

```bash
python app.py
```

The service runs on port 5001 by default.

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "Agri-Smart ML Service",
  "model_loaded": true
}
```

### POST /predict
Predict crop based on soil and weather data.

**Request Body:**
```json
{
  "soil": {
    "nitrogen": 120,
    "phosphorus": 60,
    "potassium": 180,
    "ph": 6.5
  },
  "weather": {
    "temperature": 22,
    "humidity": 65,
    "rainfall": 250
  }
}
```

**Response:**
```json
{
  "recommended_crop": "Wheat",
  "confidence": 90,
  "input_data": {
    "soil": {...},
    "weather": {...}
  }
}
```

### POST /train
Train the ML model with provided data.

**Request Body:**
```json
{
  "data": [
    {
      "nitrogen": 120,
      "phosphorus": 60,
      "potassium": 180,
      "ph": 6.5,
      "temperature": 22,
      "humidity": 65,
      "rainfall": 250,
      "crop": "Wheat"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Model trained successfully",
  "samples": 100,
  "classes": ["Wheat", "Rice", "Maize", ...]
}
```

## Features

- **Rule-based prediction**: Works without training data
- **ML model training**: Train Random Forest classifier with custom data
- **Model persistence**: Saves trained model to disk
- **CORS enabled**: Can be called from frontend
- **Error handling**: Comprehensive error responses

## Model Training Data Format

The training data should include:
- **Soil parameters**: nitrogen, phosphorus, potassium, pH
- **Weather parameters**: temperature, humidity, rainfall
- **Crop label**: The crop name (target variable)

## Future Enhancements

- Add more sophisticated ML models (XGBoost, Neural Networks)
- Include image-based disease detection
- Add model versioning
- Implement A/B testing for model versions
