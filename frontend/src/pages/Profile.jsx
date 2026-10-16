import { Navigate } from 'react-router-dom'
import { getCurrentUser, getProfile } from '../assets/auth.js'

export default function Profile() {
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  const profile = getProfile(user)
  const isAdmin = user.role === 'admin'
  const facts = isAdmin
    ? [['Department', profile.department], ['Employee ID', profile.employeeId], ['Joined', profile.joined]]
    : [['Programme', profile.programme], ['Student ID', profile.studentId], ['Current term', profile.semester]]

  return <section className="section profile-page"><div className="container">
    <p className="eyebrow">{isAdmin ? 'Administrator profile' : 'Student profile'}</p>
    <div className="profile-card">
      <div className="profile-avatar" aria-hidden="true">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
      <div className="profile-intro"><h1>{user.name}</h1><p className="profile-title">{profile.title}</p><p>{user.email}</p></div>
      <span className="role-badge">{isAdmin ? 'Administrator' : 'Student'}</span>
    </div>
    <div className="profile-layout">
      <article className="profile-panel"><h2>About</h2><p>{profile.bio}</p></article>
      <article className="profile-panel"><h2>{isAdmin ? 'Work details' : 'Academic details'}</h2><dl className="profile-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></article>
    </div>
  </div></section>
}
