import { useState, useEffect } from 'react'
import { plantsApi } from '../api/client'

export default function PlantsPage() {
  const [plants, setPlants] = useState([])
  const [form, setForm] = useState({ name: '', species: '', variety: '', location: '', notes: '' })
  const [editing, setEditing] = useState(null)

  const fetchPlants = async () => {
    const res = await plantsApi.list()
    setPlants(res.data)
  }

  useEffect(() => {
    fetchPlants()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await plantsApi.update(editing, form)
      setEditing(null)
    } else {
      await plantsApi.create(form)
    }
    setForm({ name: '', species: '', variety: '', location: '', notes: '' })
    fetchPlants()
  }

  const handleEdit = (plant) => {
    setEditing(plant.id)
    setForm({
      name: plant.name,
      species: plant.species || '',
      variety: plant.variety || '',
      location: plant.location || '',
      notes: plant.notes || '',
    })
  }

  const handleDelete = async (id) => {
    await plantsApi.delete(id)
    fetchPlants()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-6">My Plants</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 md:p-6 mb-6 md:mb-8 space-y-4">
        <h2 className="font-semibold text-gray-800">
          {editing ? 'Edit Plant' : 'Add a Plant'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Plant name *"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Species"
            value={form.species}
            onChange={(e) => setForm({ ...form, species: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Variety"
            value={form.variety}
            onChange={(e) => setForm({ ...form, variety: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-5 py-3 md:px-4 md:py-2 bg-green-700 text-white rounded-lg text-base md:text-sm font-medium hover:bg-green-800"
          >
            {editing ? 'Update' : 'Add Plant'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setForm({ name: '', species: '', variety: '', location: '', notes: '' })
              }}
              className="px-5 py-3 md:px-4 md:py-2 text-gray-600 text-base md:text-sm hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plants.map((plant) => (
          <div key={plant.id} className="bg-white rounded-xl shadow p-4 md:p-5">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1 mr-2">
                <h3 className="font-semibold text-gray-900">{plant.name}</h3>
                {plant.species && (
                  <p className="text-sm text-gray-500 italic">{plant.species}</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleEdit(plant)}
                  className="text-sm px-3 py-2 md:text-xs md:px-2 md:py-1 text-green-700 hover:bg-green-50 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plant.id)}
                  className="text-sm px-3 py-2 md:text-xs md:px-2 md:py-1 text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            {plant.variety && <p className="text-sm text-gray-600 mt-1">Variety: {plant.variety}</p>}
            {plant.location && (
              <p className="text-sm text-gray-600">Location: {plant.location}</p>
            )}
            {plant.notes && <p className="text-sm text-gray-500 mt-2">{plant.notes}</p>}
          </div>
        ))}
        {plants.length === 0 && (
          <p className="text-gray-400 text-sm col-span-full text-center py-8">
            No plants yet. Add your first plant above!
          </p>
        )}
      </div>
    </div>
  )
}
