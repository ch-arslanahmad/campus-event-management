import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories } from '../assets/eventsData.js'
import { getRegistrations, register } from '../assets/data.js'

// Page-owned demo events. These stay separate from the general event listing
// until the backend becomes the single source of truth.
const detailEvents = [
  { id: 1, title: 'Future of AI in Education', description: 'A guest talk on practical ways artificial intelligence is changing teaching, research, and student opportunity.', date: 'Oct 21', time: '10:00 AM', location: 'Main Auditorium', category: 'seminar', capacity: 120 },
  { id: 2, title: 'Career Paths in Engineering', description: 'Meet alumni and industry guests to explore the first steps from university into meaningful engineering careers.', date: 'Oct 28', time: '1:00 PM', location: 'Seminar Hall B', category: 'seminar', capacity: 80 },
  { id: 3, title: 'Web Design Basics', description: 'A hands-on introduction to building a thoughtful, responsive web experience from your first layout to publish.', date: 'Nov 2', time: '11:00 AM', location: 'Computer Lab 2', category: 'workshop', capacity: 24 },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function EventDetails({ eventId }) {
  const [params] = useSearchParams()
  const id = eventId ?? params.get('id')
  const event = useMemo(() => detailEvents.find((item) => String(item.id) === String(id)), [id])
  const [form, setForm] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [registrations, setRegistrations] = useState(() => getRegistrations())

  if (!event) {
    return <section className="section"><div className="container state-card"><p className="eyebrow">Event details</p><h1>Event not found</h1><p className="lead">That event may have moved or is no longer available.</p><Link to="/events" className="btn btn--primary">Browse events</Link></div></section>
  }

  const eventRegistrations = registrations.filter((item) => item.eventId === event.id)
  const seatsLeft = Math.max(event.capacity - eventRegistrations.length, 0)
  const isFull = seatsLeft === 0
  const myRegistrations = form.email.trim()
    ? registrations.filter((item) => item.email === form.email.trim().toLowerCase())
    : []

  const submit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Enter your full name.'
    if (!form.email.trim()) nextErrors.email = 'Enter your email address.'
    else if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.'
    setErrors(nextErrors)
    setSuccess('')
    if (Object.keys(nextErrors).length) return

    const result = register({ ...form, eventId: event.id, capacity: event.capacity })
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
            <p className="lead">{event.description}</p>
            <dl className="event-facts">
              <div><dt>Date</dt><dd>{event.date}</dd></div>
              <div><dt>Time</dt><dd>{event.time}</dd></div>
              <div><dt>Location</dt><dd>{event.location}</dd></div>
              <div><dt>Available seats</dt><dd>{seatsLeft} of {event.capacity}</dd></div>
            </dl>
          </article>

          <aside className="registration-card">
            <p className="eyebrow">Reserve your place</p>
            <h2>{isFull ? 'This event is full' : 'Student registration'}</h2>
            <p className="form-note">Registering for <strong>{event.title}</strong></p>
            <form onSubmit={submit} noValidate>
              <label>Full name
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} disabled={isFull} />
              </label>
              {errors.name && <p id="name-error" className="error" role="alert">{errors.name}</p>}
              <label>Email address
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} disabled={isFull} />
              </label>
              {errors.email && <p id="email-error" className="error" role="alert">{errors.email}</p>}
              {errors.form && <p className="error" role="alert">{errors.form}</p>}
              {success && <p className="success" role="status">{success}</p>}
              <button className="btn btn--primary btn--block" type="submit" disabled={isFull}>{isFull ? 'Registration closed' : 'Register now'}</button>
            </form>
          </aside>
        </div>

        <section className="my-registrations" aria-live="polite">
          <p className="eyebrow">Your schedule</p>
          <h2>My registrations</h2>
          {!form.email.trim() && <p className="empty">Enter your email above to see registrations made with this demo account.</p>}
          {form.email.trim() && !myRegistrations.length && <p className="empty">No registrations found for this email yet.</p>}
          {myRegistrations.length > 0 && <ul className="registration-list">{myRegistrations.map((item) => <li key={item.id}><strong>{item.eventId === event.id ? event.title : `Event #${item.eventId}`}</strong><span>Registered {new Date(item.registrationDate).toLocaleDateString()}</span></li>)}</ul>}
        </section>
      </div>
    </section>
  )
}
