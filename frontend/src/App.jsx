import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import CropRecommendation from './components/CropRecommendation'
import MarketPrices from './components/MarketPrices'
import WeatherInfo from './components/WeatherInfo'
import SoilDataPrediction from './components/SoilDataPrediction'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const [activeTab, setActiveTab] = useState('crop')
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
    setActiveTab('crop')
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setActiveTab('crop')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setActiveTab('crop')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'crop' && <CropRecommendation user={user} />}
        {activeTab === 'market' && <MarketPrices />}
        {activeTab === 'weather' && <WeatherInfo />}
        {activeTab === 'soil' && <SoilDataPrediction />}
        {activeTab === 'login' && <Login onLogin={handleLogin} />}
        {activeTab === 'register' && <Register onRegister={handleRegister} />}
      </main>
    </div>
  )
}

export default App
