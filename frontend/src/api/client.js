export class ApiError extends Error {
  constructor(status, message, fields) { super(message); this.status = status; this.fields = fields }
}

export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...options.headers }, ...options })
  if (response.status === 204) return null
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, body?.message ?? 'Something went wrong. Please try again.', body?.fields)
  return body
}
