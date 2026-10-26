import StudentDashboard from './StudentDashboard.jsx'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../assets/AuthContext.jsx'

export default function MyEvents() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/dashboard" replace />
  return <StudentDashboard user={user} />
}
