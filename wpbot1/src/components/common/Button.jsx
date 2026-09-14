import Spinner from './Spinner'
import useThemeStore from '../../store/themeStore'

export default function Button({ children, onClick, type = 'button', variant = 'primary', loading = false, disabled = false, className = '' }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const styles = {
    primary: { backgroundColor: '#090C14', color: 'white' },
    secondary: {
      backgroundColor: isDark ? '#1F2937' : 'white',
      color: isDark ? '#D1D5DB' : '#374151',
      border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
    },
    danger: { backgroundColor: '#DC2626', color: 'white' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={styles[variant]}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}