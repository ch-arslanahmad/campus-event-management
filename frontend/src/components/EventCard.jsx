import Photo from './Photo.jsx'
import { Link } from 'react-router-dom'
import { categoryFor } from '../assets/eventsData.js'

export default function EventCard({ event }) {
  const category = categoryFor(event.category)
  const seats = Math.max((event.capacity ?? 0) - (event.registeredCount ?? 0), 0)
  return <article className="event-card" style={{ '--accent': category.color }}>
    <Photo src={category.photo} fallback={category.img} alt="" className="event-card__img" />
    <div className="event-card__body"><span className="tag">{category.label}</span><h3>{event.title}</h3><p>{event.description}</p>
      <ul className="event-card__meta"><li>{event.date} at {event.time}</li><li>{event.location}</li><li>{seats} {seats === 1 ? 'seat' : 'seats'} left</li></ul>
      <Link className="btn btn--outline btn--small" to={`/event?id=${event.id}`}>View & register</Link>
    </div>
  </article>
}
