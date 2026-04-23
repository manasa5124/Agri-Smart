import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Fallback states data in case backend is not available
const fallbackStates = [
  { name: 'Karnataka', districts: ['Belagavi', 'Dharwad', 'Bangalore', 'Mysore', 'Mandya', 'Tumkur', 'Hassan', 'Shivamogga', 'Chikmagalur', 'Udupi'] },
  { name: 'Punjab', districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Firozpur', 'Bathinda'] },
  { name: 'Haryana', districts: ['Karnal', 'Panipat', 'Sonipat', 'Hisar', 'Rohtak'] },
  { name: 'Maharashtra', districts: ['Pune', 'Nagpur', 'Mumbai', 'Nashik', 'Aurangabad'] },
  { name: 'Madhya Pradesh', districts: ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur'] },
  { name: 'Rajasthan', districts: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'] },
  { name: 'Tamil Nadu', districts: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy'] },
  { name: 'Andhra Pradesh', districts: ['Hyderabad', 'Vijayawada', 'Visakhapatnam'] },
  { name: 'Gujarat', districts: ['Ahmedabad', 'Surat', 'Vadodara'] },
  { name: 'Uttar Pradesh', districts: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'] }
]

function SoilDataPrediction() {
  const [states, setStates] = useState(fallbackStates)
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    taluk: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [savedLocations, setSavedLocations] = useState([])
  const [saving, setSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    fetchStates()
    fetchSavedLocations()
  }, [])

  const fetchStates = async () => {
    try {
      const response = await axios.get('/api/soil/states')
      setStates(response.data.data)
    } catch (error) {
      console.error('Error fetching states:', error)
      // Use fallback data silently
      setStates(fallbackStates)
    }
  }

  const fetchSavedLocations = async () => {
    try {
      const response = await axios.get('/api/saved-locations')
      setSavedLocations(response.data.data || [])
    } catch (error) {
      console.error('Error fetching saved locations:', error)
    }
  }

  const handleSaveLocation = async () => {
    if (!result) return
    
    setSaving(true)
    try {
      const locationData = {
        state: formData.state,
        district: formData.district,
        taluk: formData.taluk,
        soilData: {
          nitrogen: result.nitrogen,
          phosphorus: result.phosphorus,
          potassium: result.potassium,
          ph: result.ph
        },
        source: result.source
      }
      
      await axios.post('/api/saved-locations', locationData)
      await fetchSavedLocations()
      alert('Location saved successfully! You will be reminded in 3 months.')
    } catch (error) {
      console.error('Error saving location:', error)
      alert('Failed to save location. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLocation = async (id) => {
    try {
      await axios.delete(`/api/saved-locations/${id}`)
      await fetchSavedLocations()
    } catch (error) {
      console.error('Error deleting location:', error)
      alert('Failed to delete location. Please try again.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value }
      
      // Reset district when state changes
      if (name === 'state') {
        newFormData.district = ''
        newFormData.taluk = ''
      }
      // Reset taluk when district changes
      if (name === 'district') {
        newFormData.taluk = ''
      }
      
      return newFormData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')
    setResult(null)

    try {
      const response = await axios.post('/api/soil/predict', formData)
      setResult(response.data.data)
    } catch (err) {
      // Fallback to local prediction if backend is unavailable
      console.log('Backend unavailable, using local prediction:', err.message)
      const localResult = predictLocally(formData)
      setResult(localResult)
      setInfo('Backend server unavailable. Using local prediction data.')
    } finally {
      setLoading(false)
    }
  }

  const predictLocally = (data) => {
    const stateLower = data.state?.toLowerCase().trim()
    const districtLower = data.district?.toLowerCase().trim()
    
    // Find state data from fallback
    const stateData = fallbackStates.find(s => s.name.toLowerCase() === stateLower)
    
    if (!stateData) {
      return {
        nitrogen: 150,
        phosphorus: 40,
        potassium: 100,
        ph: 6.5,
        source: 'default',
        note: 'Regional data not available. Using default values.'
      }
    }

    // District-specific data (simplified mapping)
    const districtData = {
      'karnataka': {
        'belagavi': { nitrogen: 200, phosphorus: 50, potassium: 140, ph: 6.8 },
        'dharwad': { nitrogen: 190, phosphorus: 48, potassium: 130, ph: 6.6 },
        'bangalore': { nitrogen: 170, phosphorus: 42, potassium: 110, ph: 6.4 },
        'mysore': { nitrogen: 185, phosphorus: 46, potassium: 125, ph: 6.7 },
        'mandya': { nitrogen: 195, phosphorus: 52, potassium: 135, ph: 6.9 },
        'tumkur': { nitrogen: 175, phosphorus: 44, potassium: 115, ph: 6.3 },
        'hassan': { nitrogen: 188, phosphorus: 47, potassium: 128, ph: 6.5 },
        'shivamogga': { nitrogen: 182, phosphorus: 45, potassium: 122, ph: 6.6 },
        'chikmagalur': { nitrogen: 210, phosphorus: 55, potassium: 150, ph: 7.0 },
        'udupi': { nitrogen: 205, phosphorus: 53, potassium: 145, ph: 6.9 }
      },
      'punjab': {
        'ludhiana': { nitrogen: 240, phosphorus: 70, potassium: 200, ph: 7.4 },
        'amritsar': { nitrogen: 235, phosphorus: 68, potassium: 195, ph: 7.3 },
        'jalandhar': { nitrogen: 230, phosphorus: 67, potassium: 190, ph: 7.2 },
        'firozpur': { nitrogen: 225, phosphorus: 66, potassium: 185, ph: 7.1 },
        'bathinda': { nitrogen: 215, phosphorus: 62, potassium: 175, ph: 7.0 }
      },
      'haryana': {
        'karnal': { nitrogen: 230, phosphorus: 65, potassium: 190, ph: 7.3 },
        'panipat': { nitrogen: 225, phosphorus: 63, potassium: 185, ph: 7.2 },
        'sonipat': { nitrogen: 220, phosphorus: 62, potassium: 180, ph: 7.1 },
        'hisar': { nitrogen: 200, phosphorus: 58, potassium: 165, ph: 6.9 },
        'rohtak': { nitrogen: 215, phosphorus: 61, potassium: 175, ph: 7.0 }
      },
      'maharashtra': {
        'pune': { nitrogen: 175, phosphorus: 45, potassium: 115, ph: 6.5 },
        'nagpur': { nitrogen: 165, phosphorus: 42, potassium: 105, ph: 6.3 },
        'mumbai': { nitrogen: 155, phosphorus: 38, potassium: 95, ph: 6.0 },
        'nashik': { nitrogen: 170, phosphorus: 44, potassium: 110, ph: 6.4 },
        'aurangabad': { nitrogen: 158, phosphorus: 40, potassium: 98, ph: 6.1 }
      },
      'madhya pradesh': {
        'indore': { nitrogen: 190, phosphorus: 52, potassium: 140, ph: 6.8 },
        'bhopal': { nitrogen: 185, phosphorus: 50, potassium: 135, ph: 6.7 },
        'gwalior': { nitrogen: 180, phosphorus: 49, potassium: 130, ph: 6.6 },
        'jabalpur': { nitrogen: 178, phosphorus: 48, potassium: 128, ph: 6.5 }
      },
      'rajasthan': {
        'jaipur': { nitrogen: 155, phosphorus: 40, potassium: 100, ph: 7.8 },
        'jodhpur': { nitrogen: 130, phosphorus: 32, potassium: 75, ph: 7.6 },
        'udaipur': { nitrogen: 145, phosphorus: 37, potassium: 90, ph: 7.4 },
        'kota': { nitrogen: 150, phosphorus: 38, potassium: 95, ph: 7.5 }
      },
      'tamil nadu': {
        'chennai': { nitrogen: 155, phosphorus: 38, potassium: 100, ph: 6.0 },
        'coimbatore': { nitrogen: 175, phosphorus: 45, potassium: 120, ph: 6.5 },
        'madurai': { nitrogen: 170, phosphorus: 44, potassium: 115, ph: 6.4 },
        'trichy': { nitrogen: 168, phosphorus: 43, potassium: 112, ph: 6.3 }
      },
      'andhra pradesh': {
        'hyderabad': { nitrogen: 180, phosphorus: 48, potassium: 125, ph: 6.6 },
        'vijayawada': { nitrogen: 175, phosphorus: 46, potassium: 120, ph: 6.5 },
        'visakhapatnam': { nitrogen: 172, phosphorus: 45, potassium: 118, ph: 6.4 }
      },
      'gujarat': {
        'ahmedabad': { nitrogen: 165, phosphorus: 42, potassium: 110, ph: 7.2 },
        'surat': { nitrogen: 160, phosphorus: 40, potassium: 105, ph: 7.1 },
        'vadodara': { nitrogen: 158, phosphorus: 39, potassium: 102, ph: 7.0 }
      },
      'uttar pradesh': {
        'lucknow': { nitrogen: 205, phosphorus: 60, potassium: 160, ph: 7.2 },
        'kanpur': { nitrogen: 200, phosphorus: 58, potassium: 155, ph: 7.1 },
        'agra': { nitrogen: 195, phosphorus: 56, potassium: 150, ph: 7.0 },
        'varanasi': { nitrogen: 198, phosphorus: 57, potassium: 152, ph: 7.1 }
      }
    }

    const stateDefaults = {
      'karnataka': { nitrogen: 180, phosphorus: 45, potassium: 120, ph: 6.5 },
      'punjab': { nitrogen: 220, phosphorus: 65, potassium: 180, ph: 7.2 },
      'haryana': { nitrogen: 210, phosphorus: 60, potassium: 170, ph: 7.1 },
      'maharashtra': { nitrogen: 160, phosphorus: 40, potassium: 100, ph: 6.2 },
      'madhya pradesh': { nitrogen: 175, phosphorus: 48, potassium: 125, ph: 6.6 },
      'rajasthan': { nitrogen: 140, phosphorus: 35, potassium: 85, ph: 7.5 },
      'tamil nadu': { nitrogen: 165, phosphorus: 42, potassium: 110, ph: 6.3 },
      'andhra pradesh': { nitrogen: 170, phosphorus: 45, potassium: 115, ph: 6.4 },
      'gujarat': { nitrogen: 150, phosphorus: 38, potassium: 95, ph: 7.0 },
      'uttar pradesh': { nitrogen: 190, phosphorus: 55, potassium: 145, ph: 7.0 }
    }

    if (districtLower && districtData[stateLower] && districtData[stateLower][districtLower]) {
      return {
        ...districtData[stateLower][districtLower],
        source: 'district',
        note: `Soil data estimated for ${data.district} district, ${data.state}`
      }
    }

    return {
      ...stateDefaults[stateLower],
      source: 'state',
      note: data.district 
        ? `District-specific data not available for ${data.district}. Using state average for ${data.state}.`
        : `Soil data estimated for ${data.state} state.`
    }
  }

  const handleUseForRecommendation = () => {
    if (result) {
      // Store in localStorage for crop recommendation component
      localStorage.setItem('soilData', JSON.stringify({
        nitrogen: result.nitrogen,
        phosphorus: result.phosphorus,
        potassium: result.potassium,
        ph: result.ph
      }))
      alert('Soil data saved! Navigate to Crop Recommendation to use this data.')
    }
  }

  const selectedStateData = states.find(s => s.name.toLowerCase() === formData.state.toLowerCase())

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Soil Data Prediction</h1>
        <button
          onClick={() => setShowSaved(!showSaved)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {showSaved ? 'Hide Saved' : 'View Saved'}
        </button>
      </div>
      
      {showSaved && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Saved Locations</h2>
          {savedLocations.length === 0 ? (
            <p className="text-gray-500">No saved locations yet.</p>
          ) : (
            <div className="space-y-4">
              {savedLocations.map((location) => {
                const reminderDate = new Date(location.reminderDate)
                const daysUntilReminder = Math.ceil((reminderDate - new Date()) / (1000 * 60 * 60 * 24))
                const isUrgent = daysUntilReminder <= 7
                
                return (
                  <div key={location._id} className={`p-4 border rounded-lg ${isUrgent ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {location.state}
                          {location.district && `, ${location.district}`}
                          {location.taluk && `, ${location.taluk}`}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          N: {location.soilData.nitrogen}, P: {location.soilData.phosphorus}, K: {location.soilData.potassium}, pH: {location.soilData.ph}
                        </p>
                        <p className={`text-sm mt-2 ${isUrgent ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
                          {isUrgent ? '⚠️ ' : '📅 '}Reminder in {daysUntilReminder} days ({reminderDate.toLocaleDateString()})
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteLocation(location._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Enter Location Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              State *
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {selectedStateData && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                District (Optional)
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select District</option>
                {selectedStateData.districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.district && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Taluk (Optional)
              </label>
              <input
                type="text"
                name="taluk"
                value={formData.taluk}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter taluk name"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Predicting...' : 'Predict Soil Data'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {info && (
          <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
            {info}
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-primary-600 mb-4">
            Predicted Soil Data
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Nitrogen (N)</h3>
              <p className="text-2xl font-bold text-blue-600">{result.nitrogen}</p>
              <p className="text-xs text-gray-500">kg/ha</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Phosphorus (P)</h3>
              <p className="text-2xl font-bold text-green-600">{result.phosphorus}</p>
              <p className="text-xs text-gray-500">kg/ha</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Potassium (K)</h3>
              <p className="text-2xl font-bold text-orange-600">{result.potassium}</p>
              <p className="text-xs text-gray-500">kg/ha</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-gray-700 mb-2">pH Level</h3>
              <p className="text-2xl font-bold text-purple-600">{result.ph}</p>
              <p className="text-xs text-gray-500">0-14 scale</p>
            </div>
          </div>

          <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Data Source</h3>
            <p className="text-gray-600 capitalize">{result.source}</p>
            <p className="text-sm text-gray-500 mt-1">{result.note}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSaveLocation}
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : '🔔 Save Location (3-month reminder)'}
            </button>
            <button
              onClick={handleUseForRecommendation}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Use for Crop Recommendation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SoilDataPrediction
