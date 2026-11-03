import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { deleteEvent, getEvent, listEvents } from '../api/events.js'
import { listRegistrations } from '../api/registrations.js'
import { useAuth } from '../assets/AuthContext.jsx'
import { categories, categoryFor } from '../assets/eventsData.js'
import { STATUS_OPTIONS, eventState, filterEvents, localToday } from '../assets/adminRules.js'

const PAGE_SIZE = 8
const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map((option) => [option.value, option.label]))

export default function Admin() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const [allEvents, setAllEvents] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [activityTitles, setActivityTitles] = useState({})
  const [totals, setTotals] = useState({ events: 0, registrations: 0, upcoming: 0 })
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [message, setMessage] = useState(location.state?.notice || '')
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  // Filters live in the URL like the student Events page, so refresh and the back button keep them.
  const category = params.get('category') || 'all'
  const rawStatus = params.get('status')
  const status = STATUS_LABEL[rawStatus] ? rawStatus : 'all'
  const page = Math.max(Number(params.get('page')) || 0, 0)
  const update = (changes) => setParams((prev) => {
    const next = new URLSearchParams(prev)
    Object.entries(changes).forEach(([key, value]) => { if (!value || value === 'all') next.delete(key); else next.set(key, String(value)) })
    return next
  })
  // Resets happen in the handlers, not in an effect, so a page change can never undo itself.
  const selectCategory = (value) => update({ category: value, page: 0 })
  const selectStatus = (value) => update({ status: value, page: 0 })
  const changePage = (next) => update({ page: next })
  const onSearch = (value) => { setQuery(value); if (page) update({ page: 0 }) }
  useEffect(() => { const timer = window.setTimeout(() => setDebounced(query.trim()), 220); return () => window.clearTimeout(timer) }, [query])

  // Metrics and the table need every event this admin owns, but the list endpoint
  // caps `size` at 100 (ADR-0003), so walk the pages once and filter in the browser.
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

  const load = async () => {
    if (!user?.id) return
    try {
      const [registrationPage, events] = await Promise.all([listRegistrations({ size: 4 }), loadAllEvents()])
      setAllEvents(events)
      setRegistrations(registrationPage.content)
      const activityEvents = await Promise.allSettled(registrationPage.content.map((registration) => getEvent(registration.eventId)))
      setActivityTitles(Object.fromEntries(activityEvents
        .filter((result) => result.status === 'fulfilled')
        .map((result) => [result.value.id, result.value.title])))
      const now = localToday()
      const upcomingEvents = events
        .filter((event) => event.date >= now)
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
      setUpcoming(upcomingEvents.slice(0, 4))
      setTotals({ events: events.length, registrations: registrationPage.totalElements, upcoming: upcomingEvents.length })
      setError('')
      setReady(true)
    } catch (reason) { setError(reason.message) }
  }

  useEffect(() => {
    const initialLoad = async () => { await load() }
    void initialLoad()
    // Reload when the identity changes; load() reads it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  if (loading) return null
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />

  const remove = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try { await deleteEvent(id); setMessage('Event deleted.'); await load() } catch (reason) { setError(reason.message) }
  }

  const today = localToday()
  const filtered = filterEvents(allEvents, { q: debounced, category, status }, today, (value) => categoryFor(value).label)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const safePage = Math.min(page, Math.max(totalPages - 1, 0)) // a delete can leave the URL page past the end
  const visible = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)
  const start = visible.length ? safePage * PAGE_SIZE + 1 : 0
  const end = visible.length ? safePage * PAGE_SIZE + visible.length : 0
  const filtering = category !== 'all' || status !== 'all' || debounced !== ''
  const clearFilters = () => { setQuery(''); setDebounced(''); setParams({}) }

  const totalCapacity = allEvents.reduce((sum, event) => sum + event.capacity, 0)
  const totalRegistered = allEvents.reduce((sum, event) => sum + event.registeredCount, 0)
  const utilisation = totalCapacity ? Math.round(totalRegistered / totalCapacity * 100) : 0
  const titleById = new Map(allEvents.map((event) => [event.id, event.title]))
  const activityTitle = (eventId) => activityTitles[eventId] || titleById.get(eventId) || `Event #${eventId}`

  return <section className="section admin-workspace"><div className="container"><p className="eyebrow">Administrator</p><h1>Event hub</h1>{message && <p className="success" role="status">{message}</p>}{error && <p className="error" role="alert">{error}</p>}
    <div className="metrics"><article><span>Your events</span><strong>{totals.events}</strong></article><article><span>Upcoming</span><strong>{totals.upcoming}</strong></article><article><span>Registrations</span><strong>{totals.registrations}</strong></article><article><span>Seat utilisation</span><strong>{utilisation}%</strong></article></div>
    <div className="admin-toolbar"><div><h2>Manage events</h2><p>Create an event or update one of your existing listings.</p></div><Link to="/dashboard/events/new" className="btn btn--primary admin-create"><span aria-hidden="true">+</span> Create event</Link></div>
    <div className="admin-panels"><article className="admin-panel"><h2>Upcoming events</h2>{upcoming.map((event) => <p key={event.id}><strong>{event.title}</strong><span>{event.date} · {event.time}</span></p>)}{!upcoming.length && <p className="empty">No upcoming events.</p>}</article><article className="admin-panel"><h2>Recent activity on your events</h2>{registrations.map((registration) => <p key={registration.id}><strong>{registration.userName || 'Student'} joined</strong><span>{activityTitle(registration.eventId)} · {registration.registeredAt?.slice(0, 10) || 'recently'}</span></p>)}{!registrations.length && <p className="empty">No registrations yet.</p>}</article></div>

    <h2 className="admin-list-heading">Your events</h2>
    <div className="admin-filters">
      <div className="chip-row" role="group" aria-label="Filter by category">{['all', ...Object.keys(categories)].map((key) => <button key={key} type="button" aria-pressed={category === key} className={`chip ${category === key ? 'is-active' : ''}`} onClick={() => selectCategory(key)}>{key === 'all' ? 'All events' : categories[key].label}</button>)}</div>
      <input className="search" type="search" placeholder="Search events" aria-label="Search your events" value={query} onChange={(event) => onSearch(event.target.value)} />
    </div>
    <div className="admin-filters admin-filters--status">
      <span className="filter-label" id="status-filter-label">Status</span>
      <div className="chip-row" role="group" aria-labelledby="status-filter-label">{[{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS].map((option) => <button key={option.value} type="button" aria-pressed={status === option.value} className={`chip ${status === option.value ? 'is-active' : ''}`} onClick={() => selectStatus(option.value)}>{option.label}</button>)}</div>
      {filtering && <button type="button" className="text-button" onClick={clearFilters}>Clear filters</button>}
    </div>
    {ready && <p className="result-count admin-result-count" aria-live="polite">{start}–{end} of {filtered.length} {filtered.length === 1 ? 'event' : 'events'}</p>}
    <p className="table-cue">Swipe sideways to see every column →</p>
    <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Event</th><th>Schedule</th><th>Status</th><th>Registrations</th><th>Seats left</th><th>Actions</th></tr></thead><tbody>{visible.map((event) => { const state = eventState(event, today); return <tr key={event.id}><td><strong>{event.title}</strong><br /><small>{categoryFor(event.category).label}</small></td><td>{event.date}<br />{event.time}</td><td><span className={`status status--${state}`}>{STATUS_LABEL[state]}</span></td><td>{event.registeredCount} / {event.capacity}</td><td>{Math.max(event.capacity - event.registeredCount, 0)}</td><td className="admin__row-actions"><Link className="btn btn--outline btn--small" to={`/dashboard/events/${event.id}/edit`}>Edit</Link><button className="btn btn--danger btn--small" onClick={() => remove(event.id)}>Delete</button></td></tr> })}{!visible.length && <tr><td className="empty" colSpan="6">{!ready ? 'Loading your events…' : filtering ? 'No events match. Try another category or status, or clear the search.' : 'No events yet. Use Create event to add your first one.'}</td></tr>}</tbody></table></div>
    {totalPages > 1 && <nav className="pagination" aria-label="Your events pages"><button className="btn btn--outline btn--small" disabled={safePage === 0} onClick={() => changePage(safePage - 1)}>Previous</button><span>Page {safePage + 1} of {totalPages}</span><button className="btn btn--outline btn--small" disabled={safePage + 1 >= totalPages} onClick={() => changePage(safePage + 1)}>Next</button></nav>}
  </div></section>
}
