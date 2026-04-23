import React from 'react'

function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold">🌱 Agri-Smart</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('crop')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'crop'
                    ? 'bg-white text-primary-600 font-semibold'
                    : 'hover:bg-primary-700'
                }`}
              >
                Crop Recommendation
              </button>
              <button
                onClick={() => setActiveTab('market')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'market'
                    ? 'bg-white text-primary-600 font-semibold'
                    : 'hover:bg-primary-700'
                }`}
              >
                Market Prices
              </button>
              <button
                onClick={() => setActiveTab('weather')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'weather'
                    ? 'bg-white text-primary-600 font-semibold'
                    : 'hover:bg-primary-700'
                }`}
              >
                Weather
              </button>
              <button
                onClick={() => setActiveTab('soil')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'soil'
                    ? 'bg-white text-primary-600 font-semibold'
                    : 'hover:bg-primary-700'
                }`}
              >
                Soil Data
              </button>
            </div>
            
            <div className="border-l border-white/30 pl-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm">Welcome, {user.name}</span>
                  <button
                    onClick={onLogout}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'login'
                        ? 'bg-white text-primary-600 font-semibold'
                        : 'hover:bg-primary-700'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'register'
                        ? 'bg-white text-primary-600 font-semibold'
                        : 'hover:bg-primary-700'
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
