import { Navigate } from 'react-router-dom'
import { useAuth } from '../assets/AuthContext.jsx'
import Admin from './Admin.jsx'
export default function Dashboard() { const { user, loading } = useAuth(); if (loading) return null; if (!user) return <Navigate to="/login" replace />; return user.role === 'admin' ? <Admin /> : <Navigate to="/my-events" replace /> }
