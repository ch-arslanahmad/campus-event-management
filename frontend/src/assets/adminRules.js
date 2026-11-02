export const eventCapacity = (event) => Number(event.capacity ?? 100)

export function validateCapacity(capacity, registrationCount) {
  const value = Number(capacity)
  if (!Number.isInteger(value) || value <= 0) return 'Capacity must be a positive whole number.'
  if (value < registrationCount) return `Capacity cannot be lower than the ${registrationCount} existing registration${registrationCount === 1 ? '' : 's'}.`
  return null
}

export function eventStatus(event, registrationCount) {
  if (registrationCount >= eventCapacity(event)) return 'Full'
  return 'Upcoming'
}

// Local calendar date as YYYY-MM-DD (toISOString would use UTC and be a day off near midnight).
export const localToday = (now = new Date()) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

export const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'full', label: 'Full' },
  { value: 'past', label: 'Past' },
]

// past: the date has gone. full: still to come but every seat is taken. upcoming: still to come with seats left.
export function eventState(event, today = localToday()) {
  if (event.date < today) return 'past'
  return Number(event.registeredCount ?? 0) >= eventCapacity(event) ? 'full' : 'upcoming'
}

// Same rules as the student Events page: case-insensitive text search plus an exact category,
// with the extra status filter. 'all' (or empty) means no filter for that field.
export function filterEvents(events, { q = '', category = 'all', status = 'all' } = {}, today = localToday(), labelFor = (value) => value) {
  const needle = String(q).trim().toLowerCase()
  return events.filter((event) => {
    if (category !== 'all' && String(event.category || '').toUpperCase() !== String(category).toUpperCase()) return false
    if (status !== 'all' && eventState(event, today) !== status) return false
    if (!needle) return true
    return [event.title, event.description, event.location, labelFor(event.category)]
      .some((field) => String(field ?? '').toLowerCase().includes(needle))
  })
}
