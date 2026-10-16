import { Link } from 'react-router-dom'

export default function NotFound() {
  return <section className="section not-found"><div className="container state-card">
    <p className="eyebrow">Error 404</p><h1>Page not found</h1>
    <p className="lead">The page you are looking for does not exist, has moved, or is no longer available.</p>
    <div className="hero__actions"><Link to="/" className="btn btn--primary">Go home</Link><Link to="/events" className="btn btn--outline">Browse events</Link></div>
  </div></section>
}
