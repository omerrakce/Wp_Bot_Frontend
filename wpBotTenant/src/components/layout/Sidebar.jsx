import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, MessageSquare, Settings, X, BarChart2, Zap, TrendingUp, Users, Building2, Megaphone, Radio } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import useLangStore from '../../store/langStore'
import { t } from '../../i18n'
import logo from "../../assets/humersoft-yatay-seffaf.png";

const getLinks = (lang) => [
  { to: '/dashboard', icon: LayoutDashboard, label: t(lang, 'dashboard') },
  { to: '/katalog', icon: Package, label: t(lang, 'katalog') },
  { to: '/musteriler', icon: Users, label: t(lang, 'musteriler') },
  { to: '/bot', icon: MessageSquare, label: t(lang, 'botAyarlari') },
  { to: '/bot-durumu', icon: Radio, label: 'Bot Durumu' },
  { to: '/firma', icon: Building2, label: 'Firma Bilgileri' },
  { to: '/trendler', icon: TrendingUp, label: 'Trendler' },
  { to: '/kampanyalar', icon: Megaphone, label: 'Kampanyalar' },
  { to: '/ayarlar', icon: Settings, label: t(lang, 'ayarlar') },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { lang } = useLangStore()
  const isDark = theme === 'dark'
  const links = getLinks(lang)

  const sidebarBg = isDark ? '#090C14' : '#090C14'
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
              <img src={logo} alt="HumerSoft"
              style={{ height: '64px', width: 'auto', maxWidth: '100%' }} />
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
            style={{ backgroundColor: 'rgba(37,211,102,0.15)', color: '#25D366' }}>
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
                  ? { backgroundColor: '#25D366', color: 'white' }
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