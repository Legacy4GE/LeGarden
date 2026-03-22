import { useState, useEffect } from 'react'
import { profileApi, zonesApi } from '../api/client'

const USDA_ZONES = [
  '1a','1b','2a','2b','3a','3b','4a','4b','5a','5b',
  '6a','6b','7a','7b','8a','8b','9a','9b','10a','10b',
  '11a','11b','12a','12b','13a','13b',
]

export default function ProfilePage() {
  const [form, setForm] = useState({ display_name: '', usda_zone: '', zip_code: '', timezone: '' })
  const [zones, setZones] = useState([])
  const [timezones, setTimezones] = useState([])
  const [hasProfile, setHasProfile] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, zonesRes, tzRes] = await Promise.allSettled([
          profileApi.get(),
          zonesApi.list(),
          zonesApi.timezones(),
        ])

        if (zonesRes.status === 'fulfilled') {
          setZones(zonesRes.value.data)
        }

        if (tzRes.status === 'fulfilled') {
          setTimezones(tzRes.value.data)
        }

        if (profileRes.status === 'fulfilled' && profileRes.value.data) {
          const p = profileRes.value.data
          setForm({
            display_name: p.display_name || '',
            usda_zone: p.usda_zone || '',
            zip_code: p.zip_code || '',
            timezone: p.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          })
          setHasProfile(true)
        } else {
          // Default to browser timezone
          setForm((f) => ({ ...f, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }))
        }
      } catch {
        // Profile may not exist yet
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const selectedZoneInfo = zones.find((z) => z.zone === form.usda_zone)

  // Live preview of selected timezone
  const tzPreview = form.timezone
    ? new Date().toLocaleString('en-US', {
        timeZone: form.timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      if (hasProfile) {
        await profileApi.update(form)
      } else {
        await profileApi.create(form)
        setHasProfile(true)
      }
      setFeedback({ type: 'success', message: 'Profile saved successfully!' })
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to save profile. Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 md:p-6">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
      <p className="text-gray-500 text-sm mb-6 md:mb-8">
        Set your growing zone and timezone to receive personalized frost and planting tips.
      </p>

      {feedback && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 md:p-6 space-y-5 md:space-y-6">
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            id="display_name"
            type="text"
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            placeholder="Your garden name"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="usda_zone" className="block text-sm font-medium text-gray-700 mb-1">
            USDA Hardiness Zone
          </label>
          <select
            id="usda_zone"
            value={form.usda_zone}
            onChange={(e) => setForm({ ...form, usda_zone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Select your zone...</option>
            {USDA_ZONES.map((zone) => (
              <option key={zone} value={zone}>
                Zone {zone}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
            Time Zone
          </label>
          <select
            id="timezone"
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Select your timezone...</option>
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          {tzPreview && (
            <p className="text-xs text-gray-500 mt-1.5">
              Current time: {tzPreview}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="zip_code"
            type="text"
            value={form.zip_code}
            onChange={(e) => setForm({ ...form, zip_code: e.target.value })}
            placeholder="e.g. 90210"
            maxLength={10}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {selectedZoneInfo && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              Zone {selectedZoneInfo.zone} Frost Dates
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-600 font-medium">Last Spring Frost</span>
                <p className="text-gray-700">{selectedZoneInfo.last_spring_frost || 'N/A'}</p>
              </div>
              <div>
                <span className="text-green-600 font-medium">First Fall Frost</span>
                <p className="text-gray-700">{selectedZoneInfo.first_fall_frost || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full px-4 py-3 md:py-2.5 bg-green-700 text-white rounded-lg text-base md:text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : hasProfile ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  )
}
