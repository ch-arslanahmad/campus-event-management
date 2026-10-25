import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../assets/AuthContext.jsx'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' }), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const navigate = useNavigate(), location = useLocation(), { login } = useAuth()
  const submit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true)
    try { const user = await login(form); navigate(user.role === 'admin' ? '/dashboard' : '/my-events') } catch (reason) { setError(reason.message) } finally { setBusy(false) }
  }
  return <section className="section login"><div className="login__card"><h1>Log in</h1>{location.state?.registered && <p className="success">Account created. Log in to continue.</p>}<form onSubmit={submit}>
    <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@university.edu" /></label>
    <label>Password<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
    {error && <p className="error" role="alert">{error}</p>}<button className="btn btn--primary btn--block" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
  </form><div className="demo-login"><strong>Seeded accounts</strong><span>sidra.butt@gmail.com / Demo@12345</span><span>ayesha.khan.admin@gmail.com / Demo@12345</span></div><p className="form-switch">New here? <Link to="/signup">Create an account</Link></p></div></section>
}
