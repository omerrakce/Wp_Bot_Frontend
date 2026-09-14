import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Spinner from '../components/common/Spinner'
import useThemeStore from '../store/themeStore'

export default function PrivateRoute() {
  const { isAuthenticated, hazir, oturumKontrol } = useAuthStore()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!hazir) oturumKontrol()
  }, [hazir, oturumKontrol])

  if (!hazir) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: isDark ? '#090C14' : '#F9FAFB' }}>
        <Spinner size="lg" />
        <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
          Oturum doğrulanıyor...
        </p>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}