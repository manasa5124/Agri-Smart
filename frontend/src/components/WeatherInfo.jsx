import React, { useState } from 'react'
import axios from 'axios'
import { Cloud, Search, Thermometer, Droplets, Wind, MapPin, Calendar, AlertCircle, Sun, CloudRain } from 'lucide-react'

// Fallback weather data for common Indian cities
const fallbackWeatherData = {
  'bangalore': {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    location: { city: 'Bangalore', country: 'India', latitude: 12.9716, longitude: 77.5946 },
    timestamp: new Date().toISOString()
  },
  'bengaluru': {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    location: { city: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946 },
    timestamp: new Date().toISOString()
  },
  'mumbai': {
    temperature: 32,
    humidity: 75,
    rainfall: 2,
    location: { city: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 },
    timestamp: new Date().toISOString()
  },
  'delhi': {
    temperature: 35,
    humidity: 45,
    rainfall: 0,
    location: { city: 'Delhi', country: 'India', latitude: 28.7041, longitude: 77.1025 },
    timestamp: new Date().toISOString()
  },
  'chennai': {
    temperature: 34,
    humidity: 70,
    rainfall: 5,
    location: { city: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707 },
    timestamp: new Date().toISOString()
  },
  'kolkata': {
    temperature: 33,
    humidity: 68,
    rainfall: 3,
    location: { city: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639 },
    timestamp: new Date().toISOString()
  },
  'hyderabad': {
    temperature: 36,
    humidity: 55,
    rainfall: 0,
    location: { city: 'Hyderabad', country: 'India', latitude: 17.3850, longitude: 78.4867 },
    timestamp: new Date().toISOString()
  },
  'pune': {
    temperature: 30,
    humidity: 60,
    rainfall: 1,
    location: { city: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567 },
    timestamp: new Date().toISOString()
  },
  'ahmedabad': {
    temperature: 38,
    humidity: 40,
    rainfall: 0,
    location: { city: 'Ahmedabad', country: 'India', latitude: 23.0225, longitude: 72.5714 },
    timestamp: new Date().toISOString()
  },
  'jaipur': {
    temperature: 40,
    humidity: 35,
    rainfall: 0,
    location: { city: 'Jaipur', country: 'India', latitude: 26.9124, longitude: 75.7873 },
    timestamp: new Date().toISOString()
  },
  'lucknow': {
    temperature: 37,
    humidity: 50,
    rainfall: 0,
    location: { city: 'Lucknow', country: 'India', latitude: 26.8467, longitude: 80.9462 },
    timestamp: new Date().toISOString()
  },
  'kanpur': {
    temperature: 36,
    humidity: 48,
    rainfall: 0,
    location: { city: 'Kanpur', country: 'India', latitude: 26.4499, longitude: 80.3319 },
    timestamp: new Date().toISOString()
  },
  'surat': {
    temperature: 34,
    humidity: 72,
    rainfall: 1,
    location: { city: 'Surat', country: 'India', latitude: 21.1702, longitude: 72.8311 },
    timestamp: new Date().toISOString()
  },
  'nagpur': {
    temperature: 35,
    humidity: 52,
    rainfall: 0,
    location: { city: 'Nagpur', country: 'India', latitude: 21.1458, longitude: 79.0882 },
    timestamp: new Date().toISOString()
  },
  'indore': {
    temperature: 33,
    humidity: 55,
    rainfall: 0,
    location: { city: 'Indore', country: 'India', latitude: 22.7196, longitude: 75.8577 },
    timestamp: new Date().toISOString()
  },
  'bhopal': {
    temperature: 34,
    humidity: 53,
    rainfall: 0,
    location: { city: 'Bhopal', country: 'India', latitude: 23.2599, longitude: 77.4126 },
    timestamp: new Date().toISOString()
  },
  'patna': {
    temperature: 36,
    humidity: 60,
    rainfall: 2,
    location: { city: 'Patna', country: 'India', latitude: 25.5941, longitude: 85.1376 },
    timestamp: new Date().toISOString()
  },
  'ranchi': {
    temperature: 32,
    humidity: 62,
    rainfall: 1,
    location: { city: 'Ranchi', country: 'India', latitude: 23.3441, longitude: 85.3096 },
    timestamp: new Date().toISOString()
  },
  'guwahati': {
    temperature: 30,
    humidity: 75,
    rainfall: 4,
    location: { city: 'Guwahati', country: 'India', latitude: 26.1445, longitude: 91.7362 },
    timestamp: new Date().toISOString()
  },
  'chandigarh': {
    temperature: 34,
    humidity: 42,
    rainfall: 0,
    location: { city: 'Chandigarh', country: 'India', latitude: 30.7333, longitude: 76.7794 },
    timestamp: new Date().toISOString()
  },
  'coimbatore': {
    temperature: 29,
    humidity: 68,
    rainfall: 2,
    location: { city: 'Coimbatore', country: 'India', latitude: 11.0168, longitude: 76.9558 },
    timestamp: new Date().toISOString()
  },
  'mysore': {
    temperature: 27,
    humidity: 62,
    rainfall: 0,
    location: { city: 'Mysore', country: 'India', latitude: 12.2958, longitude: 76.6394 },
    timestamp: new Date().toISOString()
  },
  'belagavi': {
    temperature: 26,
    humidity: 70,
    rainfall: 1,
    location: { city: 'Belagavi', country: 'India', latitude: 15.8609, longitude: 74.5059 },
    timestamp: new Date().toISOString()
  },
  'hubli': {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    location: { city: 'Hubli', country: 'India', latitude: 15.3647, longitude: 75.1240 },
    timestamp: new Date().toISOString()
  },
  'dharwad': {
    temperature: 27,
    humidity: 66,
    rainfall: 0,
    location: { city: 'Dharwad', country: 'India', latitude: 15.4594, longitude: 75.0078 },
    timestamp: new Date().toISOString()
  },
  'mangalore': {
    temperature: 29,
    humidity: 78,
    rainfall: 3,
    location: { city: 'Mangalore', country: 'India', latitude: 12.8744, longitude: 74.8496 },
    timestamp: new Date().toISOString()
  },
  'mangaluru': {
    temperature: 29,
    humidity: 78,
    rainfall: 3,
    location: { city: 'Mangaluru', country: 'India', latitude: 12.8744, longitude: 74.8496 },
    timestamp: new Date().toISOString()
  },
  'shivamogga': {
    temperature: 26,
    humidity: 68,
    rainfall: 1,
    location: { city: 'Shivamogga', country: 'India', latitude: 13.9285, longitude: 75.5695 },
    timestamp: new Date().toISOString()
  },
  'tumkur': {
    temperature: 28,
    humidity: 60,
    rainfall: 0,
    location: { city: 'Tumkur', country: 'India', latitude: 13.3391, longitude: 77.1138 },
    timestamp: new Date().toISOString()
  },
  'mandya': {
    temperature: 27,
    humidity: 64,
    rainfall: 0,
    location: { city: 'Mandya', country: 'India', latitude: 12.5415, longitude: 76.8953 },
    timestamp: new Date().toISOString()
  },
  'hassan': {
    temperature: 25,
    humidity: 70,
    rainfall: 1,
    location: { city: 'Hassan', country: 'India', latitude: 13.0068, longitude: 76.0979 },
    timestamp: new Date().toISOString()
  },
  'chikmagalur': {
    temperature: 24,
    humidity: 75,
    rainfall: 2,
    location: { city: 'Chikmagalur', country: 'India', latitude: 13.3181, longitude: 75.7709 },
    timestamp: new Date().toISOString()
  },
  'udupi': {
    temperature: 28,
    humidity: 76,
    rainfall: 2,
    location: { city: 'Udupi', country: 'India', latitude: 13.3409, longitude: 74.7421 },
    timestamp: new Date().toISOString()
  },
  'davanagere': {
    temperature: 30,
    humidity: 55,
    rainfall: 0,
    location: { city: 'Davanagere', country: 'India', latitude: 14.4636, longitude: 75.9250 },
    timestamp: new Date().toISOString()
  },
  'bellary': {
    temperature: 33,
    humidity: 45,
    rainfall: 0,
    location: { city: 'Bellary', country: 'India', latitude: 15.1394, longitude: 76.9212 },
    timestamp: new Date().toISOString()
  },
  'raichur': {
    temperature: 34,
    humidity: 42,
    rainfall: 0,
    location: { city: 'Raichur', country: 'India', latitude: 16.2076, longitude: 77.3463 },
    timestamp: new Date().toISOString()
  },
  'gulbarga': {
    temperature: 35,
    humidity: 40,
    rainfall: 0,
    location: { city: 'Gulbarga', country: 'India', latitude: 17.3297, longitude: 76.8343 },
    timestamp: new Date().toISOString()
  },
  'kalaburagi': {
    temperature: 35,
    humidity: 40,
    rainfall: 0,
    location: { city: 'Kalaburagi', country: 'India', latitude: 17.3297, longitude: 76.8343 },
    timestamp: new Date().toISOString()
  },
  'bidar': {
    temperature: 33,
    humidity: 44,
    rainfall: 0,
    location: { city: 'Bidar', country: 'India', latitude: 17.9139, longitude: 77.5199 },
    timestamp: new Date().toISOString()
  },
  'bijapur': {
    temperature: 34,
    humidity: 43,
    rainfall: 0,
    location: { city: 'Bijapur', country: 'India', latitude: 16.8302, longitude: 75.7059 },
    timestamp: new Date().toISOString()
  },
  'vijayapura': {
    temperature: 34,
    humidity: 43,
    rainfall: 0,
    location: { city: 'Vijayapura', country: 'India', latitude: 16.8302, longitude: 75.7059 },
    timestamp: new Date().toISOString()
  },
  'bagalkot': {
    temperature: 32,
    humidity: 48,
    rainfall: 0,
    location: { city: 'Bagalkot', country: 'India', latitude: 16.1858, longitude: 75.6912 },
    timestamp: new Date().toISOString()
  },
  'gadag': {
    temperature: 31,
    humidity: 50,
    rainfall: 0,
    location: { city: 'Gadag', country: 'India', latitude: 15.4277, longitude: 75.6295 },
    timestamp: new Date().toISOString()
  },
  'haveri': {
    temperature: 29,
    humidity: 58,
    rainfall: 0,
    location: { city: 'Haveri', country: 'India', latitude: 14.7980, longitude: 75.0134 },
    timestamp: new Date().toISOString()
  },
  'kolar': {
    temperature: 29,
    humidity: 56,
    rainfall: 0,
    location: { city: 'Kolar', country: 'India', latitude: 13.1339, longitude: 78.1329 },
    timestamp: new Date().toISOString()
  },
  'chickballapur': {
    temperature: 28,
    humidity: 58,
    rainfall: 0,
    location: { city: 'Chickballapur', country: 'India', latitude: 13.2169, longitude: 77.7352 },
    timestamp: new Date().toISOString()
  },
  'ramanagara': {
    temperature: 28,
    humidity: 59,
    rainfall: 0,
    location: { city: 'Ramanagara', country: 'India', latitude: 12.7149, longitude: 77.2719 },
    timestamp: new Date().toISOString()
  },
  'madikeri': {
    temperature: 23,
    humidity: 80,
    rainfall: 3,
    location: { city: 'Madikeri', country: 'India', latitude: 12.4238, longitude: 75.7390 },
    timestamp: new Date().toISOString()
  },
  'chamarajanagar': {
    temperature: 26,
    humidity: 72,
    rainfall: 1,
    location: { city: 'Chamarajanagar', country: 'India', latitude: 11.9216, longitude: 76.9446 },
    timestamp: new Date().toISOString()
  },
  'yadgir': {
    temperature: 35,
    humidity: 41,
    rainfall: 0,
    location: { city: 'Yadgir', country: 'India', latitude: 16.7701, longitude: 77.1371 },
    timestamp: new Date().toISOString()
  },
  'koppal': {
    temperature: 33,
    humidity: 46,
    rainfall: 0,
    location: { city: 'Koppal', country: 'India', latitude: 15.3525, longitude: 76.1518 },
    timestamp: new Date().toISOString()
  },
  'chitradurga': {
    temperature: 31,
    humidity: 52,
    rainfall: 0,
    location: { city: 'Chitradurga', country: 'India', latitude: 14.2295, longitude: 76.3984 },
    timestamp: new Date().toISOString()
  },
  'vijayanagara': {
    temperature: 32,
    humidity: 48,
    rainfall: 0,
    location: { city: 'Vijayanagara', country: 'India', latitude: 15.3192, longitude: 76.4602 },
    timestamp: new Date().toISOString()
  }
}

function WeatherInfo() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!city) return

    setLoading(true)
    setError('')
    setInfo('')
    setWeather(null)

    try {
      const response = await axios.get(`/api/weather/city/${city}`)
      setWeather(response.data.data)
    } catch (err) {
      console.error('Error fetching weather:', err)
      const cityLower = city.toLowerCase().trim()
      const fallbackData = fallbackWeatherData[cityLower]
      
      if (fallbackData) {
        setWeather(fallbackData)
        setInfo('Backend server unavailable. Using sample weather data.')
      } else {
        setError('Failed to fetch weather data. City not found in sample data.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (temp, rainfall) => {
    if (rainfall > 0) return CloudRain
    if (temp > 30) return Sun
    return Cloud
  }

  const getWeatherCondition = (temp, rainfall) => {
    if (rainfall > 0) return 'Rainy'
    if (temp > 35) return 'Hot'
    if (temp > 30) return 'Warm'
    if (temp < 20) return 'Cool'
    return 'Pleasant'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Weather Information</h1>
          <p className="text-gray-600 mt-1">Real-time weather data for agricultural planning</p>
        </div>
        <div className="badge badge-info">
          <Cloud className="w-4 h-4 mr-1" />
          Live Data
        </div>
      </div>
      
      <div className="card p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name (e.g., Bangalore, Mumbai)..."
              className="input-field pl-10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>{loading ? 'Loading...' : 'Search'}</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {info && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            {info}
          </div>
        )}
      </div>

      {weather && (
        <div className="card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                {weather.location?.city}
              </h2>
              <p className="text-gray-600 mt-1">{weather.location?.country}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="badge badge-info">{getWeatherCondition(weather.temperature, weather.rainfall)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <Thermometer className="w-8 h-8 text-orange-500" />
                <span className="text-sm text-gray-600">Temperature</span>
              </div>
              <p className="text-4xl font-bold text-gray-800">{weather.temperature}°C</p>
              <p className="text-sm text-gray-600 mt-2">Feels like {Math.round(weather.temperature - 2)}°C</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <Droplets className="w-8 h-8 text-blue-500" />
                <span className="text-sm text-gray-600">Humidity</span>
              </div>
              <p className="text-4xl font-bold text-gray-800">{weather.humidity}%</p>
              <p className="text-sm text-gray-600 mt-2">Moderate level</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-200">
              <div className="flex items-center justify-between mb-4">
                <CloudRain className="w-8 h-8 text-cyan-500" />
                <span className="text-sm text-gray-600">Rainfall</span>
              </div>
              <p className="text-4xl font-bold text-gray-800">{weather.rainfall}mm</p>
              <p className="text-sm text-gray-600 mt-2">{weather.rainfall > 0 ? 'Rain expected' : 'No rain'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                Location Details
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-600">Latitude:</span>
                  <span className="font-semibold text-gray-800">{weather.location?.latitude}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Longitude:</span>
                  <span className="font-semibold text-gray-800">{weather.location?.longitude}</span>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-green-600" />
                Last Updated
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(weather.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">Real-time data</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherInfo
