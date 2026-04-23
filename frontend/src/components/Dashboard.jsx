import React, { useState, useEffect } from 'react'
import { Sprout, TrendingUp, Cloud, Leaf, Bell, Calendar, Droplets, Thermometer, Wind } from 'lucide-react'

function Dashboard({ user }) {
  const [weather, setWeather] = useState(null)
  const [savedLocations, setSavedLocations] = useState([])

  useEffect(() => {
    // Fetch quick stats
    fetchSavedLocations()
    if (user) {
      // Use location, district, or state as fallback for weather
      const location = user.location || user.district || user.state
      if (location) {
        fetchWeather(location)
      }
    }
  }, [user])

  const fetchWeather = async (location) => {
    try {
      const response = await fetch(`/api/weather/city/${location}`)
      const data = await response.json()
      if (data.success) {
        setWeather(data.data)
      }
    } catch (error) {
      console.error('Error fetching weather:', error)
    }
  }

  const fetchSavedLocations = async () => {
    try {
      const response = await fetch('/api/saved-locations')
      const data = await response.json()
      if (data.success) {
        setSavedLocations(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching saved locations:', error)
    }
  }

  const upcomingReminders = savedLocations.filter(loc => {
    const reminderDate = new Date(loc.reminderDate)
    const daysUntil = Math.ceil((reminderDate - new Date()) / (1000 * 60 * 60 * 24))
    return daysUntil <= 7 && !loc.isNotified
  })

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">
          {user ? `Welcome back, ${user.name}! 👋` : 'Welcome to Agri-Smart!'}
        </h1>
        <p className="text-green-100 text-lg">
          {user?.primaryCrop ? `Growing ${user.primaryCrop} in ${user.district}, ${user.state}` : 'Your smart farming assistant'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">5</span>
          </div>
          <p className="text-gray-600 font-medium">Crop Recommendations</p>
          <p className="text-sm text-gray-500 mt-1">This season</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">12</span>
          </div>
          <p className="text-gray-600 font-medium">Market Updates</p>
          <p className="text-sm text-gray-500 mt-1">Tracked crops</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{upcomingReminders.length}</span>
          </div>
          <p className="text-gray-600 font-medium">Reminders</p>
          <p className="text-sm text-gray-500 mt-1">Upcoming this week</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Leaf className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{savedLocations.length}</span>
          </div>
          <p className="text-gray-600 font-medium">Saved Locations</p>
          <p className="text-sm text-gray-500 mt-1">Soil data tracked</p>
        </div>
      </div>

      {/* Weather & Reminders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Card */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Cloud className="w-5 h-5 mr-2 text-blue-500" />
              Current Weather
            </h2>
            {user && (user.location || user.district || user.state) && (
              <span className="badge badge-info">
                {user.location || user.district || user.state}
              </span>
            )}
          </div>
          
          {weather ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-800">{weather.temperature}°C</p>
                  <p className="text-gray-500">{weather.location?.city}, {weather.location?.country}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-2xl">
                  <Cloud className="w-12 h-12 text-blue-500" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-lg font-semibold text-gray-800">{weather.humidity}%</p>
                  <p className="text-xs text-gray-500">Humidity</p>
                </div>
                <div className="text-center">
                  <Thermometer className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                  <p className="text-lg font-semibold text-gray-800">{weather.temperature}°C</p>
                  <p className="text-xs text-gray-500">Temp</p>
                </div>
                <div className="text-center">
                  <Wind className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-lg font-semibold text-gray-800">{weather.rainfall}mm</p>
                  <p className="text-xs text-gray-500">Rainfall</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Cloud className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Weather data not available</p>
              <p className="text-sm">Add your location in profile</p>
            </div>
          )}
        </div>

        {/* Upcoming Reminders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-500" />
              Upcoming Reminders
            </h2>
            <span className="badge badge-warning">{upcomingReminders.length} due</span>
          </div>
          
          {upcomingReminders.length > 0 ? (
            <div className="space-y-3">
              {upcomingReminders.slice(0, 3).map((location) => {
                const reminderDate = new Date(location.reminderDate)
                const daysUntil = Math.ceil((reminderDate - new Date()) / (1000 * 60 * 60 * 24))
                
                return (
                  <div key={location._id} className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {location.state}, {location.district}
                        </p>
                        <p className="text-sm text-gray-600">
                          {location.soilData?.primaryCrop || 'Soil check'} reminder
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">{daysUntil}d</p>
                        <p className="text-xs text-gray-500">remaining</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No upcoming reminders</p>
              <p className="text-sm">Save locations to get reminders</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-green-500" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border-2 border-green-200">
            <Sprout className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-800">Get Crop Recommendation</p>
              <p className="text-sm text-gray-600">Based on your soil data</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border-2 border-blue-200">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-800">Check Market Prices</p>
              <p className="text-sm text-gray-600">Latest crop prices</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border-2 border-purple-200">
            <Leaf className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-800">Analyze Soil Data</p>
              <p className="text-sm text-gray-600">Predict soil parameters</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
