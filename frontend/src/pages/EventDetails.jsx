import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getEvent } from '../api/events.js'
import { listRegistrations, registerForEvent } from '../api/registrations.js'
import { useAuth } from '../assets/AuthContext.jsx'
import { categories } from '../assets/eventsData.js'
export default function EventDetails() {
  const [params] = useSearchParams(), id = params.get('id'), { user } = useAuth(); const [event, setEvent] = useState(null), [registered, setRegistered] = useState(false), [message, setMessage] = useState('')
  const load = () => { getEvent(id).then(setEvent).catch((reason) => setMessage(reason.message)); if (user?.role === 'user') listRegistrations({ eventId: id, size: 100 }).then((data) => setRegistered(data.totalElements > 0)).catch(() => {}) }
  useEffect(load, [id, user?.role])
  if (!event) return <section className="section"><div className="container state-card"><h1>{message || 'Loading event…'}</h1></div></section>
  const category = categories[String(event.category).toLowerCase()] ?? categories.seminar, seats = Math.max(event.capacity - event.registeredCount, 0), full = seats === 0
  const submit = async () => { try { await registerForEvent(event.id); setRegistered(true); setMessage('You are registered.'); load() } catch (reason) { setMessage(reason.message) } }
  return <section className="section detail-page"><div className="container"><Link to="/events" className="back-link">← Back to events</Link><div className="detail-layout"><article className="detail-card" style={{ '--accent': category.color }}><span className="tag">{category.label}</span><h1>{event.title}</h1><p className="lead">{event.description}</p><dl className="event-facts"><div><dt>Date</dt><dd>{event.date}</dd></div><div><dt>Time</dt><dd>{event.time}</dd></div><div><dt>Location</dt><dd>{event.location}</dd></div><div><dt>Available seats</dt><dd>{seats} of {event.capacity}</dd></div></dl></article><aside className="registration-card"><p className="eyebrow">Reserve your place</p><h2>{full ? 'This event is full' : 'Student registration'}</h2>{message && <p className={registered ? 'success' : 'error'}>{message}</p>}{!user && <p className="form-note">Please log in to register.</p>}<button className="btn btn--primary btn--block" disabled={!user || user.role === 'admin' || registered || full} onClick={submit}>{registered ? 'Registered' : full ? 'Registration closed' : !user ? 'Log in to register' : 'Register now'}</button>{registered && <Link to="/my-events" className="registration-next">View my events →</Link>}</aside></div></div></section>
}
