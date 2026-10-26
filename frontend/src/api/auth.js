import { api } from './client.js'
export const login = (credentials) => api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
export const signup = (details) => api('/auth/register', { method: 'POST', body: JSON.stringify(details) })
export const logout = () => api('/auth/logout', { method: 'POST' })
export const currentUser = () => api('/auth/me')
