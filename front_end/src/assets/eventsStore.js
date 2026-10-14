// Demo event storage in localStorage. Replace with real API calls when you have a backend.
import { events as defaults } from './eventsData.js'

const KEY = 'campuslink_events'
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null } }
const save = (list) => localStorage.setItem(KEY, JSON.stringify(list))

export function getEvents() {
  const stored = read()
  if (stored) return stored
  save(defaults) // first visit: seed with the sample events
  return defaults
}

export function addEvent(data) {
  const list = [{ ...data, id: Date.now() }, ...getEvents()]
  save(list)
  return list
}

export function updateEvent(id, data) {
  const list = getEvents().map((e) => (e.id === id ? { ...e, ...data } : e))
  save(list)
  return list
}

export function deleteEvent(id) {
  const list = getEvents().filter((e) => e.id !== id)
  save(list)
  return list
}
