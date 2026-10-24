// Demo data gateway. Keep pages talking to these functions so a future API can
// replace localStorage without changing the UI.
import { events as seedEvents } from './eventsData.js'

const EVENTS_KEY = 'campuslink_events'
const REGISTRATIONS_KEY = 'campuslink_registrations'

const read = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export function getEvents() {
  const stored = read(EVENTS_KEY, null)
  if (stored) return stored
  write(EVENTS_KEY, seedEvents)
  return seedEvents
}

export const getEventById = (id) => getEvents().find((event) => String(event.id) === String(id))

export function createEvent(data) {
  const list = [{ ...data, id: Date.now() }, ...getEvents()]
  write(EVENTS_KEY, list)
  return list
}

export function updateEvent(id, data) {
  const list = getEvents().map((event) => (String(event.id) === String(id) ? { ...event, ...data } : event))
  write(EVENTS_KEY, list)
  return list
}

export function deleteEvent(id) {
  if (getRegistrations().some((registration) => String(registration.eventId) === String(id))) {
    return { error: 'This event has active registrations. Cancel or move those registrations before deleting it.' }
  }
  const list = getEvents().filter((event) => String(event.id) !== String(id))
  write(EVENTS_KEY, list)
  return { list }
}

export const getRegistrations = () => read(REGISTRATIONS_KEY, [])

export function register({ eventId, name, email, capacity }) {
  const normalizedEmail = email.trim().toLowerCase()
  const registrations = getRegistrations()
  const eventRegistrations = registrations.filter((item) => String(item.eventId) === String(eventId))

  if (eventRegistrations.some((item) => item.email.toLowerCase() === normalizedEmail)) {
    return { error: 'You are already registered for this event.' }
  }
  if (Number.isFinite(capacity) && eventRegistrations.length >= capacity) {
    return { error: 'This event is now full.' }
  }

  const registration = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    eventId: Number(eventId),
    name: name.trim(),
    email: normalizedEmail,
    registrationDate: new Date().toISOString(),
  }
  write(REGISTRATIONS_KEY, [...registrations, registration])
  return { registration }
}

export function cancelRegistration(id) {
  const list = getRegistrations().filter((registration) => registration.id !== id)
  write(REGISTRATIONS_KEY, list)
  return list
}
