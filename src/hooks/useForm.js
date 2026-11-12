import { useCallback, useState } from 'react'
import useMutation from './useMutation'

function normalizeErrors(errors) {
  if (!errors) return {}
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : messages,
    ]),
  )
}

export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const mutation = useMutation(onSubmit)

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!(name in prev)) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const handleChange = useCallback(
    (event) => {
      const { name, type, value, checked, files } = event.target
      if (type === 'file') setValue(name, files)
      else if (type === 'checkbox') setValue(name, checked)
      else setValue(name, value)
    },
    [setValue],
  )

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault?.()

      const nextErrors = normalizeErrors(validate?.(values))
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors)
        return null
      }

      setErrors({})
      try {
        return await mutation.mutate(values)
      } catch (error) {
        setErrors(normalizeErrors(error?.errors))
        return null
      }
    },
    [mutation, validate, values],
  )

  return {
    values,
    errors,
    error: mutation.error,
    formError: mutation.error?.message ?? null,
    submitting: mutation.loading,
    setValues,
    setValue,
    handleChange,
    handleSubmit,
  }
}

export default useForm
