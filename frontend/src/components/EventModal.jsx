import { useState, useEffect } from 'react'

const EVENT_TYPES = ['water', 'fertilize', 'prune', 'harvest', 'plant', 'inspect', 'other']

export default function EventModal({ event, plants, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_type: 'water',
    start_time: '',
    end_time: '',
    plant_id: '',
  })

  useEffect(() => {
    if (event?.id) {
      setForm({
        title: event.title || '',
        description: event.description || '',
        event_type: event.event_type || 'water',
        start_time: event.start_time?.slice(0, 16) || '',
        end_time: event.end_time?.slice(0, 16) || '',
        plant_id: event.plant_id || '',
      })
    } else if (event?.start_time) {
      setForm((f) => ({ ...f, start_time: event.start_time.slice(0, 16) }))
    }
  }, [event])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      plant_id: form.plant_id || null,
      end_time: form.end_time || null,
    }
    onSave(payload, event?.id)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl md:rounded-xl shadow-xl w-full max-h-[90vh] md:max-h-none md:max-w-md md:mx-4 p-5 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {event?.id ? 'Edit Event' : 'New Event'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 md:hidden"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={form.event_type}
            onChange={(e) => setForm({ ...form, event_type: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={form.plant_id}
            onChange={(e) => setForm({ ...form, plant_id: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">No specific plant</option>
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            required
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="datetime-local"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Notes (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
          />
          <div className="flex flex-col-reverse md:flex-row gap-2 md:justify-end pt-2">
            {event?.id && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="w-full md:w-auto px-4 py-3 md:py-2 text-base md:text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-auto px-4 py-3 md:py-2 text-base md:text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full md:w-auto px-4 py-3 md:py-2 text-base md:text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
