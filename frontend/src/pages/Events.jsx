import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventCard from '../components/EventCard.jsx'
import { categories } from '../assets/eventsData.js'
import { listEvents } from '../api/events.js'

export default function Events() {
  const [params, setParams] = useSearchParams(), [query, setQuery] = useState(''), [page, setPage] = useState(0), [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 }), [error, setError] = useState('')
  const active = params.get('category') || 'all'
  useEffect(() => { const timer = setTimeout(() => listEvents({ category: active === 'all' ? undefined : active.toUpperCase(), q: query, page, size: 12 }).then(setData).catch((reason) => setError(reason.message)), 220); return () => clearTimeout(timer) }, [active, query, page])
  const pick = (key) => { setPage(0); setParams(key === 'all' ? {} : { category: key }) }
  const first = data.totalElements ? page * 12 + 1 : 0, last = Math.min((page + 1) * 12, data.totalElements)
  return <section className="section"><div className="container"><h1 className="page-title">Events</h1><div className="filters">{['all', ...Object.keys(categories)].map((key) => <button key={key} className={`chip ${active === key ? 'is-active' : ''}`} onClick={() => pick(key)}>{key === 'all' ? 'All events' : categories[key].label}</button>)}<input className="search" type="search" placeholder="Search events" value={query} onChange={(e) => { setPage(0); setQuery(e.target.value) }} /></div>{error && <p className="error">{error}</p>}<p className="result-count">{first}–{last} of {data.totalElements}</p>{data.content.length ? <div className="grid grid--3">{data.content.map((event) => <EventCard key={event.id} event={event} />)}</div> : <p className="empty">No events match your filters.</p>}<div className="admin__actions" style={{ marginTop: 28 }}><button className="btn btn--outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button><button className="btn btn--primary" disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button></div></div></section>
}
