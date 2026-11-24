import { useCallback, useEffect, useMemo, useState } from 'react'
import apiClient from '../lib/apiClient'
import { clearToken, getToken, setToken } from '../lib/token'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(() => getToken())
  const [restoring, setRestoring] = useState(() => Boolean(getToken()))

  const clearSession = useCallback(() => {
    clearToken()
    setTokenState(null)
    setUser(null)
    setRestoring(false)
  }, [])

  const applySession = useCallback((data) => {
    const nextToken = data?.token ?? null
    const nextUser = data?.user ?? null
    setToken(nextToken)
    setTokenState(nextToken)
    setUser(nextUser)
    setRestoring(false)
    return nextUser
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      clearSession()
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [clearSession])

  useEffect(() => {
    if (!getToken()) return

    let cancelled = false

    async function restoreSession() {
      try {
        const payload = await apiClient('/api/user')
        if (!cancelled) setUser(payload?.data ?? payload)
      } catch {
        if (!cancelled) clearSession()
      } finally {
        if (!cancelled) setRestoring(false)
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [clearSession])

  const login = useCallback(
    async (credentials) => {
      const payload = await apiClient('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })
      return applySession(payload?.data)
    },
    [applySession],
  )

  const register = useCallback(
    async (input) => {
      const { name, email, password, password_confirmation, role, company_name } = input
      const payload = await apiClient('/api/auth/register', {
        method: 'POST',
        body: {
          name,
          email,
          password,
          password_confirmation,
          role,
          ...(role === 'company' ? { company_name } : {}),
        },
      })
      return applySession(payload?.data)
    },
    [applySession],
  )

  const refreshUser = useCallback(async () => {
    const payload = await apiClient('/api/user')
    const nextUser = payload?.data ?? payload
    setUser(nextUser)
    return nextUser
  }, [])

  const logout = useCallback(async () => {
    try {
      if (getToken()) {
        await apiClient('/api/auth/logout', { method: 'POST' })
      }
    } catch {
      // Token mungkin sudah kedaluwarsa; sesi lokal tetap dibersihkan.
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo(
    () => ({
      user,
      token,
      restoring,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, token, restoring, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
