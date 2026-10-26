import seminar from './seminar.svg'
import workshop from './workshop.svg'
import sports from './sports.svg'
import competition from './competition.svg'

const base = {
  SEMINAR: { label: 'Campus Seminars', blurb: 'Guest talks and academic sessions.', img: seminar, photo: new URL('./photos/seminar.jpg', import.meta.url).href, color: 'var(--blue)' },
  WORKSHOP: { label: 'Workshops', blurb: 'Hands-on sessions to build real skills.', img: workshop, photo: new URL('./photos/workshop.jpg', import.meta.url).href, color: 'var(--coral)' },
  SPORTS: { label: 'Sports Events', blurb: 'Matches, tournaments and fitness days.', img: sports, photo: new URL('./photos/sports.jpg', import.meta.url).href, color: 'var(--mint)' },
  COMPETITION: { label: 'Competitions', blurb: 'Hackathons, quizzes and debates.', img: competition, photo: new URL('./photos/competition.jpg', import.meta.url).href, color: 'var(--sun)' },
  CONFERENCE: { label: 'Conferences', blurb: 'Ideas and research from across campus.', img: seminar, photo: new URL('./photos/seminar.jpg', import.meta.url).href, color: 'var(--blue)' },
  CULTURAL: { label: 'Cultural events', blurb: 'Celebrations, performances and campus life.', img: competition, photo: new URL('./photos/competition.jpg', import.meta.url).href, color: 'var(--coral)' },
}

export const categories = base
export const categoryFor = (value) => base[String(value || '').toUpperCase()] ?? { label: value || 'Campus event', blurb: 'Campus event', img: seminar, photo: new URL('./photos/seminar.jpg', import.meta.url).href, color: 'var(--blue)' }
