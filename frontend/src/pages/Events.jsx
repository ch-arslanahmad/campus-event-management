import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventCard from '../components/EventCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { categories } from '../assets/eventsData.js'
import { getEvents } from '../assets/data.js'

export default function Events() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const active = params.get('category') || 'all'

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 220)
    return () => window.clearTimeout(timer)
  }, [query])
  const list = getEvents().filter((event) => {
    const searchable = `${event.title} ${event.desc} ${event.venue}`.toLowerCase()
    return (active === 'all' || event.category === active) && searchable.includes(debouncedQuery)
  })
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
        <p className="result-count" aria-live="polite">{list.length} {list.length === 1 ? 'event' : 'events'} found</p>
        {list.length ? (
          <div className="grid grid--3">{list.map((e, i) => <Reveal key={e.id} delay={(i % 3) * 120}><EventCard event={e} /></Reveal>)}</div>
        ) : (
          <p className="empty">No events match. Try another category or clear the search.</p>
        )}
      </div>
    </section>
  )
}
