import { api, query } from './client.js'
export const registerForEvent = (eventId) => api('/register', { method: 'POST', body: JSON.stringify({ eventId }) })
export const listRegistrations = (filters = {}) => api(`/registrations${query(filters)}`)
export const cancelRegistration = (id) => api(`/registrations/${id}`, { method: 'DELETE' })
