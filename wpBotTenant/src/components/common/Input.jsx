import useThemeStore from '../../store/themeStore'

export default function Input({ label, type = 'text', placeholder, value, onChange, error, className = '' }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium" style={{ color: isDark ? '#D1D5DB' : '#374151' }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors ${className}`}
        style={{
          backgroundColor: isDark ? '#111827' : 'white',
          border: `1px solid ${error ? '#EF4444' : isDark ? '#374151' : '#E5E7EB'}`,
          color: isDark ? '#F9FAFB' : '#1F2937',
        }}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}