import React from 'react'
import { Sprout, TrendingUp, Cloud, Leaf, LogIn, UserPlus, LogOut, User, LayoutDashboard, Calculator, Calendar } from 'lucide-react'

function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crop', label: 'Crop Recommendation', icon: Sprout },
    { id: 'market', label: 'Market Prices', icon: TrendingUp },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'soil', label: 'Soil Data', icon: Leaf },
    { id: 'fertilizer', label: 'Fertilizer Calculator', icon: Calculator },
    { id: 'calendar', label: 'Crop Calendar', icon: Calendar },
  ]

  return (
    <nav className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Agri-Smart</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-white text-green-600 font-semibold shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              )
            })}
            
            <div className="border-l border-white/30 pl-4 ml-2">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      activeTab === 'login'
                        ? 'bg-white text-green-600 font-semibold shadow-lg'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      activeTab === 'register'
                        ? 'bg-white text-green-600 font-semibold shadow-lg'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Register</span>
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
