import { clearToken, getToken } from './token'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export async function apiClient(path, options = {}) {
  const { method = 'GET', body, headers = {}, raw = false } = options
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...headers,
    },
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (raw) {
    if (!response.ok) {
      throw new ApiError('Gagal mengunduh file.', { status: response.status })
    }
    return response
  }

  const payload = await response.json().catch(() => null)

  if (response.status === 401) {
    clearToken()
    window.dispatchEvent(new Event('auth:unauthorized'))
  }

  if (!response.ok) {
    throw new ApiError(payload?.message ?? 'Terjadi kesalahan.', {
      status: response.status,
      errors: payload?.errors,
    })
  }

  return payload
}

export default apiClient
