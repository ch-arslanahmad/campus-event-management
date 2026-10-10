import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventCard from '../components/EventCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { categories, events } from '../assets/eventsData.js'

export default function Events() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const active = params.get('category') || 'all'

  const list = events.filter(
    (e) =>
      (active === 'all' || e.category === active) &&
      e.title.toLowerCase().includes(query.toLowerCase())
  )
  const pick = (key) => (key === 'all' ? setParams({}) : setParams({ category: key }))

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-title">Events</h1>
        <div className="filters">
          {['all', ...Object.keys(categories)].map((key) => (
            <button key={key} className={`chip ${active === key ? 'is-active' : ''}`} onClick={() => pick(key)}>
              {key === 'all' ? 'All events' : categories[key].label}
            </button>
          ))}
          <input className="search" type="search" placeholder="Search events" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search events" />
        </div>
        {list.length ? (
          <div className="grid grid--3">{list.map((e, i) => <Reveal key={e.id} delay={(i % 3) * 120}><EventCard event={e} /></Reveal>)}</div>
        ) : (
          <p className="empty">No events match. Try another category or clear the search.</p>
        )}
      </div>
    </section>
  )
}
