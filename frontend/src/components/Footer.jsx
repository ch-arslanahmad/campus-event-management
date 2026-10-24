import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useAuth } from '../assets/AuthContext.jsx'

export default function Footer() {
  const { user } = useAuth()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Link to="/" className="brand brand--light"><Logo /> University of Lahore</Link>
          <p className="footer__text">Find and join every seminar, workshop, sports event and competition on campus.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/events">All events</Link>
          {!user && <><Link to="/login">User login</Link><Link to="/signup">Create account</Link></>}
          {user?.role === 'user' && <><Link to="/my-events">My events</Link><Link to="/profile">Profile</Link></>}
          {user?.role === 'admin' && <><Link to="/dashboard">Dashboard</Link><Link to="/profile">Profile</Link></>}
        </div>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} University of Lahore. All rights reserved.</p>
    </footer>
  )
}
