import { api } from './client.js'
const query = (values) => { const p = new URLSearchParams(); Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') p.set(key, value) }); return p.toString() ? `?${p}` : '' }
export const registerForEvent = (eventId) => api('/register', { method: 'POST', body: JSON.stringify({ eventId }) })
export const listRegistrations = (filters = {}) => api(`/registrations${query(filters)}`)
export const cancelRegistration = (id) => api(`/registrations/${id}`, { method: 'DELETE' })
