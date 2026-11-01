import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { deleteEvent, getEvent, listEvents } from '../api/events.js'
import { listRegistrations } from '../api/registrations.js'
import { useAuth } from '../assets/AuthContext.jsx'

const today = () => new Date().toISOString().slice(0, 10)
const PAGE_SIZE = 8

export default function Admin() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [tablePage, setTablePage] = useState({ content: [], page: 0, size: PAGE_SIZE, totalElements: 0, totalPages: 0, first: true, last: true })
  const [summary, setSummary] = useState([])
  const [page, setPage] = useState(0)
  const [upcoming, setUpcoming] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [activityTitles, setActivityTitles] = useState({})
  const [totals, setTotals] = useState({ events: 0, registrations: 0, upcoming: 0 })
  const [message, setMessage] = useState(location.state?.notice || '')
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  // Seat utilisation and the upcoming count need every event this admin owns,
  // but the list endpoint caps `size` at 100 (ADR-0003), so walk the pages.
  const loadAllEvents = async () => {
    const content = []
    let pageIndex = 0
    let last = false
    while (!last) {
      const result = await listEvents({ createdBy: user.id, page: pageIndex, size: 100 })
      content.push(...result.content)
      last = result.last
      pageIndex += 1
    }
    return content
  }

  const load = async (targetPage = page) => {
    if (!user?.id) return
    try {
      const [eventPage, registrationPage, allEvents] = await Promise.all([
        listEvents({ createdBy: user.id, page: targetPage, size: PAGE_SIZE }),
        listRegistrations({ size: 4 }),
        loadAllEvents(),
      ])
      setTablePage(eventPage)
      setSummary(allEvents)
      setRegistrations(registrationPage.content)
      const activityEvents = await Promise.allSettled(
        registrationPage.content.map((registration) => getEvent(registration.eventId))
      )
      setActivityTitles(Object.fromEntries(activityEvents
        .filter((result) => result.status === 'fulfilled')
        .map((result) => [result.value.id, result.value.title])))
      const now = today()
      const upcomingEvents = allEvents
        .filter((event) => event.date >= now)
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
      setUpcoming(upcomingEvents.slice(0, 4))
      setTotals({
        events: eventPage.totalElements,
        registrations: registrationPage.totalElements,
        upcoming: upcomingEvents.length,
      })
      setError('')
      setReady(true)
    } catch (reason) { setError(reason.message) }
  }

  useEffect(() => {
    const initialLoad = async () => { await load(page) }
    void initialLoad()
    // Reload when the identity or the visible page changes; load() reads both.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, page])

  if (loading) return null
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />

  const remove = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await deleteEvent(id); setMessage('Event deleted.')
      // Deleting the only row on a page would leave it empty; step back instead.
      if (tablePage.content.length === 1 && page > 0) setPage(page - 1); else await load(page)
    } catch (reason) { setError(reason.message) }
  }
  const totalCapacity = summary.reduce((sum, event) => sum + event.capacity, 0)
  const totalRegistered = summary.reduce((sum, event) => sum + event.registeredCount, 0)
  const utilisation = totalCapacity ? Math.round(totalRegistered / totalCapacity * 100) : 0
  const titleById = new Map(summary.map((event) => [event.id, event.title]))
  const activityTitle = (eventId) => activityTitles[eventId] || titleById.get(eventId) || `Event #${eventId}`

  return <section className="section admin-workspace"><div className="container"><p className="eyebrow">Administrator</p><h1>Event hub</h1>{message && <p className="success" role="status">{message}</p>}{error && <p className="error" role="alert">{error}</p>}
    <div className="metrics"><article><span>Your events</span><strong>{totals.events}</strong></article><article><span>Upcoming</span><strong>{totals.upcoming}</strong></article><article><span>Registrations</span><strong>{totals.registrations}</strong></article><article><span>Seat utilisation</span><strong>{utilisation}%</strong></article></div>
    <div className="admin-toolbar"><div><h2>Manage events</h2><p>Create an event or update one of your existing listings.</p></div><Link to="/dashboard/events/new" className="btn btn--primary admin-create"><span aria-hidden="true">+</span> Create event</Link></div>
    <div className="admin-panels"><article className="admin-panel"><h2>Upcoming events</h2>{upcoming.slice(0, 4).map((event) => <p key={event.id}><strong>{event.title}</strong><span>{event.date} · {event.time}</span></p>)}{!upcoming.length && <p className="empty">No upcoming events.</p>}</article><article className="admin-panel"><h2>Recent activity on your events</h2>{registrations.map((registration) => <p key={registration.id}><strong>{registration.userName || 'Student'} joined</strong><span>{activityTitle(registration.eventId)} · {registration.registeredAt?.slice(0, 10) || 'recently'}</span></p>)}{!registrations.length && <p className="empty">No registrations yet.</p>}</article></div>
    <h2 className="admin-list-heading">Your events</h2><div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Event</th><th>Schedule</th><th>Registrations</th><th>Seats left</th><th>Actions</th></tr></thead><tbody>{tablePage.content.map((event) => <tr key={event.id}><td><strong>{event.title}</strong><br /><small>{event.category}</small></td><td>{event.date}<br />{event.time}</td><td>{event.registeredCount} / {event.capacity}</td><td>{Math.max(event.capacity - event.registeredCount, 0)}</td><td className="admin__row-actions"><Link className="btn btn--outline btn--small" to={`/dashboard/events/${event.id}/edit`}>Edit</Link><button className="btn btn--danger btn--small" onClick={() => remove(event.id)}>Delete</button></td></tr>)}{!tablePage.content.length && <tr><td className="empty" colSpan="5">{ready ? 'No events yet. Use Create event to add your first one.' : 'Loading your events…'}</td></tr>}</tbody></table></div>
    {tablePage.totalPages > 1 && <nav className="pagination" aria-label="Your events pages"><button className="btn btn--outline btn--small" disabled={tablePage.first} onClick={() => setPage(page - 1)}>Previous</button><span>Page {tablePage.page + 1} of {tablePage.totalPages}</span><button className="btn btn--outline btn--small" disabled={tablePage.last} onClick={() => setPage(page + 1)}>Next</button></nav>}
  </div></section>
}
