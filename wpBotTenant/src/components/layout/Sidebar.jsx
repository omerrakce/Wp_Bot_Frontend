import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, MessageSquare, Settings, X, BarChart2, Zap, TrendingUp, Users, Building2 } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import useLangStore from '../../store/LangStore'
import { t } from '../../i18n'

const getLinks = (lang) => [
  { to: '/dashboard', icon: LayoutDashboard, label: t(lang, 'dashboard') },
  { to: '/katalog', icon: Package, label: t(lang, 'katalog') },
  { to: '/musteriler', icon: Users, label: t(lang, 'musteriler') },
  { to: '/bot', icon: MessageSquare, label: t(lang, 'botAyarlari') },
  { to: '/firma', icon: Building2, label: 'Firma Bilgileri' },
  { to: '/trendler', icon: TrendingUp, label: 'Trendler' },
  { to: '/ayarlar', icon: Settings, label: t(lang, 'ayarlar') },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { lang } = useLangStore()
  const isDark = theme === 'dark'
  const links = getLinks(lang)

  const sidebarBg = isDark ? '#0F172A' : '#1A1F2E'
  const borderColor = 'rgba(255,255,255,0.08)'

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
        style={{ backgroundColor: sidebarBg }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor }}>
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="42" height="42" rx="10" fill="#00B4B4"/>
              <line x1="11" y1="11" x2="11" y2="31" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <line x1="11" y1="21" x2="31" y2="21" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <line x1="31" y1="11" x2="31" y2="31" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="31" cy="31" r="5" fill="#E0F7F7"/>
            </svg>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 300, color: 'white', letterSpacing: '2px', lineHeight: 1 }}>
                HUMER<span style={{ fontWeight: 800, color: '#00B4B4' }}>SOFT</span>
              </div>
              <div style={{ width: '100%', height: '1px', background: 'rgba(0,180,180,0.3)', margin: '4px 0' }}></div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '3px' }}>TECHNOLOGY</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Firma */}
        <div className="px-5 py-4 border-b" style={{ borderColor }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
            {t(lang, 'firma').toUpperCase()}
          </p>
          <p className="text-sm font-semibold text-white truncate">{user?.company}</p>
          <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(0,180,180,0.15)', color: '#00B4B4' }}>
            {user?.plan}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: '#00B4B4', color: 'white' }
                  : { color: 'rgba(255,255,255,0.45)' }
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t" style={{ borderColor }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>v1.0.0 — Tenant Panel</p>
        </div>
      </aside>
    </>
  )
}