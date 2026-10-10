import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../assets/auth.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const bar = useRef(null)
  const header = useRef(null)
  useLocation() // re-read the logged-in user after every page change
  const navigate = useNavigate()
  const user = getCurrentUser()
  const close = () => setOpen(false)
  const signOut = () => { logout(); close(); navigate('/') }

  // Scroll progress bar + shadow once the page is scrolled
  useEffect(() => {
    let raf = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
      header.current?.classList.toggle('is-scrolled', window.scrollY > 10)
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <header className="navbar" ref={header}>
      <div className="progress" ref={bar} />
      <div className="container navbar__inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand__dot" /> CampusLink
        </Link>
        <button className="navbar__toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav className={`navbar__links ${open ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/events" onClick={close}>Events</NavLink>
          {user ? (
            <>
              <span className="navbar__user">Hi, {user.name}{user.role === 'admin' ? ' (admin)' : ''}</span>
              <button className="btn btn--outline btn--small" onClick={signOut}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--outline btn--small" onClick={close}>Log in</Link>
              <Link to="/signup" className="btn btn--primary btn--small" onClick={close}>Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
