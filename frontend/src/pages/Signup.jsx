import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../assets/auth.js'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return setError('Enter your name and email.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    const err = register(form)
    if (err) return setError(err)
    navigate('/login', { state: { registered: true } })
  }

  return (
    <section className="section login">
      <div className="login__card">
        <h1>Create account</h1>
        <p className="form-note">Sign up as a student or user. Admin accounts are created by an existing admin.</p>
        <form onSubmit={submit}>
          <label>Full name
            <input type="text" value={form.name} onChange={set('name')} placeholder="Your full name" />
          </label>
          <label>Email
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@university.edu" />
          </label>
          <label>Password
            <input type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" />
          </label>
          <label>Confirm password
            <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat your password" />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--block" type="submit">Create account</button>
        </form>
        <p className="form-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </section>
  )
}
