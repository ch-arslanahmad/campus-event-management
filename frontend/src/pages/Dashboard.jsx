import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../assets/auth.js'
import Admin from './Admin.jsx'

export default function Dashboard() {
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'admin' ? <Admin /> : <Navigate to="/my-events" replace />
}
