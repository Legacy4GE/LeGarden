import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { tipsApi } from '../api/client'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/calendar', label: 'Calendar' },
  { path: '/plants', label: 'My Plants' },
  { path: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [overdueTips, setOverdueTips] = useState([])
  const [upcomingTips, setUpcomingTips] = useState([])
  const notifRef = useRef(null)

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await tipsApi.list()
        const tips = res.data.tips || []
        setOverdueTips(tips.filter((t) => t.urgency === 'overdue'))
        setUpcomingTips(tips.filter((t) => t.urgency === 'upcoming' || t.urgency === 'urgent'))
      } catch {
        // No profile or tips available
      }
    }
    fetchTips()
  }, [location.pathname])

  // Close notification panel on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [notifOpen])

  const totalAlerts = overdueTips.length + upcomingTips.length

  return (
    <nav className="bg-green-800 text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            LeGarden
          </Link>

          <div className="flex items-center gap-2">
            {/* Notifications bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative inline-flex items-center justify-center w-11 h-11 rounded-lg text-green-100 hover:bg-green-700/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
                aria-label={`Notifications: ${totalAlerts} alerts`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {totalAlerts > 0 && (
                  <span className={`absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white rounded-full ring-2 ring-green-800 ${overdueTips.length > 0 ? 'bg-red-500' : 'bg-amber-500'}`}>
                    {totalAlerts > 99 ? '99+' : totalAlerts}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="max-h-[28rem] overflow-y-auto">
                    {/* Overdue section */}
                    {overdueTips.length > 0 && (
                      <>
                        <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 sticky top-0 z-10">
                          <h3 className="text-sm font-bold text-red-800">
                            Overdue
                            <span className="ml-1.5 text-xs font-medium text-red-600">
                              ({overdueTips.length})
                            </span>
                          </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {overdueTips.map((tip, idx) => (
                            <div key={`o-${idx}`} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-gray-900">{tip.plant_name}</p>
                                  <p className="text-xs text-gray-600 mt-0.5">{tip.action}</p>
                                </div>
                                <span className="shrink-0 ml-3 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                  {Math.abs(tip.days_until)}d ago
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Upcoming section */}
                    {upcomingTips.length > 0 && (
                      <>
                        <div className="px-4 py-2.5 bg-amber-50 border-y border-amber-100 sticky top-0 z-10">
                          <h3 className="text-sm font-bold text-amber-800">
                            Upcoming
                            <span className="ml-1.5 text-xs font-medium text-amber-600">
                              ({upcomingTips.length})
                            </span>
                          </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {upcomingTips.map((tip, idx) => (
                            <div key={`u-${idx}`} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-gray-900">{tip.plant_name}</p>
                                  <p className="text-xs text-gray-600 mt-0.5">{tip.action}</p>
                                </div>
                                <span className="shrink-0 ml-3 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                  {tip.days_until === 0
                                    ? 'Today'
                                    : tip.days_until === 1
                                      ? 'Tomorrow'
                                      : `in ${tip.days_until}d`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Empty state */}
                    {overdueTips.length === 0 && upcomingTips.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <svg className="w-8 h-8 mx-auto text-green-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-500">All caught up! No alerts right now.</p>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                    <Link
                      to="/"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-medium text-green-700 hover:text-green-800"
                    >
                      View all tips on Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-green-700 text-white'
                      : 'text-green-100 hover:bg-green-700/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-green-100 hover:bg-green-700/50 focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-green-700">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-700 text-white'
                    : 'text-green-100 hover:bg-green-700/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
