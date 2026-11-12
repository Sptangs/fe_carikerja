import { useMemo, useState } from 'react'
import useApi from './useApi'

export function usePaginated(path, initialFilters = {}) {
  const [page, setPage] = useState(1)
  const [filters, setFiltersState] = useState(initialFilters)

  const url = useMemo(() => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.set(key, value)
      }
    })
    const query = params.toString()
    return query ? `${path}?${query}` : path
  }, [path, page, filters])

  const result = useApi(url)

  function setFilters(next) {
    setFiltersState((prev) => ({ ...prev, ...next }))
    setPage(1)
  }

  return { ...result, page, setPage, filters, setFilters }
}

export default usePaginated
