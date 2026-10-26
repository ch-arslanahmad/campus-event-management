import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { categories } from '../assets/eventsData.js'
import { createEvent, getEvent, updateEvent } from '../api/events.js'
import { useAuth } from '../assets/AuthContext.jsx'

const blank = { title: '', description: '', category: 'SEMINAR', date: '', time: '', location: '', capacity: 50, featured: false }

export default function EventEditor() {
  const { user, loading } = useAuth()
  const { eventId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const editing = Boolean(eventId)
  const [form, setForm] = useState(blank)
  const [fetching, setFetching] = useState(editing)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!editing || !user?.id) return
    let cancelled = false
    const load = async () => {
      try {
        const event = await getEvent(eventId)
        if (cancelled) return
        if (event.created_by !== user.id) {
          setLoadError('This event belongs to another administrator, so you cannot edit it.')
        } else {
          setForm({
            title: event.title,
            description: event.description || '',
            category: event.category,
            date: event.date || '',
            time: event.time ? event.time.slice(0, 5) : '',
            location: event.location,
            capacity: event.capacity,
            featured: Boolean(event.featured),
          })
        }
      } catch (reason) { if (!cancelled) setLoadError(reason.message) }
      finally { if (!cancelled) setFetching(false) }
    }
    void load()
    return () => { cancelled = true }
  }, [editing, eventId, user?.id])

  if (loading) return null
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user.role !== 'admin') return <Navigate to="/my-events" replace />

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value })
  const submit = async (event) => {
    event.preventDefault(); setError(''); setSaving(true)
    try {
      const payload = { ...form, capacity: Number(form.capacity) }
      if (editing) await updateEvent(eventId, payload); else await createEvent(payload)
      navigate('/dashboard', { state: { notice: editing ? 'Event updated.' : 'Event created.' } })
    } catch (reason) { setError(reason.message); setSaving(false) }
  }

  return <section className="section event-editor"><div className="container"><Link to="/dashboard" className="back-link">← Back to dashboard</Link>
    <div className="admin__form-card event-editor__card"><p className="eyebrow">Administrator</p><h1>{editing ? 'Edit event' : 'Create event'}</h1><p className="lead">{editing ? 'Update the details students see on the event page.' : 'Fill in the details students will see once the event is published.'}</p>
      {loadError ? <div className="event-editor__error"><p className="error" role="alert">{loadError}</p><Link to="/dashboard" className="btn btn--primary">Back to dashboard</Link></div> : fetching ? <p className="empty">Loading event…</p> : <>
        {error && <p className="error" role="alert">{error}</p>}
        <form className="admin__form" onSubmit={submit}>
          <label>Title<input required value={form.title} onChange={set('title')} autoFocus /></label>
          <label>Category<select value={form.category} onChange={set('category')}>{Object.entries(categories).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></label>
          <label>Date<input required type="date" value={form.date} onChange={set('date')} /></label>
          <label>Time<input required type="time" value={form.time} onChange={set('time')} /></label>
          <label>Location<input required value={form.location} onChange={set('location')} /></label>
          <label>Capacity<input required min="1" type="number" inputMode="numeric" value={form.capacity} onChange={set('capacity')} /></label>
          <label className="admin__wide">Description<textarea value={form.description} onChange={set('description')} /></label>
          <label className="checkbox admin__wide"><input type="checkbox" checked={form.featured} onChange={set('featured')} /> Feature this event</label>
          <div className="admin__actions admin__wide event-editor__actions"><button className="btn btn--primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create event'}</button><Link to="/dashboard" className="btn btn--outline">Cancel</Link></div>
        </form>
      </>}
    </div>
  </div></section>
}
