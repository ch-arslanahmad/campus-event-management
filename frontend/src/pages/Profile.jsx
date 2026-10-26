import { Navigate } from 'react-router-dom'
import { useAuth } from '../assets/AuthContext.jsx'
export default function Profile() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  const label = user.role === 'admin' ? 'Administrator' : 'Student'
  return <section className="section profile-page"><div className="container"><p className="eyebrow">{label} profile</p><div className="profile-card"><div className="profile-avatar">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div className="profile-intro"><h1>{user.name}</h1><p>{user.email}</p></div><span className="role-badge">{label}</span></div><div className="profile-panel"><h2>Account details</h2><dl className="profile-facts"><div><dt>Name</dt><dd>{user.name}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Role</dt><dd>{label}</dd></div></dl></div></div></section>
}
