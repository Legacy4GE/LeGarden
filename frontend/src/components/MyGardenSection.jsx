import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { plantsApi } from '../api/client'

const statusStyles = {
  planted: 'bg-blue-100 text-blue-800',
  growing: 'bg-green-100 text-green-800',
  harvesting: 'bg-amber-100 text-amber-800',
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

function growthProgress(datePlanted, expectedHarvest) {
  if (!datePlanted || !expectedHarvest) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const planted = new Date(datePlanted + 'T00:00:00')
  planted.setHours(0, 0, 0, 0)
  const harvest = new Date(expectedHarvest + 'T00:00:00')
  harvest.setHours(0, 0, 0, 0)
  const total = harvest - planted
  if (total <= 0) return 100
  const elapsed = today - planted
  const pct = Math.round((elapsed / total) * 100)
  return Math.max(0, Math.min(100, pct))
}

export default function MyGardenSection({ onSelectPlant }) {
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await plantsApi.listActive()
        setPlants(res.data.plants || res.data || [])
      } catch (err) {
        setError('Unable to load garden plants.')
      } finally {
        setLoading(false)
      }
    }
    fetchPlants()
  }, [])

  if (loading) {
    return (
      <div className="mb-6 md:mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5 0-6-3.5-6-9 0-3.5 2.5-6 6-6s6 2.5 6 6c0 5.5-4.5 9-6 9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V9" />
          </svg>
          My Garden
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-6 md:mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5 0-6-3.5-6-9 0-3.5 2.5-6 6-6s6 2.5 6 6c0 5.5-4.5 9-6 9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V9" />
          </svg>
          My Garden
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 md:mb-10">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5 0-6-3.5-6-9 0-3.5 2.5-6 6-6s6 2.5 6 6c0 5.5-4.5 9-6 9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V9" />
        </svg>
        My Garden
      </h2>

      {plants.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <svg className="w-10 h-10 mx-auto text-green-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5 0-6-3.5-6-9 0-3.5 2.5-6 6-6s6 2.5 6 6c0 5.5-4.5 9-6 9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V9" />
          </svg>
          <h3 className="text-lg font-semibold text-green-800 mb-1">No Plants Yet</h3>
          <p className="text-sm text-green-600">
            No plants in your garden yet. Add some from{' '}
            <Link to="/plants" className="underline font-medium hover:text-green-800">
              My Plants
            </Link>
            !
          </p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 md:overflow-visible md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => {
            const remaining = daysUntil(plant.expected_harvest_date)
            const progress = growthProgress(plant.date_planted, plant.expected_harvest_date)
            const status = plant.status || 'planted'
            const badgeClass = statusStyles[status] || statusStyles.planted

            return (
              <div
                key={plant.id}
                onClick={() => onSelectPlant(plant.id)}
                className="min-w-[260px] md:min-w-0 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer p-4 md:p-5 flex flex-col gap-3"
              >
                {/* Top row: name + badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">
                      {plant.name}
                    </h3>
                    {plant.variety && (
                      <p className="text-xs md:text-sm italic text-gray-500 truncate">
                        {plant.variety}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeClass}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                {/* Date planted */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Planted {formatDate(plant.date_planted)}
                </div>

                {/* Harvest countdown */}
                <div className="text-xs font-medium">
                  {remaining === null ? (
                    <span className="text-gray-400">No harvest date set</span>
                  ) : remaining <= 0 ? (
                    <span className="text-amber-600">Ready to harvest!</span>
                  ) : (
                    <span className="text-green-700">
                      Harvest in {remaining} day{remaining !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Growth</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
