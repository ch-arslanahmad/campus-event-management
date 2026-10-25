import { api } from './client.js'
const query = (values) => { const p = new URLSearchParams(); Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '' && value !== 'all') p.set(key, value) }); return p.toString() ? `?${p}` : '' }
export const listEvents = (filters = {}) => api(`/events${query(filters)}`)
export const getEvent = (id) => api(`/events/${id}`)
export const createEvent = (event) => api('/events', { method: 'POST', body: JSON.stringify(event) })
export const updateEvent = (id, event) => api(`/events/${id}`, { method: 'PUT', body: JSON.stringify(event) })
export const deleteEvent = (id) => api(`/events/${id}`, { method: 'DELETE' })
