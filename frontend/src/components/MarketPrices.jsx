import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, Search, MapPin, Wheat, IndianRupee, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// Fallback market data in case backend is not available
const fallbackMarketData = [
  { _id: '1', cropName: 'Wheat', price: 2100, location: 'Punjab Mandi', timestamp: new Date().toISOString() },
  { _id: '2', cropName: 'Rice', price: 2800, location: 'Punjab Mandi', timestamp: new Date().toISOString() },
  { _id: '3', cropName: 'Wheat', price: 2200, location: 'Haryana Mandi', timestamp: new Date().toISOString() },
  { _id: '4', cropName: 'Rice', price: 2900, location: 'Haryana Mandi', timestamp: new Date().toISOString() },
  { _id: '5', cropName: 'Wheat', price: 2300, location: 'Karnataka Mandi', timestamp: new Date().toISOString() },
  { _id: '6', cropName: 'Rice', price: 2700, location: 'Karnataka Mandi', timestamp: new Date().toISOString() },
  { _id: '7', cropName: 'Maize', price: 1800, location: 'Maharashtra Mandi', timestamp: new Date().toISOString() },
  { _id: '8', cropName: 'Cotton', price: 6500, location: 'Gujarat Mandi', timestamp: new Date().toISOString() },
  { _id: '9', cropName: 'Soybean', price: 4500, location: 'Madhya Pradesh Mandi', timestamp: new Date().toISOString() },
  { _id: '10', cropName: 'Sugarcane', price: 300, location: 'Uttar Pradesh Mandi', timestamp: new Date().toISOString() }
]

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1']

function MarketPrices() {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ crop: '', location: '' })
  const [info, setInfo] = useState('')

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const params = {}
      if (filter.crop) params.crop = filter.crop
      if (filter.location) params.location = filter.location

      const response = await axios.get('/api/market-prices', { params })
      setPrices(response.data.data)
    } catch (error) {
      console.error('Error fetching market prices:', error)
      setPrices(fallbackMarketData)
      setInfo('Backend server unavailable. Using sample market data.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPrices()
  }

  // Prepare chart data - average price by crop
  const chartData = prices.reduce((acc, item) => {
    const existing = acc.find(d => d.crop === item.cropName)
    if (existing) {
      existing.totalPrice += item.price
      existing.count += 1
    } else {
      acc.push({ crop: item.cropName, totalPrice: item.price, count: 1 })
    }
    return acc
  }, []).map(item => ({
    crop: item.crop,
    avgPrice: Math.round(item.totalPrice / item.count)
  }))

  // Get price change indicator (mock)
  const getPriceChange = (price) => {
    const change = (Math.random() - 0.5) * 10
    return { change, isUp: change >= 0 }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Market Prices</h1>
          <p className="text-gray-600 mt-1">Real-time crop prices from mandis across India</p>
        </div>
        <div className="badge badge-info">
          <TrendingUp className="w-4 h-4 mr-1" />
          Live Updates
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Wheat className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-semibold">+2.5%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b.price, 0) / prices.length) : 0}</p>
          <p className="text-gray-600 font-medium">Average Price</p>
          <p className="text-sm text-gray-500 mt-1">Per quintal</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{new Set(prices.map(p => p.location)).size}</p>
          <p className="text-gray-600 font-medium">Mandis</p>
          <p className="text-sm text-gray-500 mt-1">Across India</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <IndianRupee className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{new Set(prices.map(p => p.cropName)).size}</p>
          <p className="text-gray-600 font-medium">Crops Tracked</p>
          <p className="text-sm text-gray-500 mt-1">Real-time data</p>
        </div>
      </div>

      {/* Price Chart */}
      {chartData.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Average Price by Crop
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="crop" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`₹${value}`, 'Avg Price']}
              />
              <Bar dataKey="avgPrice" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Search Filter */}
      <div className="card p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="crop"
              value={filter.crop}
              onChange={handleFilterChange}
              placeholder="Filter by crop..."
              className="input-field pl-10"
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="location"
              value={filter.location}
              onChange={handleFilterChange}
              placeholder="Filter by location..."
              className="input-field pl-10"
            />
          </div>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {info && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          {info}
        </div>
      )}

      {/* Price Table */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading market prices...</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Crop
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price (₹/quintal)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {prices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No market data found</p>
                  </td>
                </tr>
              ) : (
                prices.map((price) => {
                  const { change, isUp } = getPriceChange(price.price)
                  return (
                    <tr key={price._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-lg mr-3">
                            <Wheat className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{price.cropName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-gray-900">₹{price.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {price.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {new Date(price.timestamp).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                          {isUp ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                          <span className="text-sm font-semibold">{Math.abs(change).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MarketPrices
