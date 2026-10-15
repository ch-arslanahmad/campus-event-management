import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { categories } from '../assets/eventsData.js'
import { getEvents, addEvent, updateEvent, deleteEvent } from '../assets/eventsStore.js'
import { getCurrentUser } from '../assets/auth.js'

const empty = { title: '', category: 'seminar', date: '', time: '', venue: '', desc: '' }

function Panel() {
  const [list, setList] = useState(getEvents())
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const reset = () => { setForm(empty); setEditingId(null); setError('') }

  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date.trim() || !form.time.trim() || !form.venue.trim()) {
      return setError('Title, date, time and venue are required.')
    }
    if (editingId) {
      setList(updateEvent(editingId, form))
      setMessage('Event updated.')
    } else {
      setList(addEvent(form))
      setMessage('Event added.')
    }
    reset()
  }

  const startEdit = (ev) => {
    setEditingId(ev.id)
    setForm({ title: ev.title, category: ev.category, date: ev.date, time: ev.time, venue: ev.venue, desc: ev.desc })
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = (ev) => {
    if (!window.confirm(`Delete "${ev.title}"? This cannot be undone.`)) return
    setList(deleteEvent(ev.id))
    if (editingId === ev.id) reset()
    setMessage('Event deleted.')
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-title">Admin dashboard</h1>

        <div className="admin__form-card">
          <h2>{editingId ? 'Edit event' : 'Add a new event'}</h2>
          <form onSubmit={submit} className="admin__form">
            <label>Title<input value={form.title} onChange={set('title')} placeholder="Event name" /></label>
            <label>Category
              <select value={form.category} onChange={set('category')}>
                {Object.entries(categories).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </label>
            <label>Date<input value={form.date} onChange={set('date')} placeholder="Dec 15" /></label>
            <label>Time<input value={form.time} onChange={set('time')} placeholder="10:00 AM" /></label>
            <label>Venue<input value={form.venue} onChange={set('venue')} placeholder="Main Auditorium" /></label>
            <label className="admin__wide">Description
              <textarea rows="3" value={form.desc} onChange={set('desc')} placeholder="Short description of the event" />
            </label>
            {error && <p className="error admin__wide" role="alert">{error}</p>}
            <div className="admin__actions admin__wide">
              <button className="btn btn--primary" type="submit">{editingId ? 'Save changes' : 'Add event'}</button>
              {editingId && <button className="btn btn--outline" type="button" onClick={reset}>Cancel</button>}
            </div>
          </form>
        </div>

        {message && <p className="success" role="status">{message}</p>}

        <h2 style={{ marginTop: 48 }}>All events ({list.length})</h2>
        {list.length === 0 ? (
          <p className="empty">No events yet. Add your first one above.</p>
        ) : (
          <div className="admin__table-wrap">
            <table className="admin__table">
              <thead>
                <tr><th>Title</th><th>Category</th><th>Date</th><th>Venue</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {list.map((ev) => (
                  <tr key={ev.id}>
                    <td><strong>{ev.title}</strong></td>
                    <td>{categories[ev.category]?.label}</td>
                    <td>{ev.date}, {ev.time}</td>
                    <td>{ev.venue}</td>
                    <td className="admin__row-actions">
                      <button className="btn btn--outline btn--small" onClick={() => startEdit(ev)}>Edit</button>
                      <button className="btn btn--danger btn--small" onClick={() => remove(ev)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

// Only admins can open this page
export default function Admin() {
  const user = getCurrentUser()
  if (!user || user.role !== 'admin') return <Navigate to="/login?role=admin" replace />
  return <Panel />
}
