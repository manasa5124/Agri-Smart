import React, { useState } from 'react'
import { Calendar, Sun, CloudRain, Snowflake, Sprout, Wheat, Info, ChevronDown, ChevronUp } from 'lucide-react'

function CropCalendar() {
  const [selectedSeason, setSelectedSeason] = useState('all')
  const [expandedCrop, setExpandedCrop] = useState(null)

  const seasons = [
    { id: 'all', name: 'All Seasons', icon: Calendar, color: 'gray' },
    { id: 'kharif', name: 'Kharif (Monsoon)', icon: CloudRain, color: 'blue' },
    { id: 'rabi', name: 'Rabi (Winter)', icon: Snowflake, color: 'cyan' },
    { id: 'zaid', name: 'Zaid (Summer)', icon: Sun, color: 'orange' }
  ]

  const crops = [
    {
      name: 'Rice',
      seasons: ['kharif'],
      sowing: 'June-July',
      harvesting: 'November-December',
      duration: '120-150 days',
      water: 'High',
      soil: 'Clay loam',
      temperature: '20-35°C',
      rainfall: '100-150 cm',
      description: 'Rice is the staple food crop of India, grown extensively during the monsoon season.',
      tips: ['Ensure proper water management', 'Use balanced fertilizers', 'Monitor for pests and diseases']
    },
    {
      name: 'Wheat',
      seasons: ['rabi'],
      sowing: 'October-November',
      harvesting: 'April-May',
      duration: '110-130 days',
      water: 'Moderate',
      soil: 'Loam soil',
      temperature: '15-25°C',
      rainfall: '50-75 cm',
      description: 'Wheat is the main rabi crop, grown in winter season with irrigation support.',
      tips: ['Apply irrigation at critical stages', 'Use certified seeds', 'Control weeds timely']
    },
    {
      name: 'Maize',
      seasons: ['kharif', 'rabi'],
      sowing: 'June-July / January-February',
      harvesting: 'September-October / May-June',
      duration: '90-120 days',
      water: 'Moderate',
      soil: 'Well-drained loam',
      temperature: '20-30°C',
      rainfall: '60-100 cm',
      description: 'Maize is a versatile crop grown in both kharif and rabi seasons.',
      tips: ['Ensure proper spacing', 'Apply nitrogen in splits', 'Monitor for stem borer']
    },
    {
      name: 'Cotton',
      seasons: ['kharif'],
      sowing: 'April-May',
      harvesting: 'December-January',
      duration: '160-180 days',
      water: 'Moderate',
      soil: 'Black soil',
      temperature: '21-30°C',
      rainfall: '50-80 cm',
      description: 'Cotton is a major cash crop grown predominantly in kharif season.',
      tips: ['Use Bt cotton seeds', 'Follow proper spacing', 'Monitor for bollworm']
    },
    {
      name: 'Sugarcane',
      seasons: ['kharif', 'rabi', 'zaid'],
      sowing: 'October-March',
      harvesting: 'After 12-18 months',
      duration: '12-18 months',
      water: 'High',
      soil: 'Well-drained loam',
      temperature: '20-35°C',
      rainfall: '100-150 cm',
      description: 'Sugarcane is a perennial crop that can be grown throughout the year.',
      tips: ['Ensure adequate irrigation', 'Apply balanced fertilizers', 'Monitor for red rot']
    },
    {
      name: 'Soybean',
      seasons: ['kharif'],
      sowing: 'June-July',
      harvesting: 'October-November',
      duration: '90-110 days',
      water: 'Moderate',
      soil: 'Well-drained loam',
      temperature: '20-30°C',
      rainfall: '60-90 cm',
      description: 'Soybean is an important oilseed crop grown during kharif season.',
      tips: ['Inoculate seeds with rhizobium', 'Apply phosphorus adequately', 'Monitor for rust disease']
    },
    {
      name: 'Groundnut',
      seasons: ['kharif', 'rabi'],
      sowing: 'June-July / January-February',
      harvesting: 'September-October / May-June',
      duration: '90-120 days',
      water: 'Low to Moderate',
      soil: 'Sandy loam',
      temperature: '25-35°C',
      rainfall: '50-75 cm',
      description: 'Groundnut is an important oilseed and food crop.',
      tips: ['Ensure proper seed treatment', 'Apply gypsum at flowering', 'Harvest at proper maturity']
    },
    {
      name: 'Potato',
      seasons: ['rabi', 'zaid'],
      sowing: 'October-November / January-February',
      harvesting: 'December-January / March-April',
      duration: '90-110 days',
      water: 'Moderate',
      soil: 'Sandy loam',
      temperature: '15-25°C',
      rainfall: '50-75 cm',
      description: 'Potato is a major vegetable crop grown in rabi and zaid seasons.',
      tips: ['Use certified seed tubers', 'Ensure proper drainage', 'Monitor for late blight']
    },
    {
      name: 'Tomato',
      seasons: ['rabi', 'zaid'],
      sowing: 'September-October / January-February',
      harvesting: 'December-January / April-May',
      duration: '100-120 days',
      water: 'Moderate',
      soil: 'Well-drained loam',
      temperature: '20-30°C',
      rainfall: '50-75 cm',
      description: 'Tomato is a popular vegetable crop with high market demand.',
      tips: ['Use staking for support', 'Prune regularly', 'Monitor for fruit borer']
    },
    {
      name: 'Onion',
      seasons: ['rabi', 'kharif'],
      sowing: 'October-November / June-July',
      harvesting: 'January-February / September-October',
      duration: '120-150 days',
      water: 'Moderate',
      soil: 'Sandy loam',
      temperature: '15-25°C',
      rainfall: '50-75 cm',
      description: 'Onion is an important bulb crop with good storage life.',
      tips: ['Ensure proper curing', 'Store in well-ventilated area', 'Monitor for thrips']
    },
    {
      name: 'Mustard',
      seasons: ['rabi'],
      sowing: 'October-November',
      harvesting: 'February-March',
      duration: '100-120 days',
      water: 'Low',
      soil: 'Loam soil',
      temperature: '15-25°C',
      rainfall: '40-60 cm',
      description: 'Mustard is an important oilseed crop grown in rabi season.',
      tips: ['Use timely sowing', 'Apply nitrogen at sowing', 'Monitor for aphids']
    },
    {
      name: 'Chickpea',
      seasons: ['rabi'],
      sowing: 'October-November',
      harvesting: 'March-April',
      duration: '100-110 days',
      water: 'Low',
      soil: 'Well-drained loam',
      temperature: '15-25°C',
      rainfall: '40-60 cm',
      description: 'Chickpea is a major pulse crop grown in rabi season.',
      tips: ['Use treated seeds', 'Avoid waterlogging', 'Monitor for wilt disease']
    }
  ]

  const filteredCrops = selectedSeason === 'all' 
    ? crops 
    : crops.filter(crop => crop.seasons.includes(selectedSeason))

  const toggleExpand = (cropName) => {
    setExpandedCrop(expandedCrop === cropName ? null : cropName)
  }

  const getSeasonColor = (season) => {
    const colors = {
      kharif: 'blue',
      rabi: 'cyan',
      zaid: 'orange'
    }
    return colors[season] || 'gray'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Crop Calendar</h1>
          <p className="text-gray-600 mt-1">Seasonal guide for crop cultivation in India</p>
        </div>
        <div className="badge badge-success">
          <Calendar className="w-4 h-4 mr-1" />
          Seasonal Guide
        </div>
      </div>

      {/* Season Filter */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Season</h2>
        <div className="flex flex-wrap gap-3">
          {seasons.map((season) => {
            const Icon = season.icon
            return (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  selectedSeason === season.id
                    ? `bg-${season.color}-100 border-2 border-${season.color}-500 text-${season.color}-700 font-semibold`
                    : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{season.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Season Info */}
      {selectedSeason !== 'all' && (
        <div className="card p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {seasons.find(s => s.id === selectedSeason)?.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedSeason === 'kharif' && 'Kharif crops are sown at the beginning of the monsoon (June-July) and harvested in September-October. These crops require high rainfall.'}
                {selectedSeason === 'rabi' && 'Rabi crops are sown in winter (October-November) and harvested in spring (March-April). These crops require less water and are often irrigated.'}
                {selectedSeason === 'zaid' && 'Zaid crops are grown between the rabi and kharif seasons (March-June). These are short-duration crops that require irrigation.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <div key={crop.name} className="card overflow-hidden">
            <div 
              className="p-6 cursor-pointer"
              onClick={() => toggleExpand(crop.name)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Wheat className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{crop.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {crop.seasons.map(season => (
                        <span key={season} className={`badge badge-${getSeasonColor(season)}`}>
                          {season.charAt(0).toUpperCase() + season.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {expandedCrop === crop.name ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Sowing</p>
                  <p className="font-semibold text-gray-800">{crop.sowing}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Harvesting</p>
                  <p className="font-semibold text-gray-800">{crop.harvesting}</p>
                </div>
              </div>
            </div>

            {expandedCrop === crop.name && (
              <div className="border-t p-6 bg-gradient-to-br from-gray-50 to-white">
                <p className="text-gray-600 text-sm mb-4">{crop.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-semibold text-gray-800">{crop.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Water Need:</span>
                    <span className="font-semibold text-gray-800">{crop.water}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Soil Type:</span>
                    <span className="font-semibold text-gray-800">{crop.soil}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Temperature:</span>
                    <span className="font-semibold text-gray-800">{crop.temperature}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rainfall:</span>
                    <span className="font-semibold text-gray-800">{crop.rainfall}</span>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Sprout className="w-4 h-4 mr-2 text-green-600" />
                    Cultivation Tips
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {crop.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No crops found for this season</p>
        </div>
      )}
    </div>
  )
}

export default CropCalendar
