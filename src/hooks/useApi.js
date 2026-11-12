import { useCallback, useEffect, useState } from 'react'
import apiClient from '../lib/apiClient'

export function useApi(path, { immediate = true } = {}) {
  const [state, setState] = useState({
    data: null,
    meta: null,
    loading: immediate,
    error: null,
  })

  const execute = useCallback(
    async (options) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const payload = await apiClient(path, options)
        setState({
          data: payload?.data ?? null,
          meta: payload?.meta ?? null,
          loading: false,
          error: null,
        })
        return payload
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error }))
        throw error
      }
    },
    [path],
  )

  useEffect(() => {
    if (!immediate) return
    let cancelled = false

    async function run() {
      await Promise.resolve()
      if (cancelled) return
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const payload = await apiClient(path)
        if (cancelled) return
        setState({
          data: payload?.data ?? null,
          meta: payload?.meta ?? null,
          loading: false,
          error: null,
        })
      } catch (error) {
        if (cancelled) return
        setState((prev) => ({ ...prev, loading: false, error }))
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [path, immediate])

  return { ...state, refetch: execute }
}

export default useApi
