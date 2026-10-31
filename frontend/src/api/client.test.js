import test from 'node:test'
import assert from 'node:assert/strict'
import { api, ApiError, query, setUnauthorizedHandler } from './client.js'

const stub = (status, body) => {
  globalThis.fetch = async () => ({ status, ok: status < 400, json: async () => body })
}
const track = () => { let hits = 0; setUnauthorizedHandler(() => { hits += 1 }); return () => hits }

test('401 on a data call resets the session', async () => {
  stub(401, { message: 'Authentication required' })
  const hits = track()
  await assert.rejects(() => api('/registrations'), ApiError)
  assert.equal(hits(), 1)
})
test('401 on the boot restore is not treated as expiry', async () => {
  stub(401, {})
  const hits = track()
  await assert.rejects(() => api('/auth/me'), ApiError)
  assert.equal(hits(), 0)
})
test('204 resolves to null', async () => {
  stub(204, null)
  assert.equal(await api('/registrations/1', { method: 'DELETE' }), null)
})
test('query drops empty values and the "all" sentinel', () => {
  assert.equal(query({ page: 0, size: 20, category: 'all', q: '' }), '?page=0&size=20')
})
