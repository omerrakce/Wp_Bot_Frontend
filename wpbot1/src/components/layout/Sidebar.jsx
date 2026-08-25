import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Building2, BarChart2, CreditCard, Settings, X } from 'lucide-react'
import useThemeStore from '../../store/themeStore'
import useLangStore from '../../store/LangStore'
import { t } from '../../i18n'
import logo from '../../assets/HumerSoft-Logo-Variation1-Seffaf.png'

export default function Sidebar({ isOpen, onClose }) {
  const { theme } = useThemeStore()
  const { lang } = useLangStore()
  const isDark = theme === 'dark'

    const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: t(lang, 'dashboard') },
    { to: '/firmalar', icon: Building2, label: t(lang, 'firmalar') },
    { to: '/abonelikler', icon: CreditCard, label: t(lang, 'abonelikler') },
    { to: '/raporlar', icon: BarChart2, label: t(lang, 'raporlar') },
    { to: '/ayarlar', icon: Settings, label: t(lang, 'ayarlar') },
  ]

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
              <img src={logo} alt="HumerSoft"
              style={{ height: '32px', width: 'auto' }} />
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigasyon */}
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

        {/* Alt bilgi */}
        <div className="px-5 py-4 border-t" style={{ borderColor }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>v1.0.0 — {t(lang, 'adminPanel')}</p>
        </div>
      </aside>
    </>
  )
}