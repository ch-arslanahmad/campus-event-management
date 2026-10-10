import seminar from './seminar.svg'
import workshop from './workshop.svg'
import sports from './sports.svg'
import competition from './competition.svg'

export const categories = {
  seminar: { label: 'Campus Seminars', blurb: 'Guest talks and academic sessions.', img: seminar, color: 'var(--blue)' },
  workshop: { label: 'Workshops', blurb: 'Hands-on sessions to build real skills.', img: workshop, color: 'var(--coral)' },
  sports: { label: 'Sports Events', blurb: 'Matches, tournaments and fitness days.', img: sports, color: 'var(--mint)' },
  competition: { label: 'Competitions', blurb: 'Hackathons, quizzes and debates.', img: competition, color: 'var(--sun)' },
}

export const events = [
  { id: 1, title: 'Future of AI in Education', category: 'seminar', date: 'Oct 21', time: '10:00 AM', venue: 'Main Auditorium', desc: 'A guest talk on how AI is changing teaching and research.' },
  { id: 2, title: 'Career Paths in Engineering', category: 'seminar', date: 'Oct 28', time: '1:00 PM', venue: 'Seminar Hall B', desc: 'Alumni share how they landed their first roles.' },
  { id: 3, title: 'Web Design Basics', category: 'workshop', date: 'Nov 2', time: '11:00 AM', venue: 'Computer Lab 2', desc: 'Build and publish your first responsive web page.' },
  { id: 4, title: 'Public Speaking Bootcamp', category: 'workshop', date: 'Nov 9', time: '3:00 PM', venue: 'Room 204', desc: 'Practice delivering clear, confident presentations.' },
  { id: 5, title: 'Inter-Department Cricket Cup', category: 'sports', date: 'Nov 15', time: '9:00 AM', venue: 'University Ground', desc: 'Departments compete for the annual cricket trophy.' },
  { id: 6, title: 'Morning Fun Run 5K', category: 'sports', date: 'Nov 22', time: '7:00 AM', venue: 'Campus Gate 1', desc: 'An open run for students and staff of every pace.' },
  { id: 7, title: '24-Hour Hackathon', category: 'competition', date: 'Dec 1', time: '9:00 AM', venue: 'Innovation Hub', desc: 'Teams build a working prototype in one day.' },
  { id: 8, title: 'Inter-University Debate', category: 'competition', date: 'Dec 8', time: '2:00 PM', venue: 'Main Auditorium', desc: 'Speakers argue the motion in front of a judging panel.' },
]
