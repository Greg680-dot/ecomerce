import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const store = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!store.user && localStorage.getItem('accessToken')) {
      store.fetchProfile()
    }
  }, [store])

  const requireAuth = (redirectTo = '/anmelden') => {
    if (!store.isAuthenticated) {
      navigate(redirectTo, { state: { from: window.location.pathname } })
      return false
    }
    return true
  }

  const requireAdmin = (redirectTo = '/') => {
    if (!store.isAdmin()) {
      navigate(redirectTo)
      return false
    }
    return true
  }

  return {
    ...store,
    requireAuth,
    requireAdmin,
  }
}
