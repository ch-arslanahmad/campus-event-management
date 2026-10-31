/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as auth from '../api/auth.js'
import { ApiError, setUnauthorizedHandler } from '../api/client.js'

const AuthContext = createContext(null)
const normalize = (user) => ({ ...user, role: user.role === 'ADMIN' ? 'admin' : 'user' })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  // an expired cookie mid-session: the client calls this on any 401 that is not
  // the boot restore, so every page gets the same logout + redirect
  useEffect(() => {
    setUnauthorizedHandler(() => { setUser(null); navigate('/login', { replace: true }) })
    return () => setUnauthorizedHandler(() => {})
  }, [navigate])
  useEffect(() => {
    auth.currentUser().then((value) => setUser(normalize(value))).catch((error) => {
      if (!(error instanceof ApiError) || error.status !== 401) console.error(error)
    }).finally(() => setLoading(false))
  }, [])
  const value = useMemo(() => ({
    user, loading,
    async login(credentials) { const result = await auth.login(credentials); const next = normalize(result); setUser(next); return next },
    async signup(details) { const result = await auth.signup(details); const next = normalize(result); setUser(next); return next },
    async logout() { try { await auth.logout() } finally { setUser(null) } },
  }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context }
