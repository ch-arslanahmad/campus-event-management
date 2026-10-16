/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { getCurrentUser, login as authenticate, logout as clearSession } from './auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())
  const value = useMemo(() => ({
    user,
    login(credentials) {
      const result = authenticate(credentials)
      if (result.user) setUser({ name: result.user.name, email: result.user.email, role: result.user.role })
      return result
    },
    logout() { clearSession(); setUser(null) },
  }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
