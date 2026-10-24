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
