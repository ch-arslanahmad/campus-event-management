import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../assets/eventsData.js'
import { cancelRegistration, getEventById, getRegistrations } from '../assets/data.js'

export default function StudentDashboard({ user }) {
  const [registrations, setRegistrations] = useState(() => getRegistrations().filter((item) => item.email === user.email))
  const cancel = (id) => {
    if (!window.confirm('Cancel this registration?')) return
    cancelRegistration(id)
    setRegistrations(getRegistrations().filter((item) => item.email === user.email))
  }

  return <section className="section dashboard"><div className="container">
    <p className="eyebrow">Student dashboard</p><h1>Your campus calendar</h1>
    <p className="lead">Welcome back, {user.name}. Keep track of every event you have joined.</p>
    {!registrations.length ? <div className="state-card"><h2>Nothing on your calendar yet</h2><p>Discover an event that sparks your interest and reserve your place.</p><Link to="/events" className="btn btn--primary">Explore events</Link></div> : <div className="registration-grid">{registrations.map((registration) => {
      const event = getEventById(registration.eventId)
      const category = event && categories[event.category]
      return <article className="registration-item" key={registration.id}>
        <span className="tag" style={{ '--accent': category?.color }}>{category?.label ?? 'Campus event'}</span>
        <h2>{event?.title ?? `Campus event #${registration.eventId}`}</h2>
        {event ? <p>{event.date} · {event.time}<br />{event.venue}</p> : <p>Your registration is confirmed.</p>}
        <small>Registered {new Date(registration.registrationDate).toLocaleDateString()}</small>
        <button className="text-button" onClick={() => cancel(registration.id)}>Cancel registration</button>
      </article>
    })}</div>}
  </div></section>
}
