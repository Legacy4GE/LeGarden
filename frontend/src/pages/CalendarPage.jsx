import { useState, useEffect, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
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

const MOBILE_BREAKPOINT = 768

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

export default function CalendarPage() {
  const [events, setEvents] = useState([])
  const [plants, setPlants] = useState([])
  const [modalEvent, setModalEvent] = useState(null)
  const isMobile = useIsMobile()

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
    <div className="max-w-7xl mx-auto px-3 py-4 md:p-6">
      <FullCalendar
        key={isMobile ? 'mobile' : 'desktop'}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={isMobile ? 'listMonth' : 'dayGridMonth'}
        headerToolbar={
          isMobile
            ? { left: 'prev,next', center: 'title', right: 'listMonth,dayGridMonth' }
            : { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }
        }
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
