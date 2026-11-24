import { useCallback, useState } from 'react'

export function useMutation(mutationFn, { onSuccess, onError } = {}) {
  const [state, setState] = useState({ loading: false, error: null })

  const mutate = useCallback(
    async (variables) => {
      setState({ loading: true, error: null })
      try {
        const result = await mutationFn(variables)
        setState({ loading: false, error: null })
        onSuccess?.(result, variables)
        return result
      } catch (error) {
        setState({ loading: false, error })
        onError?.(error, variables)
        throw error
      }
    },
    [mutationFn, onSuccess, onError],
  )

  const reset = useCallback(() => {
    setState({ loading: false, error: null })
  }, [])

  return { ...state, mutate, reset }
}

export default useMutation
