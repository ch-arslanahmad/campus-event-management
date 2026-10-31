export class ApiError extends Error {
  constructor(status, message, fields) { super(message); this.status = status; this.fields = fields }
}

// A 401 anywhere except the boot restore means the cookie expired mid-session.
// AuthProvider registers the reset, so no page has to handle it.
const BOOT_PATH = '/auth/me'
let onUnauthorized = () => {}
export const setUnauthorizedHandler = (handler) => { onUnauthorized = handler }

export async function api(path, options = {}) {
  // headers last: a caller passing its own must merge, not replace, Content-Type
  const response = await fetch(`/api${path}`, { credentials: 'include', ...options, headers: { 'Content-Type': 'application/json', ...options.headers } })
  if (response.status === 204) return null
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401 && path !== BOOT_PATH) onUnauthorized()
    throw new ApiError(response.status, body?.message ?? 'Something went wrong. Please try again.', body?.fields)
  }
  return body
}

// one copy: events and registrations had divergent versions, and the one in
// registrations.js forwarded the UI's "all" sentinel to the server as an id
export const query = (values) => {
  const p = new URLSearchParams()
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') p.set(key, value)
  })
  return p.toString() ? `?${p}` : ''
}
