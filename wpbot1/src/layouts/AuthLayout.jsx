import useThemeStore from '../store/themeStore'
import useLangStore from '../store/langStore'
import { t } from '../i18n'

export default function AuthLayout({ children }) {
  const { theme } = useThemeStore()
  const { lang } = useLangStore()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: isDark ? '#0F172A' : '#F9FAFB' }}>
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="42" height="42" rx="10" fill={isDark ? '#00B4B4' : '#1A1F2E'} />
              <line x1="11" y1="11" x2="11" y2="31" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="11" y1="21" x2="31" y2="21" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="31" y1="11" x2="31" y2="31" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <circle cx="31" cy="31" r="5" fill={isDark ? '#E0F7F7' : '#00B4B4'} />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '18px', fontWeight: 300, letterSpacing: '2px', lineHeight: 1,
                color: isDark ? '#F9FAFB' : '#1A1F2E',
              }}>
                HUMER<span style={{ fontWeight: 800, color: isDark ? '#00B4B4' : '#1A1F2E' }}>SOFT</span>
              </div>
              <div style={{
                width: '100%', height: '1px', margin: '4px 0',
                background: isDark ? 'rgba(0,180,180,0.3)' : '#E5E7EB',
              }} />
              <div style={{ fontSize: '9px', letterSpacing: '3px', color: isDark ? '#6B7280' : '#9CA3AF' }}>
                TECHNOLOGY
              </div>
            </div>
          </div>
          <p className="text-sm mt-4" style={{ color: isDark ? '#9CA3AF' : '#9CA3AF' }}>
            {t(lang, 'hosgeldinizPanel')}
          </p>
        </div>

        <div className="rounded-2xl p-8"
          style={{
            backgroundColor: isDark ? '#1F2937' : 'white',
            border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
          }}>
          {children}
        </div>

      </div>
    </div>
  )
}