import { api, query } from './client.js'
export const listEvents = (filters = {}) => api(`/events${query(filters)}`)
export const getEvent = (id) => api(`/events/${id}`)
export const createEvent = (event) => api('/events', { method: 'POST', body: JSON.stringify(event) })
export const updateEvent = (id, event) => api(`/events/${id}`, { method: 'PUT', body: JSON.stringify(event) })
export const deleteEvent = (id) => api(`/events/${id}`, { method: 'DELETE' })
