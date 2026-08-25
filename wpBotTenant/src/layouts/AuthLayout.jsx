import useThemeStore from '../store/themeStore'
import useLangStore from '../store/langStore'
import { t } from '../i18n'
import logo from '../assets/HumerSoft-Logo-Variation1-Seffaf.png'

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
            <img src={logo} alt="HumerSoft" style={{ height: '44px', width: 'auto' }} />
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