import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard.jsx'
import EventCard from '../components/EventCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { categories, events } from '../assets/eventsData.js'
import hero from '../assets/hero.svg'

export default function Home() {
  const heroRef = useRef(null)

  // Parallax: hero artwork and shapes drift at different speeds while scrolling
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => heroRef.current?.style.setProperty('--py', `${window.scrollY * 0.18}px`))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  const names = Object.values(categories).map((c) => c.label)

  return (
    <>
      <section className="hero" ref={heroRef}>
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <span className="blob blob--3" />
        <div className="container hero__inner">
          <div className="hero__text">
            <h1>Everything happening on campus, in one place.</h1>
            <p className="lead">Browse seminars, workshops, sports events and competitions, then register in a few clicks.</p>
            <div className="hero__actions">
              <Link to="/events" className="btn btn--primary">Browse events</Link>
              <Link to="/login" className="btn btn--outline">Log in</Link>
            </div>
          </div>
          <div className="hero__art">
            <img src={hero} alt="Illustration of students joining campus events" className="hero__img" />
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...names, ...names, ...names, ...names].map((n, i) => (
            <span key={i}>{n}<i className="marquee__dot" /></span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <Reveal><h2>Pick a category</h2></Reveal>
          <div className="grid grid--4">
            {Object.keys(categories).map((k, i) => (
              <Reveal key={k} delay={i * 120} from="zoom"><CategoryCard type={k} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <Reveal from="left"><h2>Coming up soon</h2></Reveal>
          <div className="grid grid--3">
            {events.slice(0, 3).map((e, i) => (
              <Reveal key={e.id} delay={i * 140}><EventCard event={e} /></Reveal>
            ))}
          </div>
          <Reveal delay={200}><Link to="/events" className="btn btn--primary" style={{ marginTop: 32 }}>See all events</Link></Reveal>
        </div>
      </section>
    </>
  )
}
