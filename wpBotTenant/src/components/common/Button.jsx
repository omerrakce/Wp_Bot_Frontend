import Spinner from './Spinner'

export default function Button({ children, onClick, type = 'button', variant = 'primary', loading = false, disabled = false, className = '' }) {
  const styles = {
    primary: { backgroundColor: '#1A1F2E', color: 'white' },
    secondary: { backgroundColor: 'white', color: '#374151', border: '1px solid #E5E7EB' },
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