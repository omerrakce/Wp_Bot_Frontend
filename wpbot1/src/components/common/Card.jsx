import useThemeStore from '../../store/themeStore'

export default function Card({ children, className = '', style = {} }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div
      className={`rounded-xl p-6 ${className}`}
      style={{
        backgroundColor: isDark ? '#1F2937' : 'white',
        border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}