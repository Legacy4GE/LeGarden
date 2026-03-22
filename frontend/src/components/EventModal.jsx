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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {event?.id ? 'Edit Event' : 'New Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={form.event_type}
            onChange={(e) => setForm({ ...form, event_type: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="datetime-local"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Notes (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
          />
          <div className="flex gap-2 justify-end pt-2">
            {event?.id && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
