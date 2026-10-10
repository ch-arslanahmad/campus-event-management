import { Link } from 'react-router-dom'
import { categories } from '../assets/eventsData.js'

export default function CategoryCard({ type }) {
  const c = categories[type]
  return (
    <Link to={`/events?category=${type}`} className="cat-card" style={{ '--accent': c.color }}>
      <img src={c.img} alt="" />
      <h3>{c.label}</h3>
      <p>{c.blurb}</p>
    </Link>
  )
}
