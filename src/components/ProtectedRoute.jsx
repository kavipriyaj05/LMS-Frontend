import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ requiredRole }) {
  const { user, token, loading } = useAuth()

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (!token) return <Navigate to="/login" replace />

  if (requiredRole && user?.userType !== requiredRole) {
    const redirect = user?.userType === 'MANAGER' ? '/manager' : '/employee'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}