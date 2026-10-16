// Demo-only auth stored in the browser. Replace with real API calls and hashed passwords on a backend.
const USERS = 'campuslink_users'
const CURRENT = 'campuslink_current'
// Seed-only demo account. Authentication moves to the backend before deployment.
const ADMIN = {
  name: 'Dr. Ayesha Khan', email: 'admin@campus.com', password: 'admin123', role: 'admin',
  profile: { title: 'Events Administrator', department: 'Student Affairs', employeeId: 'UOL-SA-014', joined: 'August 2024', bio: 'Coordinates campus programmes and helps student societies bring great ideas to life.' },
}
const STUDENT = {
  name: 'Ali Raza', email: 'student@campus.com', password: 'student123', role: 'user',
  profile: { title: 'Computer Science Student', programme: 'BS Computer Science', studentId: 'UOL-2024-CS-118', semester: 'Semester 4', bio: 'Interested in design, technology, and finding new ways to get involved on campus.' },
}

const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const users = () => [ADMIN, STUDENT, ...read(USERS, [])]

export function register({ name, email, password }) {
  const mail = email.trim().toLowerCase()
  if (users().some((u) => u.email === mail)) return 'An account with this email already exists. Log in instead.'
  localStorage.setItem(USERS, JSON.stringify([...read(USERS, []), { name: name.trim(), email: mail, password, role: 'user' }]))
  return null
}

export function login({ email, password, role }) {
  const u = users().find((x) => x.email === email.trim().toLowerCase())
  if (!u || u.password !== password || u.role !== role) return { error: 'Invalid email, password, or account type.' }
  localStorage.setItem(CURRENT, JSON.stringify({ name: u.name, email: u.email, role: u.role }))
  return { user: u }
}

export const getCurrentUser = () => read(CURRENT, null)
export const logout = () => localStorage.removeItem(CURRENT)

export function getProfile(user) {
  const account = users().find((item) => item.email === user?.email)
  return account?.profile ?? {
    title: user?.role === 'admin' ? 'Events Administrator' : 'Campus Student',
    programme: user?.role === 'admin' ? 'Student Affairs' : 'University of Lahore',
    studentId: 'Not set', semester: 'Not set',
    bio: 'Your profile details will be connected to the campus system soon.',
  }
}
