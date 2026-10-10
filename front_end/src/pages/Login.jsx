import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { login } from '../assets/auth.js'

export default function Login() {
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') === 'admin' ? 'admin' : 'user')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const submit = (e) => {
    e.preventDefault()
    if (!form.email || form.password.length < 6) {
      setError('Enter your email and a password of at least 6 characters.')
      return
    }
    const res = login({ ...form, role })
    if (res.error) { setError(res.error); return }
    navigate('/events')
  }

  return (
    <section className="section login">
      <div className="login__card">
        <h1>Log in</h1>
        {location.state?.registered && <p className="success" role="status">Account created. Log in to continue.</p>}
        <div className="tabs" role="tablist">
          {['user', 'admin'].map((r) => (
            <button key={r} role="tab" aria-selected={role === r} className={`tab ${role === r ? 'is-active' : ''}`} onClick={() => setRole(r)}>
              {r === 'user' ? 'Student / User' : 'Admin'}
            </button>
          ))}
        </div>
        <form onSubmit={submit}>
          <label>Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@university.edu" />
          </label>
          <label>Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--block" type="submit">Log in as {role === 'admin' ? 'admin' : 'user'}</button>
        </form>
        {role === 'user' && <p className="form-switch">New here? <Link to="/signup">Create an account</Link></p>}
      </div>
    </section>
  )
}
