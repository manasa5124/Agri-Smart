import React, { useState } from 'react'
import axios from 'axios'
import { Sprout, Thermometer, Droplets, Cloud, TrendingUp, Leaf, AlertCircle } from 'lucide-react'

function CropRecommendation({ user }) {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    temperature: '',
    humidity: '',
    rainfall: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.post('/api/recommend', formData)
      setResult(response.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get recommendation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Crop Recommendation</h1>
          <p className="text-gray-600 mt-1">Get AI-powered crop suggestions based on your soil and weather data</p>
        </div>
        {user?.primaryCrop && (
          <div className="badge badge-success">
            <Sprout className="w-4 h-4 mr-1" />
            Your Crop: {user.primaryCrop}
          </div>
        )}
      </div>
      
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Leaf className="w-5 h-5 mr-2 text-green-600" />
          Enter Soil & Weather Data
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Soil Data */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <Leaf className="w-4 h-4 mr-2 text-green-600" />
                Soil Parameters
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nitrogen (N)
                </label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phosphorus (P)
                </label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potassium (K)
                </label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  pH Level
                </label>
                <input
                  type="number"
                  name="ph"
                  step="0.1"
                  value={formData.ph}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0-14"
                  required
                />
              </div>
            </div>

            {/* Weather Data */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <Cloud className="w-4 h-4 mr-2 text-blue-600" />
                Weather Parameters
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <div className="relative">
                  <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="-20 to 60"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Humidity (%)
                </label>
                <div className="relative">
                  <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="0-100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rainfall (mm)
                </label>
                <div className="relative">
                  <Cloud className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="0-2000"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>{loading ? 'Analyzing...' : 'Get Recommendation'}</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Sprout className="w-6 h-6 mr-2 text-green-600" />
              Recommended: {result.recommendedCrop}
            </h2>
            <div className="badge badge-success">{result.confidence}% confidence</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                Confidence Score
              </h3>
              <div className="w-full bg-white rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
              <p className="text-lg font-bold text-green-600">{result.confidence}%</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <Leaf className="w-4 h-4 mr-2 text-blue-600" />
                Yield Prediction
              </h3>
              {result.yieldPrediction && (
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Yield Score:</span>
                    <span className="font-semibold text-gray-800">{result.yieldPrediction.yieldScore}/100</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Soil Health:</span>
                    <span className="font-semibold text-gray-800">{result.yieldPrediction.soilHealth}/100</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Season:</span>
                    <span className="font-semibold text-gray-800">{result.yieldPrediction.recommendedSeason}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Potential:</span>
                    <span className="font-semibold text-gray-800">{result.yieldPrediction.yieldPotential}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
              AI Reasoning
            </h3>
            <p className="text-gray-700">{result.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CropRecommendation
