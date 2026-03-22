import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { eventsApi, plantsApi } from '../api/client'
import EventModal from '../components/EventModal'

const TYPE_COLORS = {
  water: '#3b82f6',
  fertilize: '#a855f7',
  prune: '#f59e0b',
  harvest: '#22c55e',
  plant: '#10b981',
  inspect: '#6366f1',
  other: '#6b7280',
}

export default function CalendarPage() {
  const [events, setEvents] = useState([])
  const [plants, setPlants] = useState([])
  const [modalEvent, setModalEvent] = useState(null)

  const fetchData = async () => {
    const [evRes, plRes] = await Promise.all([eventsApi.list(), plantsApi.list()])
    setEvents(evRes.data)
    setPlants(plRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const calendarEvents = events.map((ev) => ({
    id: String(ev.id),
    title: ev.title,
    start: ev.start_time,
    end: ev.end_time,
    backgroundColor: TYPE_COLORS[ev.event_type] || TYPE_COLORS.other,
    borderColor: TYPE_COLORS[ev.event_type] || TYPE_COLORS.other,
    extendedProps: ev,
  }))

  const handleDateClick = (info) => {
    setModalEvent({ start_time: info.dateStr + 'T09:00' })
  }

  const handleEventClick = (info) => {
    setModalEvent(info.event.extendedProps)
  }

  const handleSave = async (data, id) => {
    if (id) {
      await eventsApi.update(id, data)
    } else {
      await eventsApi.create(data)
    }
    setModalEvent(null)
    fetchData()
  }

  const handleDelete = async (id) => {
    await eventsApi.delete(id)
    setModalEvent(null)
    fetchData()
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={calendarEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
      />
      {modalEvent && (
        <EventModal
          event={modalEvent}
          plants={plants}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalEvent(null)}
        />
      )}
    </div>
  )
}
