import test from 'node:test'
import assert from 'node:assert/strict'
import { eventCapacity, eventState, eventStatus, filterEvents, validateCapacity } from './adminRules.js'

test('capacity must be a positive whole number', () => {
  assert.equal(validateCapacity(0, 0), 'Capacity must be a positive whole number.')
  assert.equal(validateCapacity(12, 0), null)
})
test('capacity cannot be reduced below existing registrations', () => assert.match(validateCapacity(2, 3), /cannot be lower/i))
test('event status reflects capacity handling', () => {
  assert.equal(eventCapacity({}), 100)
  assert.equal(eventStatus({ capacity: 2 }, 2), 'Full')
})

const TODAY = '2026-11-02'
const sample = [
  { id: 1, title: 'Future of AI', description: 'Guest talk', category: 'SEMINAR', location: 'Main Auditorium', date: '2026-11-10', capacity: 10, registeredCount: 3 },
  { id: 2, title: 'Cricket Cup', description: 'Final match', category: 'SPORTS', location: 'Ground', date: '2026-11-05', capacity: 5, registeredCount: 5 },
  { id: 3, title: 'Web Design', description: 'Hands on', category: 'WORKSHOP', location: 'Lab 2', date: '2026-10-20', capacity: 5, registeredCount: 1 },
]
test('event state is past, full or upcoming', () => {
  assert.deepEqual(sample.map((event) => eventState(event, TODAY)), ['upcoming', 'full', 'past'])
  assert.equal(eventState({ date: TODAY, capacity: 2, registeredCount: 0 }, TODAY), 'upcoming')
})
test('filters by status', () => {
  assert.deepEqual(filterEvents(sample, { status: 'full' }, TODAY).map((event) => event.id), [2])
  assert.deepEqual(filterEvents(sample, { status: 'past' }, TODAY).map((event) => event.id), [3])
})
test('filters by category, ignoring case', () => {
  assert.deepEqual(filterEvents(sample, { category: 'workshop' }, TODAY).map((event) => event.id), [3])
  assert.equal(filterEvents(sample, { category: 'all' }, TODAY).length, 3)
})
test('search matches title, description, location and category label, ignoring case and spaces', () => {
  const label = (value) => ({ SPORTS: 'Sports Events' })[value] ?? value
  assert.deepEqual(filterEvents(sample, { q: '  cricket ' }, TODAY, label).map((event) => event.id), [2])
  assert.deepEqual(filterEvents(sample, { q: 'lab 2' }, TODAY, label).map((event) => event.id), [3])
  assert.deepEqual(filterEvents(sample, { q: 'sports events' }, TODAY, label).map((event) => event.id), [2])
})
test('filters combine, and an empty result is an empty list', () => {
  assert.deepEqual(filterEvents(sample, { q: 'a', category: 'SPORTS', status: 'full' }, TODAY).map((event) => event.id), [2])
  assert.deepEqual(filterEvents(sample, { category: 'SPORTS', status: 'past' }, TODAY), [])
})
