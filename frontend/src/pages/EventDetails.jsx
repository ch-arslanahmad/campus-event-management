import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories } from '../assets/eventsData.js'
import { getEventById, getRegistrations, register } from '../assets/data.js'
import { useAuth } from '../assets/AuthContext.jsx'

export default function EventDetails({ eventId }) {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const id = eventId ?? params.get('id')
  const event = useMemo(() => getEventById(id), [id])
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [registrations, setRegistrations] = useState(() => getRegistrations())

  if (!event) {
    return <section className="section"><div className="container state-card"><p className="eyebrow">Event details</p><h1>Event not found</h1><p className="lead">That event may have moved or is no longer available.</p><Link to="/events" className="btn btn--primary">Browse events</Link></div></section>
  }

  const capacity = event.capacity ?? 100
  const eventRegistrations = registrations.filter((item) => String(item.eventId) === String(event.id))
  const seatsLeft = Math.max(capacity - eventRegistrations.length, 0)
  const isFull = seatsLeft === 0
  const registrationEmail = user?.role === 'user' ? user.email : ''
  const myRegistrations = registrationEmail
    ? registrations.filter((item) => item.email === registrationEmail)
    : []

  const submit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!user) nextErrors.form = 'Log in as a student to register for this event.'
    if (user?.role === 'admin') nextErrors.form = 'Administrators cannot register as students.'
    setErrors(nextErrors)
    setSuccess('')
    if (Object.keys(nextErrors).length) return

    const result = register({ name: user.name, email: user.email, eventId: event.id, capacity })
    if (result.error) {
      setErrors({ form: result.error })
      return
    }
    const updated = getRegistrations()
    setRegistrations(updated)
    setSuccess(`You’re registered for ${event.title}. We’ll see you there!`)
  }

  const category = categories[event.category]
  return (
    <section className="section detail-page">
      <div className="container">
        <Link to="/events" className="back-link">← Back to events</Link>
        <div className="detail-layout">
          <article className="detail-card" style={{ '--accent': category.color }}>
            <span className="tag">{category.label}</span>
            <h1>{event.title}</h1>
            <p className="lead">{event.description ?? event.desc}</p>
            <dl className="event-facts">
              <div><dt>Date</dt><dd>{event.date}</dd></div>
              <div><dt>Time</dt><dd>{event.time}</dd></div>
              <div><dt>Location</dt><dd>{event.location ?? event.venue}</dd></div>
              <div><dt>Available seats</dt><dd>{seatsLeft} of {capacity}</dd></div>
            </dl>
          </article>

          <aside className="registration-card">
            <p className="eyebrow">Reserve your place</p>
            <h2>{isFull ? 'This event is full' : 'Student registration'}</h2>
            <p className="form-note">Registering for <strong>{event.title}</strong></p>
            {!user && <p className="form-note">Please <Link to="/login">log in</Link> as a student to reserve your place.</p>}
            {user?.role === 'user' && <p className="signed-in-as">Registering as <strong>{user.name}</strong> · {user.email}</p>}
            {user?.role === 'admin' && <p className="form-note">Administrators manage events and cannot register as students.</p>}
            <form onSubmit={submit} noValidate>
              {errors.form && <p className="error" role="alert">{errors.form}</p>}
              {success && <p className="success" role="status">{success}</p>}
              <button className="btn btn--primary btn--block" type="submit" disabled={isFull || !user || user.role === 'admin'}>{isFull ? 'Registration closed' : !user ? 'Log in to register' : user.role === 'admin' ? 'Admin account' : 'Register now'}</button>
            </form>
          </aside>
        </div>

        <section className="my-registrations" aria-live="polite">
          <p className="eyebrow">Your schedule</p>
          <h2>My registrations</h2>
          {!user && <p className="empty">Log in as a student to view your registrations.</p>}
          {user?.role === 'user' && !myRegistrations.length && <p className="empty">You have not registered for any events yet.</p>}
          {user?.role === 'admin' && <p className="empty">Administrators do not have student registrations.</p>}
          {myRegistrations.length > 0 && <ul className="registration-list">{myRegistrations.map((item) => <li key={item.id}><strong>{item.eventId === event.id ? event.title : `Event #${item.eventId}`}</strong><span>Registered {new Date(item.registrationDate).toLocaleDateString()}</span></li>)}</ul>}
        </section>
      </div>
    </section>
  )
}
