import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
      // Use fallback data silently
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

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Market Prices</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            name="crop"
            value={filter.crop}
            onChange={handleFilterChange}
            placeholder="Filter by crop..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <input
            type="text"
            name="location"
            value={filter.location}
            onChange={handleFilterChange}
            placeholder="Filter by location..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {info && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg">
          {info}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (₹/quintal)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prices.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No market data found
                  </td>
                </tr>
              ) : (
                prices.map((price) => (
                  <tr key={price._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{price.cropName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-semibold">₹{price.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{price.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(price.timestamp).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MarketPrices
