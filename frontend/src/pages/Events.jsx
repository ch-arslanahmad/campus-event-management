import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventCard from '../components/EventCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { categories } from '../assets/eventsData.js'
import { listEvents } from '../api/events.js'

export default function Events() {
  const [params, setParams] = useSearchParams(); const [query, setQuery] = useState(''); const [debounced, setDebounced] = useState(''); const [data, setData] = useState({ content: [], totalElements: 0, page: 0, totalPages: 0 }); const [error, setError] = useState(''); const active = params.get('category') || 'all'; const page = Number(params.get('page') || 0)
  useEffect(() => { const timer = window.setTimeout(() => setDebounced(query.trim()), 220); return () => window.clearTimeout(timer) }, [query])
  useEffect(() => { let cancelled = false; const load = async () => { try { const result = await listEvents({ category: active === 'all' ? undefined : active, q: debounced, page, size: 12 }); if (!cancelled) { setData(result); setError('') } } catch (reason) { if (!cancelled) setError(reason.message) } }; void load(); return () => { cancelled = true } }, [active, debounced, page])
  const selectCategory = (category) => setParams(category === 'all' ? {} : { category })
  const changePage = (next) => setParams({ ...(active === 'all' ? {} : { category: active }), page: String(next) })
  const start = data.totalElements ? page * data.size + 1 : 0; const end = Math.min((page + 1) * data.size, data.totalElements)
  return <section className="section"><div className="container"><h1 className="page-title">Events</h1><div className="filters">{['all', ...Object.keys(categories)].map((key) => <button key={key} className={`chip ${active === key ? 'is-active' : ''}`} onClick={() => selectCategory(key)}>{key === 'all' ? 'All events' : categories[key].label}</button>)}<input className="search" type="search" placeholder="Search events" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
    {error ? <p className="error" role="alert">{error}</p> : <><p className="result-count" aria-live="polite">{start}–{end} of {data.totalElements} events</p>{data.content.length ? <div className="grid grid--3">{data.content.map((event, index) => <Reveal key={event.id} delay={(index % 3) * 120}><EventCard event={event} /></Reveal>)}</div> : <p className="empty">No events match. Try another category or clear the search.</p>}{data.totalPages > 1 && <nav className="pagination" aria-label="Event pages"><button className="btn btn--outline btn--small" disabled={page === 0} onClick={() => changePage(page - 1)}>Previous</button><span>Page {page + 1} of {data.totalPages}</span><button className="btn btn--outline btn--small" disabled={page + 1 >= data.totalPages} onClick={() => changePage(page + 1)}>Next</button></nav>}</>}</div></section>
}
