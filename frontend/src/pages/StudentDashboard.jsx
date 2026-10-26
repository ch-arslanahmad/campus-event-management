import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listRegistrations, cancelRegistration } from '../api/registrations.js'
import { getEvent } from '../api/events.js'
export default function StudentDashboard({ user }) {
  const [items, setItems] = useState([]), [error, setError] = useState('')
  const load = () => listRegistrations({ size: 100 }).then(async (data) => setItems(await Promise.all(data.content.map(async (registration) => ({ registration, event: await getEvent(registration.eventId) }))))).catch((reason) => setError(reason.message))
  useEffect(load, [])
  const cancel = async (id) => { try { await cancelRegistration(id); load() } catch (reason) { setError(reason.message) } }
  return <section className="section dashboard"><div className="container"><p className="eyebrow">Student account</p><h1>My events</h1><p className="lead">Welcome back, {user.name}.</p>{error && <p className="error">{error}</p>}{!items.length ? <div className="state-card"><h2>You have not registered for any events yet.</h2><Link to="/events" className="btn btn--primary">Explore events</Link></div> : <div className="registration-grid">{items.map(({ registration, event }) => <article className="registration-item" key={registration.id}><h2>{event.title}</h2><p>{event.date} · {event.time}<br />{event.location}</p><button className="text-button" onClick={() => cancel(registration.id)}>Cancel registration</button></article>)}</div>}</div></section>
}
