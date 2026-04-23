"""
Python ML Service for Crop Recommendation
Flask API that uses scikit-learn for ML-based crop recommendations
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app)

# Crop labels
CROPS = [
    'Wheat', 'Rice', 'Maize', 'Cotton', 'Soybean', 
    'Chickpea', 'Potato', 'Sugarcane', 'Tea', 'Barley',
    'Mustard', 'Gram'
]

def load_or_create_model():
    """
    Load trained model or create a simple rule-based model for demonstration
    In production, this would load a trained scikit-learn model
    """
    model_path = os.path.join(os.path.dirname(__file__), 'crop_model.pkl')
    
    if os.path.exists(model_path):
        return joblib.load(model_path)
    else:
        # Create a simple rule-based model for demonstration
        # In production, train with actual agricultural data
        return None

def predict_crop_rule_based(soil_data, weather_data):
    """
    Rule-based crop prediction (demonstration)
    In production, replace with actual ML model prediction
    """
    n = soil_data['nitrogen']
    p = soil_data['phosphorus']
    k = soil_data['potassium']
    ph = soil_data['ph']
    temp = weather_data['temperature']
    humidity = weather_data['humidity']
    rainfall = weather_data['rainfall']
    
    # Decision tree logic
    if ph >= 6.0 and ph <= 7.5:
        if rainfall > 500 and temp > 25:
            return 'Rice', 85
        elif rainfall < 300 and temp >= 15 and temp <= 25:
            if n > 100:
                return 'Wheat', 90
            else:
                return 'Chickpea', 75
        elif temp > 30:
            return 'Maize', 80
        else:
            return 'Soybean', 78
    elif ph < 5.5:
        if rainfall > 400 and temp > 25:
            return 'Tea', 82
        else:
            return 'Potato', 70
    else:
        if rainfall < 400 and temp >= 20 and temp <= 30:
            return 'Cotton', 85
        else:
            return 'Sugarcane', 75

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Agri-Smart ML Service',
        'model_loaded': load_or_create_model() is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict crop based on soil and weather data
    Expected JSON body:
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
    """
    try:
        data = request.get_json()
        
        if not data or 'soil' not in data or 'weather' not in data:
            return jsonify({
                'error': 'Missing required fields: soil and weather data'
            }), 400
        
        soil_data = data['soil']
        weather_data = data['weather']
        
        # Validate required fields
        required_soil = ['nitrogen', 'phosphorus', 'potassium', 'ph']
        required_weather = ['temperature', 'humidity', 'rainfall']
        
        for field in required_soil:
            if field not in soil_data:
                return jsonify({'error': f'Missing soil field: {field}'}), 400
        
        for field in required_weather:
            if field not in weather_data:
                return jsonify({'error': f'Missing weather field: {field}'}), 400
        
        # Get prediction
        model = load_or_create_model()
        
        if model:
            # Use ML model (if trained model exists)
            features = [
                soil_data['nitrogen'],
                soil_data['phosphorus'],
                soil_data['potassium'],
                soil_data['ph'],
                weather_data['temperature'],
                weather_data['humidity'],
                weather_data['rainfall']
            ]
            features_array = np.array([features])
            prediction = model.predict(features_array)[0]
            confidence = 0.85  # Placeholder for model confidence
        else:
            # Use rule-based prediction
            prediction, confidence = predict_crop_rule_based(soil_data, weather_data)
        
        return jsonify({
            'recommended_crop': prediction,
            'confidence': confidence,
            'input_data': {
                'soil': soil_data,
                'weather': weather_data
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/train', methods=['POST'])
def train():
    """
    Train the ML model with provided data
    Expected JSON body:
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
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'data' not in data:
            return jsonify({'error': 'Missing training data'}), 400
        
        training_data = data['data']
        
        # Extract features and labels
        features = []
        labels = []
        
        for item in training_data:
            features.append([
                item['nitrogen'],
                item['phosphorus'],
                item['potassium'],
                item['ph'],
                item['temperature'],
                item['humidity'],
                item['rainfall']
            ])
            labels.append(item['crop'])
        
        # Convert to numpy arrays
        X = np.array(features)
        y = np.array(labels)
        
        # Train a simple Random Forest classifier
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import LabelEncoder
        
        # Encode labels
        label_encoder = LabelEncoder()
        y_encoded = label_encoder.fit_transform(y)
        
        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y_encoded)
        
        # Save model
        model_path = os.path.join(os.path.dirname(__file__), 'crop_model.pkl')
        joblib.dump({
            'model': model,
            'label_encoder': label_encoder
        }, model_path)
        
        return jsonify({
            'message': 'Model trained successfully',
            'samples': len(training_data),
            'classes': list(label_encoder.classes_)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('ML_SERVICE_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
