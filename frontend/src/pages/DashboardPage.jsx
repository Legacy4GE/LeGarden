import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { profileApi } from '../api/client'
import FrostTips from '../components/FrostTips'
import MyGardenSection from '../components/MyGardenSection'
import PlantDetailModal from '../components/PlantDetailModal'

function useLiveClock(timezone) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone

  const date = now.toLocaleDateString('en-US', {
    timeZone: tz,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const time = now.toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const tzAbbr = now.toLocaleTimeString('en-US', {
    timeZone: tz,
    timeZoneName: 'short',
  }).split(' ').pop()

  return { date, time, tzAbbr }
}

export default function DashboardPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlantId, setSelectedPlantId] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await profileApi.get()
        if (res.data) setProfile(res.data)
      } catch {
        // No profile yet
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const hasZone = profile && profile.usda_zone
  const clock = useLiveClock(profile?.timezone)

  const quickActions = [
    {
      to: '/calendar',
      title: 'Calendar',
      description: 'Schedule and track garden events, planting dates, and seasonal tasks.',
      color: 'bg-emerald-600',
      hoverColor: 'hover:bg-emerald-700',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      to: '/plants',
      title: 'My Plants',
      description: 'Manage your garden inventory, track varieties, and organize plant locations.',
      color: 'bg-green-700',
      hoverColor: 'hover:bg-green-800',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5 0-6-3.5-6-9 0-3.5 2.5-6 6-6s6 2.5 6 6c0 5.5-4.5 9-6 9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12c0-2.5 1.5-4.5 3-5.5" />
        </svg>
      ),
    },
    {
      to: '/profile',
      title: 'My Profile',
      description: 'Set your USDA hardiness zone and location for personalized growing tips.',
      color: 'bg-amber-700',
      hoverColor: 'hover:bg-amber-800',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 md:p-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 rounded-2xl p-6 md:p-10 mb-6 md:mb-10 overflow-hidden shadow-xl">
        {/* Decorative background leaves */}
        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 opacity-10">
          <svg viewBox="0 0 200 200" fill="currentColor" className="text-white w-full h-full">
            <path d="M100 10 C140 30, 180 70, 170 120 C160 160, 120 190, 100 190 C80 190, 40 160, 30 120 C20 70, 60 30, 100 10Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-28 md:w-40 h-28 md:h-40 opacity-10 -translate-x-8 translate-y-8">
          <svg viewBox="0 0 200 200" fill="currentColor" className="text-white w-full h-full">
            <path d="M100 10 C140 30, 180 70, 170 120 C160 160, 120 190, 100 190 C80 190, 40 160, 30 120 C20 70, 60 30, 100 10Z" />
          </svg>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-green-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5 0-6-3.5-6-9 0-3.5 2.5-6 6-6s6 2.5 6 6c0 5.5-4.5 9-6 9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V9" />
            </svg>
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              {profile?.display_name
                ? `Welcome back, ${profile.display_name}`
                : 'Welcome to LeGarden'}
            </h1>
          </div>
          <p className="text-green-100 text-base md:text-lg max-w-xl">
            Your personal garden growth tracker. Plan plantings, track your garden through the seasons,
            and get frost-aware tips tailored to your growing zone.
          </p>
          <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-2">
            {hasZone && (
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-green-50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Zone {profile.usda_zone}
              </div>
            )}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-green-50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {clock.time} {clock.tzAbbr}
            </div>
          </div>
          <p className="text-green-200/70 text-sm mt-2">{clock.date}</p>
        </div>
      </div>

      {/* My Garden */}
      <MyGardenSection onSelectPlant={setSelectedPlantId} />

      {/* Quick Actions */}
      <div className="mb-6 md:mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`${action.color} ${action.hoverColor} text-white rounded-xl p-5 md:p-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-white/15 rounded-lg group-hover:bg-white/25 transition-colors">
                  {action.icon}
                </div>
                <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-1">{action.title}</h3>
              <p className="text-sm opacity-85 leading-relaxed">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Seasonal Summary Bar */}
      {hasZone && profile.last_frost_date && (
        <div className="bg-white rounded-xl shadow p-4 md:p-5 mb-6 md:mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Seasonal Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
              <svg className="w-6 h-6 text-blue-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Last Spring Frost</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{profile.last_frost_date}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-center">
              <svg className="w-6 h-6 text-amber-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
              </svg>
              <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">First Fall Frost</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{profile.first_frost_date}</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
              <svg className="w-6 h-6 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
              <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Growing Season</p>
              <p className="text-lg font-bold text-gray-800 mt-1">
                {profile.growing_season_days ? `${profile.growing_season_days} days` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Frost & Planting Tips */}
      <div className="mb-6 md:mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Frost & Planting Tips</h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
          </div>
        ) : (
          <FrostTips hasProfile={!!hasZone} />
        )}
      </div>

      {selectedPlantId && (
        <PlantDetailModal
          plantId={selectedPlantId}
          onClose={() => setSelectedPlantId(null)}
        />
      )}
    </div>
  )
}
