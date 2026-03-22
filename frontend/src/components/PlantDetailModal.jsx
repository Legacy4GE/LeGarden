import { useState, useEffect } from 'react'
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

function addDays(dateStr, days) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function daysOverdue(startTimeStr) {
  if (!startTimeStr) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(startTimeStr)
  eventDate.setHours(0, 0, 0, 0)
  return Math.floor((today - eventDate) / (1000 * 60 * 60 * 24))
}

const eventTypeBadge = {
  water: 'bg-blue-100 text-blue-700',
  fertilize: 'bg-emerald-100 text-emerald-700',
  prune: 'bg-purple-100 text-purple-700',
  harvest: 'bg-amber-100 text-amber-700',
  plant: 'bg-green-100 text-green-700',
  inspect: 'bg-gray-100 text-gray-700',
  other: 'bg-stone-100 text-stone-700',
}

export default function PlantDetailModal({ plantId, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [markingComplete, setMarkingComplete] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await plantsApi.getDetail(plantId)
      setData(res.data)
    } catch (err) {
      setError('Unable to load plant details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [plantId])

  const handleMarkComplete = async (milestoneId) => {
    setMarkingComplete(milestoneId)
    try {
      await plantsApi.updateMilestone(plantId, milestoneId, {
        completed_date: new Date().toISOString().split('T')[0],
      })
      await fetchData()
    } catch (err) {
      // Silently handle - user can retry
    } finally {
      setMarkingComplete(null)
    }
  }

  const plant = data?.plant
  const milestones = data?.milestones || []
  const overdueEvents = data?.overdue_events || []

  // Determine which milestone is "current" (first uncompleted whose expected date <= today)
  const today = new Date().toISOString().split('T')[0]
  let currentMilestoneId = null
  if (plant) {
    for (const m of milestones) {
      if (m.completed_date) continue
      const expectedDate = addDays(plant.date_planted, m.days_from_planting)
      if (expectedDate && expectedDate <= today) {
        currentMilestoneId = m.id
        break
      }
    }
  }

  const progress = plant ? growthProgress(plant.date_planted, plant.expected_harvest_date) : 0
  const harvestDays = plant ? daysUntil(plant.expected_harvest_date) : null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-t-2xl md:rounded-xl shadow-xl w-full max-h-[90vh] md:max-w-lg md:mx-4 overflow-y-auto">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Error</h2>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-green-800 text-white p-5 md:p-6 md:rounded-t-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold truncate">{plant.name}</h2>
                  {plant.variety && (
                    <p className="text-green-200 italic text-sm mt-0.5 truncate">{plant.variety}</p>
                  )}
                  <span
                    className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      statusStyles[plant.status] || statusStyles.planted
                    }`}
                  >
                    {(plant.status || 'planted').charAt(0).toUpperCase() +
                      (plant.status || 'planted').slice(1)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-green-200 hover:bg-green-700 md:hidden"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="hidden md:flex shrink-0 w-10 h-10 items-center justify-center rounded-full text-green-200 hover:bg-green-700"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-6">
              {/* Info cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Planted</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">{formatDate(plant.date_planted)}</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                  <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Harvest</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {formatDate(plant.expected_harvest_date)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {harvestDays === null
                      ? ''
                      : harvestDays <= 0
                        ? 'Ready!'
                        : `${harvestDays} day${harvestDays !== 1 ? 's' : ''} left`}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Progress</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{progress}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Growth Timeline */}
              {milestones.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                    </svg>
                    Growth Timeline
                  </h3>
                  <div className="relative">
                    {milestones.map((milestone, idx) => {
                      const isCompleted = !!milestone.completed_date
                      const isCurrent = milestone.id === currentMilestoneId
                      const isFuture = !isCompleted && !isCurrent
                      const expectedDate = addDays(plant.date_planted, milestone.days_from_planting)
                      const isLast = idx === milestones.length - 1

                      return (
                        <div key={milestone.id} className="flex gap-3">
                          {/* Timeline dot and line */}
                          <div className="flex flex-col items-center">
                            {/* Dot */}
                            <div
                              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                                isCompleted
                                  ? 'bg-green-500 border-green-500'
                                  : isCurrent
                                    ? 'bg-amber-400 border-amber-400 animate-pulse'
                                    : 'bg-white border-gray-300'
                              }`}
                            >
                              {isCompleted ? (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              ) : isCurrent ? (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                              )}
                            </div>
                            {/* Connecting line */}
                            {!isLast && (
                              <div
                                className={`w-0.5 flex-1 min-h-[24px] ${
                                  isCompleted ? 'bg-green-300' : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className={`pb-5 flex-1 min-w-0 ${isLast ? '' : ''}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-gray-900">{milestone.name}</p>
                                {milestone.description && (
                                  <p className="text-xs text-gray-500 mt-0.5">{milestone.description}</p>
                                )}
                              </div>
                              {!isCompleted && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkComplete(milestone.id)}
                                  disabled={markingComplete === milestone.id}
                                  className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors disabled:opacity-50"
                                >
                                  {markingComplete === milestone.id ? (
                                    <span className="flex items-center gap-1">
                                      <div className="animate-spin rounded-full h-3 w-3 border-b border-green-700" />
                                      Saving
                                    </span>
                                  ) : (
                                    'Mark Complete'
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="mt-1.5">
                              {isCompleted ? (
                                <p className="text-xs text-green-600 font-medium">
                                  Completed {formatDate(milestone.completed_date)}
                                </p>
                              ) : isCurrent ? (
                                <p className="text-xs text-amber-600 font-medium">In Progress</p>
                              ) : (
                                <p className="text-xs text-gray-400">
                                  Expected {formatDate(expectedDate)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Overdue Tasks */}
              {overdueEvents.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    Overdue Tasks
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-semibold">
                      {overdueEvents.length}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {overdueEvents.map((event) => {
                      const overdueDays = daysOverdue(event.start_time)
                      const typeBadge =
                        eventTypeBadge[event.event_type] || eventTypeBadge.other
                      return (
                        <div
                          key={event.id}
                          className="flex items-center justify-between gap-2 bg-white rounded-lg p-3 border border-red-100"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {event.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeBadge}`}
                              >
                                {(event.event_type || 'other').charAt(0).toUpperCase() +
                                  (event.event_type || 'other').slice(1)}
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-red-600">
                            {overdueDays} day{overdueDays !== 1 ? 's' : ''} overdue
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
