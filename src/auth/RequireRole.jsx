import { Navigate, useLocation } from 'react-router-dom'
import FullPageLoader from '../components/FullPageLoader'
import { useAuth } from './useAuth'

export default function RequireRole({ role, children }) {
  const { user, restoring } = useAuth()
  const location = useLocation()

  if (restoring) return <FullPageLoader label="Memeriksa sesi..." />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (role && user.role !== role) return <Navigate to="/forbidden" replace />

  return children
}
