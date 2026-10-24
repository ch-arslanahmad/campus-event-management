import StudentDashboard from './StudentDashboard.jsx'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../assets/auth.js'

export default function MyEvents() {
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/dashboard" replace />
  return <StudentDashboard user={user} />
}
