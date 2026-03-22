import { useState, useEffect } from 'react'
import { tipsApi } from '../api/client'

const urgencyStyles = {
  overdue: {
    border: 'border-l-rose-600',
    bg: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-800',
    label: 'Overdue',
  },
  urgent: {
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    badge: 'bg-red-100 text-red-800',
    label: 'Urgent',
  },
  upcoming: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-800',
    label: 'Upcoming',
  },
  later: {
    border: 'border-l-green-500',
    bg: 'bg-green-50',
    badge: 'bg-green-100 text-green-800',
    label: 'Later',
  },
}

export default function FrostTips({ hasProfile }) {
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!hasProfile) {
      setLoading(false)
      return
    }
    const fetchTips = async () => {
      try {
        const res = await tipsApi.list()
        setTips(res.data.tips || [])
      } catch (err) {
        setError('Unable to load frost tips.')
      } finally {
        setLoading(false)
      }
    }
    fetchTips()
  }, [hasProfile])

  if (!hasProfile) {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">
          <svg className="w-12 h-12 mx-auto text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-stone-700 mb-1">Set Your Growing Zone</h3>
        <p className="text-sm text-stone-500">
          Configure your USDA hardiness zone in your profile to get personalized frost and planting tips.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  if (tips.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <svg className="w-10 h-10 mx-auto text-green-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-green-800 mb-1">All Clear</h3>
        <p className="text-sm text-green-600">No frost or planting tips at this time. Your garden is in good shape!</p>
      </div>
    )
  }

  const grouped = { overdue: [], urgent: [], upcoming: [], later: [] }
  tips.forEach((tip) => {
    const key = tip.urgency || 'later'
    if (grouped[key]) {
      grouped[key].push(tip)
    } else {
      grouped.later.push(tip)
    }
  })

  return (
    <div className="space-y-6">
      {['overdue', 'urgent', 'upcoming', 'later'].map((urgency) => {
        const items = grouped[urgency]
        if (items.length === 0) return null
        const style = urgencyStyles[urgency]

        return (
          <div key={urgency}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${style.badge}`}>
                {style.label}
              </span>
              <span className="text-xs text-gray-400">{items.length} tip{items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((tip, idx) => (
                <div
                  key={idx}
                  className={`border-l-4 ${style.border} ${style.bg} rounded-lg p-4 shadow-sm`}
                >
                  <h4 className="font-bold text-gray-900 text-sm">{tip.plant_name}</h4>
                  <p className="text-sm text-gray-700 mt-1">{tip.action}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>{tip.action_date}</span>
                    <span className="font-medium">
                      {tip.days_until != null
                        ? tip.days_until === 0
                          ? 'Today'
                          : tip.days_until < 0
                            ? `${Math.abs(tip.days_until)} days ago`
                            : tip.days_until === 1
                              ? 'Tomorrow'
                              : `${tip.days_until} days away`
                        : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
