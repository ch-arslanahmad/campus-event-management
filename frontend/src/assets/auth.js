// Demo-only auth stored in the browser. Replace with real API calls and hashed passwords on a backend.
const USERS = 'campuslink_users'
const CURRENT = 'campuslink_current'
const ADMIN = { name: 'Admin', email: 'admin@campus.com', password: 'admin123', role: 'admin' }

const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const users = () => [ADMIN, ...read(USERS, [])]

export function register({ name, email, password }) {
  const mail = email.trim().toLowerCase()
  if (users().some((u) => u.email === mail)) return 'An account with this email already exists. Log in instead.'
  localStorage.setItem(USERS, JSON.stringify([...read(USERS, []), { name: name.trim(), email: mail, password, role: 'user' }]))
  return null
}

export function login({ email, password, role }) {
  const u = users().find((x) => x.email === email.trim().toLowerCase())
  if (!u) return { error: 'No account found with this email. Sign up first.' }
  if (u.password !== password) return { error: 'Wrong password. Try again.' }
  if (u.role !== role) return { error: role === 'admin' ? 'This account is not an admin account.' : 'This is an admin account. Use the Admin tab.' }
  localStorage.setItem(CURRENT, JSON.stringify({ name: u.name, email: u.email, role: u.role }))
  return { user: u }
}

export const getCurrentUser = () => read(CURRENT, null)
export const logout = () => localStorage.removeItem(CURRENT)
