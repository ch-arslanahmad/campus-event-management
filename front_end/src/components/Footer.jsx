import { Link } from 'react-router-dom'
import { categories } from '../assets/eventsData.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Link to="/" className="brand brand--light"><span className="brand__dot" /> CampusLink</Link>
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
          <Link to="/login">User login</Link>
          <Link to="/login?role=admin">Admin login</Link>
        </div>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} CampusLink. All rights reserved.</p>
    </footer>
  )
}
