import { Link } from 'react-router-dom'
import { categories } from '../assets/eventsData.js'
import Logo from './Logo.jsx'
import { useAuth } from '../assets/AuthContext.jsx'

export default function Footer() {
  const { user, logout } = useAuth()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Link to="/" className="brand brand--light"><Logo /> University of Lahore</Link>
          <p className="footer__text">Find and join every seminar, workshop, sports event and competition on campus.</p>
        </div>
        <div>
          <h4>Categories</h4>
          {Object.entries(categories).map(([key, c]) => (
            <Link key={key} to={`/events?category=${key}`}>{c.label}</Link>
          ))}
        </div>
        <div>
          <h4>Account</h4>
          {!user && <><Link to="/login">User login</Link><Link to="/signup">Create account</Link></>}
          {user?.role === 'user' && <><Link to="/my-events">My events</Link><Link to="/events">Browse events</Link><Link to="/" onClick={logout}>Log out</Link></>}
          {user?.role === 'admin' && <><Link to="/dashboard">Dashboard</Link><Link to="/admin">Manage events</Link><Link to="/" onClick={logout}>Log out</Link></>}
        </div>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} University of Lahore. All rights reserved.</p>
    </footer>
  )
}
