import React, { useState } from 'react'
import { Calculator, Leaf, Droplets, FlaskConical, Info, CheckCircle, AlertTriangle } from 'lucide-react'

function FertilizerCalculator() {
  const [formData, setFormData] = useState({
    crop: '',
    farmSize: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: ''
  })
  const [result, setResult] = useState(null)

  const cropRequirements = {
    'Rice': { n: 100, p: 50, k: 50, ph_range: [5.5, 6.5] },
    'Wheat': { n: 120, p: 60, k: 40, ph_range: [6.0, 7.0] },
    'Maize': { n: 150, p: 70, k: 60, ph_range: [5.8, 7.0] },
    'Cotton': { n: 80, p: 40, k: 40, ph_range: [6.0, 7.5] },
    'Sugarcane': { n: 200, p: 80, k: 120, ph_range: [6.5, 7.5] },
    'Soybean': { n: 20, p: 60, k: 30, ph_range: [6.0, 7.0] },
    'Groundnut': { n: 25, p: 50, k: 60, ph_range: [5.5, 7.0] },
    'Potato': { n: 180, p: 80, k: 100, ph_range: [5.0, 6.0] },
    'Tomato': { n: 150, p: 80, k: 200, ph_range: [6.0, 7.0] },
    'Onion': { n: 120, p: 60, k: 80, ph_range: [6.0, 7.0] }
  }

  const fertilizerTypes = {
    'Urea': { n: 46, p: 0, k: 0 },
    'DAP': { n: 18, p: 46, k: 0 },
    'MOP': { n: 0, p: 0, k: 60 },
    'NPK 10-26-26': { n: 10, p: 26, k: 26 },
    'NPK 19-19-19': { n: 19, p: 19, k: 19 },
    'SSP': { n: 0, p: 16, k: 0 },
    'Zinc Sulphate': { n: 0, p: 0, k: 0, zn: 21 }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculateFertilizer = (e) => {
    e.preventDefault()
    
    const crop = cropRequirements[formData.crop]
    if (!crop) return

    const farmSize = parseFloat(formData.farmSize) || 1
    const currentN = parseFloat(formData.nitrogen) || 0
    const currentP = parseFloat(formData.phosphorus) || 0
    const currentK = parseFloat(formData.potassium) || 0
    const currentPh = parseFloat(formData.ph) || 6.5

    // Calculate deficit per hectare
    const deficitN = Math.max(0, crop.n - currentN)
    const deficitP = Math.max(0, crop.p - currentP)
    const deficitK = Math.max(0, crop.k - currentK)

    // Calculate fertilizer requirements (simplified calculation)
    const urea = Math.round((deficitN / 46) * farmSize)
    const dap = Math.round((deficitP / 46) * farmSize)
    const mop = Math.round((deficitK / 60) * farmSize)

    // pH recommendation
    let phRecommendation = ''
    if (currentPh < crop.ph_range[0]) {
      phRecommendation = 'Apply lime to increase pH'
    } else if (currentPh > crop.ph_range[1]) {
      phRecommendation = 'Apply gypsum or sulfur to decrease pH'
    } else {
      phRecommendation = 'pH is optimal for this crop'
    }

    setResult({
      crop: formData.crop,
      farmSize,
      currentSoil: { n: currentN, p: currentP, k: currentK, ph: currentPh },
      required: { n: crop.n, p: crop.p, k: crop.k },
      deficit: { n: deficitN, p: deficitP, k: deficitK },
      fertilizers: { urea, dap, mop },
      phRecommendation,
      totalCost: calculateCost(urea, dap, mop)
    })
  }

  const calculateCost = (urea, dap, mop) => {
    // Approximate prices in INR per kg
    const prices = {
      urea: 266,
      dap: 1350,
      mop: 340
    }
    return (urea * prices.urea) + (dap * prices.dap) + (mop * prices.mop)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fertilizer Calculator</h1>
          <p className="text-gray-600 mt-1">Calculate optimal fertilizer requirements for your crops</p>
        </div>
        <div className="badge badge-success">
          <Calculator className="w-4 h-4 mr-1" />
          Smart Calculator
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-green-600" />
            Enter Details
          </h2>
          
          <form onSubmit={calculateFertilizer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Crop *
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Crop</option>
                {Object.keys(cropRequirements).map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Size (acres) *
              </label>
              <input
                type="number"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 5"
                required
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Current Soil Parameters (kg/ha)</p>
              
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="e.g., 150"
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
                    placeholder="e.g., 40"
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
                    placeholder="e.g., 100"
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
                    placeholder="e.g., 6.5"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Fertilizer</span>
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Fertilizer Recommendations
            </h2>

            <div className="space-y-6">
              {/* Nutrient Deficit */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                  Nutrient Deficit (per acre)
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-red-600">{result.deficit.n}</p>
                    <p className="text-xs text-gray-600">N (kg)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{result.deficit.p}</p>
                    <p className="text-xs text-gray-600">P (kg)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{result.deficit.k}</p>
                    <p className="text-xs text-gray-600">K (kg)</p>
                  </div>
                </div>
              </div>

              {/* Fertilizer Requirements */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <FlaskConical className="w-4 h-4 mr-2 text-green-600" />
                  Recommended Fertilizers (for {result.farmSize} acres)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Droplets className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Urea</p>
                        <p className="text-xs text-gray-500">46% N</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{result.fertilizers.urea} kg</p>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <Leaf className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">DAP</p>
                        <p className="text-xs text-gray-500">18% N, 46% P</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{result.fertilizers.dap} kg</p>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <FlaskConical className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">MOP</p>
                        <p className="text-xs text-gray-500">60% K</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{result.fertilizers.mop} kg</p>
                  </div>
                </div>
              </div>

              {/* pH Recommendation */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2 text-blue-600" />
                  pH Management
                </h3>
                <p className="text-gray-800">{result.phRecommendation}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Current pH: {result.currentSoil.ph} | Optimal range: {cropRequirements[result.crop].ph_range[0]} - {cropRequirements[result.crop].ph_range[1]}
                </p>
              </div>

              {/* Cost Estimate */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <Calculator className="w-4 h-4 mr-2 text-yellow-600" />
                  Estimated Cost
                </h3>
                <p className="text-3xl font-bold text-gray-800">₹{result.totalCost.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Approximate total cost</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-600" />
          How to Use This Calculator
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <div className="bg-green-100 p-2 rounded-lg mt-1">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <p>Select your crop from the dropdown menu</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-green-100 p-2 rounded-lg mt-1">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <p>Enter your farm size in acres</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-green-100 p-2 rounded-lg mt-1">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <p>Input current soil test results (optional)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FertilizerCalculator
