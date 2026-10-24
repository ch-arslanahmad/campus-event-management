// Compatibility facade for older pages. New code imports from data.js directly.
export { getEvents, createEvent as addEvent, updateEvent, deleteEvent } from './data.js'
