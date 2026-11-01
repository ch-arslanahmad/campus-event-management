import { Navigate } from 'react-router-dom'
import { useAuth } from '../assets/AuthContext.jsx'
import StudentDashboard from './StudentDashboard.jsx'
export default function MyEvents() { const { user, loading } = useAuth(); if (loading) return null; if (!user) return <Navigate to="/login" replace />; return user.role === 'admin' ? <Navigate to="/dashboard" replace /> : <StudentDashboard user={user} /> }
