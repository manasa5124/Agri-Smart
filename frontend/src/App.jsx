import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import CropRecommendation from './components/CropRecommendation'
import MarketPrices from './components/MarketPrices'
import WeatherInfo from './components/WeatherInfo'
import SoilDataPrediction from './components/SoilDataPrediction'
import FertilizerCalculator from './components/FertilizerCalculator'
import CropCalendar from './components/CropCalendar'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check for existing user session on load
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setActiveTab('dashboard')
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setActiveTab('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setActiveTab('dashboard')
  }

  return (
    <div className="min-h-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'crop' && <CropRecommendation user={user} />}
        {activeTab === 'market' && <MarketPrices />}
        {activeTab === 'weather' && <WeatherInfo />}
        {activeTab === 'soil' && <SoilDataPrediction />}
        {activeTab === 'fertilizer' && <FertilizerCalculator />}
        {activeTab === 'calendar' && <CropCalendar />}
        {activeTab === 'login' && <Login onLogin={handleLogin} />}
        {activeTab === 'register' && <Register onRegister={handleRegister} />}
      </main>
    </div>
  )
}

export default App
