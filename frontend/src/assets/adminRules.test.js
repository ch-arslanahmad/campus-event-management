import test from 'node:test'
import assert from 'node:assert/strict'
import { eventCapacity, eventStatus, validateCapacity } from './adminRules.js'

test('capacity must be a positive whole number', () => {
  assert.equal(validateCapacity(0, 0), 'Capacity must be a positive whole number.')
  assert.equal(validateCapacity(12, 0), null)
})
test('capacity cannot be reduced below existing registrations', () => assert.match(validateCapacity(2, 3), /cannot be lower/i))
test('event status reflects capacity handling', () => {
  assert.equal(eventCapacity({}), 100)
  assert.equal(eventStatus({ capacity: 2 }, 2), 'Full')
})
