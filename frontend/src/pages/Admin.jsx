import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { categories } from '../assets/eventsData.js'
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../api/events.js'
import { listRegistrations } from '../api/registrations.js'
import { useAuth } from '../assets/AuthContext.jsx'

const blank = { title: '', description: '', category: 'SEMINAR', date: '', time: '', location: '', capacity: 50, featured: false }
const today = () => new Date().toISOString().slice(0, 10)

export default function Admin() {
  const { user, loading } = useAuth()
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [activityTitles, setActivityTitles] = useState({})
  const [totals, setTotals] = useState({ events: 0, registrations: 0, upcoming: 0 })
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    if (!user?.id) return
    try {
      const [eventPage, registrationPage, upcomingPage] = await Promise.all([
        listEvents({ createdBy: user.id, size: 100 }),
        listRegistrations({ size: 4 }),
        listEvents({ createdBy: user.id, from: today(), size: 100 }),
      ])
      setEvents(eventPage.content)
      setRegistrations(registrationPage.content)
      const activityEvents = await Promise.allSettled(
        registrationPage.content.map((registration) => getEvent(registration.eventId))
      )
      setActivityTitles(Object.fromEntries(activityEvents
        .filter((result) => result.status === 'fulfilled')
        .map((result) => [result.value.id, result.value.title])))
      setTotals({
        events: eventPage.totalElements,
        registrations: registrationPage.totalElements,
        upcoming: upcomingPage.totalElements,
      })
      setError('')
      return { upcoming: upcomingPage.content }
    } catch (reason) { setError(reason.message); return { upcoming: [] } }
  }

  const [upcoming, setUpcoming] = useState([])
  useEffect(() => {
    let cancelled = false
    const initialLoad = async () => { const result = await load(); if (!cancelled) setUpcoming(result.upcoming) }
    void initialLoad()
    return () => { cancelled = true }
    // The dashboard intentionally refreshes only when the authenticated identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  if (loading) return null
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />

  const refresh = async () => { const result = await load(); setUpcoming(result.upcoming) }
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value })
  const submit = async (event) => {
    event.preventDefault(); setError('')
    try {
      const payload = { ...form, capacity: Number(form.capacity) }
      if (editing) await updateEvent(editing, payload); else await createEvent(payload)
      setForm(blank); setEditing(null); setMessage(editing ? 'Event updated.' : 'Event created.'); await refresh()
    } catch (reason) { setError(reason.message) }
  }
  const edit = (event) => { setEditing(event.id); setForm({ title: event.title, description: event.description || '', category: event.category, date: event.date, time: event.time, location: event.location, capacity: event.capacity, featured: Boolean(event.featured) }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const remove = async (id) => { if (!window.confirm('Delete this event?')) return; try { await deleteEvent(id); setMessage('Event deleted.'); await refresh() } catch (reason) { setError(reason.message) } }
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0)
  const totalRegistered = events.reduce((sum, event) => sum + event.registeredCount, 0)
  const utilisation = totalCapacity ? Math.round(totalRegistered / totalCapacity * 100) : 0
  const titleById = new Map(events.map((event) => [event.id, event.title]))
  const activityTitle = (eventId) => activityTitles[eventId] || titleById.get(eventId) || `Event #${eventId}`

  return <section className="section admin-workspace"><div className="container"><p className="eyebrow">Administrator</p><h1>Event hub</h1>{message && <p className="success" role="status">{message}</p>}{error && <p className="error" role="alert">{error}</p>}
    <div className="metrics"><article><span>Your events</span><strong>{totals.events}</strong></article><article><span>Upcoming</span><strong>{totals.upcoming}</strong></article><article><span>Registrations</span><strong>{totals.registrations}</strong></article><article><span>Seat utilisation</span><strong>{utilisation}%</strong></article></div>
    <div className="admin-panels"><article className="admin-panel"><h2>Upcoming events</h2>{upcoming.slice(0, 4).map((event) => <p key={event.id}><strong>{event.title}</strong><span>{event.date} · {event.time}</span></p>)}{!upcoming.length && <p className="empty">No upcoming events.</p>}</article><article className="admin-panel"><h2>Recent activity on your events</h2>{registrations.map((registration) => <p key={registration.id}><strong>{registration.userName || 'Student'} joined</strong><span>{activityTitle(registration.eventId)} · {registration.registeredAt?.slice(0, 10) || 'recently'}</span></p>)}{!registrations.length && <p className="empty">No registrations yet.</p>}</article></div>
    <div className="admin__form-card"><h2>{editing ? 'Edit event' : 'Create event'}</h2><form className="admin__form" onSubmit={submit}><label>Title<input required value={form.title} onChange={set('title')} /></label><label>Category<select value={form.category} onChange={set('category')}>{Object.entries(categories).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></label><label>Date<input required type="date" value={form.date} onChange={set('date')} /></label><label>Time<input required type="time" value={form.time} onChange={set('time')} /></label><label>Location<input required value={form.location} onChange={set('location')} /></label><label>Capacity<input required min="1" type="number" value={form.capacity} onChange={set('capacity')} /></label><label className="admin__wide">Description<textarea value={form.description} onChange={set('description')} /></label><label className="checkbox admin__wide"><input type="checkbox" checked={form.featured} onChange={set('featured')} /> Feature this event</label><div className="admin__actions admin__wide"><button className="btn btn--primary">{editing ? 'Save changes' : 'Create event'}</button>{editing && <button type="button" className="btn btn--outline" onClick={() => { setEditing(null); setForm(blank) }}>Cancel</button>}</div></form></div>
    <h2 className="admin-list-heading">Your events</h2><div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Event</th><th>Schedule</th><th>Registrations</th><th>Seats left</th><th>Actions</th></tr></thead><tbody>{events.map((event) => <tr key={event.id}><td><strong>{event.title}</strong><br /><small>{event.category}</small></td><td>{event.date}<br />{event.time}</td><td>{event.registeredCount} / {event.capacity}</td><td>{Math.max(event.capacity - event.registeredCount, 0)}</td><td className="admin__row-actions"><button className="btn btn--outline btn--small" onClick={() => edit(event)}>Edit</button><button className="btn btn--danger btn--small" onClick={() => remove(event.id)}>Delete</button></td></tr>)}</tbody></table></div>
  </div></section>
}
