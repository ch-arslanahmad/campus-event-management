import { categories } from '../assets/eventsData.js'

export default function EventCard({ event }) {
  const c = categories[event.category]
  return (
    <article className="event-card" style={{ '--accent': c.color }}>
      <img src={c.img} alt="" className="event-card__img" />
      <div className="event-card__body">
        <span className="tag">{c.label}</span>
        <h3>{event.title}</h3>
        <p>{event.desc}</p>
        <ul className="event-card__meta">
          <li>{event.date} at {event.time}</li>
          <li>{event.venue}</li>
        </ul>
        <button className="btn btn--outline btn--small">Register</button>
      </div>
    </article>
  )
}
