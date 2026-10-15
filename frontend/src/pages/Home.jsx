import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard.jsx'
import EventCard from '../components/EventCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { categories } from '../assets/eventsData.js'
import { getEvents } from '../assets/data.js'
import Photo from '../components/Photo.jsx'

const uol1 = new URL('../assets/photos/uol-1.jpg', import.meta.url).href
const uol2 = new URL('../assets/photos/uol-2.jpg', import.meta.url).href
const uol3 = new URL('../assets/photos/uol-3.jpg', import.meta.url).href
const uol4 = new URL('../assets/photos/uol-4.jpg', import.meta.url).href

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
            <div className="collage">
              <span className="collage__ring" />
              <Photo src={uol1} alt="University of Lahore campus" className="circle circle--main" />
              <Photo src={uol2} alt="University of Lahore students" className="circle circle--a" />
              <Photo src={uol3} alt="University of Lahore library" className="circle circle--b" />
              <Photo src={uol4} alt="University of Lahore ground" className="circle circle--c" />
              <div className="note note--top">
                <strong>All campus events</strong>
                <span>Seminars, workshops, sports and competitions in one place.</span>
              </div>
              <div className="note note--bottom">
                <strong>Register in clicks</strong>
                <span>Browse upcoming events, pick one and join.</span>
              </div>
            </div>
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
            {getEvents().slice(0, 3).map((e, i) => (
              <Reveal key={e.id} delay={i * 140}><EventCard event={e} /></Reveal>
            ))}
          </div>
          <Reveal delay={200}><Link to="/events" className="btn btn--primary" style={{ marginTop: 32 }}>See all events</Link></Reveal>
        </div>
      </section>
    </>
  )
}
