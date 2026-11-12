export const AUTH_TOKEN_KEY = 'auth_token'

export function getToken() {
  return sessionStorage.getItem(AUTH_TOKEN_KEY)
}

export function setToken(token) {
  if (token) sessionStorage.setItem(AUTH_TOKEN_KEY, token)
  else sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

export function clearToken() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
}
