import { Menu, LogOut, Bell, Search, X, Check, Sun, Moon, Languages } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import useLangStore from '../../store/langStore'
import { mockTenants } from '../../mocks/mockData'
import { t } from '../../i18n'

const bildirimlerTR = [
  { id: 1, baslik: 'Ödeme gecikmesi', mesaj: 'FashionPoint 13 gündür ödeme yapmadı — 2.490 ₺.', zaman: '2 dk önce', okundu: false },
  { id: 2, baslik: 'Ödeme alındı', mesaj: 'TrendStore Ltd. 990 ₺ ödemesini tamamladı.', zaman: '15 dk önce', okundu: false },
  { id: 3, baslik: 'Memnuniyet düşüşü', mesaj: 'FashionPoint memnuniyet oranı %70\'e geriledi.', zaman: '1 saat önce', okundu: false },
  { id: 4, baslik: 'Yeni firma daveti', mesaj: 'StyleHub yeni kullanıcı davetini kabul etti.', zaman: '3 saat önce', okundu: true },
  { id: 5, baslik: 'Plan yükseltildi', mesaj: 'LuxBoutique Enterprise plana geçti.', zaman: 'Dün 18:00', okundu: true },
]

const bildirimlerEN = [
  { id: 1, baslik: 'Payment overdue', mesaj: 'FashionPoint is 13 days late — 2,490 ₺.', zaman: '2 min ago', okundu: false },
  { id: 2, baslik: 'Payment received', mesaj: 'TrendStore Ltd. completed a 990 ₺ payment.', zaman: '15 min ago', okundu: false },
  { id: 3, baslik: 'Satisfaction drop', mesaj: 'FashionPoint satisfaction fell to 70%.', zaman: '1 hour ago', okundu: false },
  { id: 4, baslik: 'Invite accepted', mesaj: 'StyleHub accepted the new user invitation.', zaman: '3 hours ago', okundu: true },
  { id: 5, baslik: 'Plan upgraded', mesaj: 'LuxBoutique moved to the Enterprise plan.', zaman: 'Yesterday 18:00', okundu: true },
]

export default function Navbar({ onMenuClick }) {
  const { user, cikisYap } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { lang, toggleLang } = useLangStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [aramaAcik, setAramaAcik] = useState(false)
  const [aramaMetni, setAramaMetni] = useState('')
  const [bildirimAcik, setBildirimAcik] = useState(false)
  const [okunanlar, setOkunanlar] = useState([])
  const bildirimRef = useRef(null)

  const kaynak = lang === 'tr' ? bildirimlerTR : bildirimlerEN
  const bildirimler = kaynak.map((b) => ({ ...b, okundu: b.okundu || okunanlar.includes(b.id) }))
  const okunmamis = bildirimler.filter((b) => !b.okundu).length

  const sonuclar = aramaMetni.length > 1
    ? mockTenants.filter((f) =>
        f.company.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        f.plan.toLowerCase().includes(aramaMetni.toLowerCase())
      )
    : []

  useEffect(() => {
    const handler = (e) => {
      if (bildirimRef.current && !bildirimRef.current.contains(e.target)) {
        setBildirimAcik(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    cikisYap()
    toast.success(t(lang, 'cikisYapildi'))
    navigate('/login')
  }

  const handleSec = (id) => {
    setAramaAcik(false)
    setAramaMetni('')
    navigate(`/firmalar/${id}`)
  }

  const hepsiniOku = () => setOkunanlar(kaynak.map((b) => b.id))

  const navBg = isDark ? '#111827' : 'white'
  const borderColor = isDark ? '#1F2937' : '#E5E7EB'
  const textPrimary = isDark ? '#F9FAFB' : '#1F2937'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const inputBg = isDark ? '#1F2937' : '#F9FAFB'
  const inputBorder = isDark ? '#374151' : '#E5E7EB'
  const dropdownBg = isDark ? '#1F2937' : 'white'
  const dropdownBorder = isDark ? '#374151' : '#E5E7EB'

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b z-10 relative transition-colors"
      style={{ backgroundColor: navBg, borderColor }}>

      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg transition-colors"
        style={{ color: textSecondary }}>
        <Menu className="w-5 h-5" />
      </button>

      {/* Arama */}
      <div className="hidden lg:flex items-center relative">
        {aramaAcik ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textSecondary }} />
              <input
                autoFocus type="text"
                placeholder={t(lang, 'firmaAra')}
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none w-64"
                style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }}
              />
              {sonuclar.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-xl shadow-lg z-50 overflow-hidden border"
                  style={{ backgroundColor: dropdownBg, borderColor: dropdownBorder }}>
                  {sonuclar.map((firma) => (
                    <button key={firma.id} onClick={() => handleSec(firma.id)}
                      className="w-full flex items-center justify-between px-4 py-3 transition-colors text-left border-b last:border-0"
                      style={{ borderColor: isDark ? '#374151' : '#F3F4F6' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <span className="text-sm font-medium" style={{ color: textPrimary }}>{firma.company}</span>
                      <span className="text-xs" style={{ color: textSecondary }}>{firma.plan}</span>
                    </button>
                  ))}
                </div>
              )}
              {aramaMetni.length > 1 && sonuclar.length === 0 && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-xl shadow-lg z-50 px-4 py-3 border"
                  style={{ backgroundColor: dropdownBg, borderColor: dropdownBorder }}>
                  <p className="text-sm" style={{ color: textSecondary }}>{t(lang, 'sonucBulunamadi')}</p>
                </div>
              )}
            </div>
            <button onClick={() => { setAramaAcik(false); setAramaMetni('') }}
              className="p-2 rounded-lg transition-colors" style={{ color: textSecondary }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => setAramaAcik(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm w-52 transition-colors"
            style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textSecondary }}>
            <Search className="w-4 h-4" />
            {t(lang, 'ara')}...
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">

        {/* Dil */}
        <button onClick={toggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border"
          style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textSecondary }}>
          <Languages className="w-3.5 h-3.5" />
          {lang === 'tr' ? 'TR' : 'EN'}
        </button>

        {/* Tema */}
        <button onClick={toggleTheme} className="p-2 rounded-lg transition-all" style={{ color: textSecondary }}>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Bildirim */}
        <div className="relative" ref={bildirimRef}>
          <button onClick={() => setBildirimAcik(!bildirimAcik)}
            className="p-2 rounded-xl transition-colors relative" style={{ color: textSecondary }}>
            <Bell className="w-5 h-5" />
            {okunmamis > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center font-medium"
                style={{ backgroundColor: '#25D366', fontSize: '10px' }}>{okunmamis}</span>
            )}
          </button>

          {bildirimAcik && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-xl z-50 overflow-hidden border"
              style={{ backgroundColor: dropdownBg, borderColor: dropdownBorder }}>
              <div className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: isDark ? '#374151' : '#F3F4F6' }}>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: textPrimary }}>{t(lang, 'bildirimler')}</h3>
                  {okunmamis > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                      {okunmamis} {t(lang, 'okunmamis')}
                    </p>
                  )}
                </div>
                {okunmamis > 0 && (
                  <button onClick={hepsiniOku}
                    className="flex items-center gap-1 text-xs transition-colors" style={{ color: textSecondary }}>
                    <Check className="w-3 h-3" />
                    {t(lang, 'tumunuOku')}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {bildirimler.map((b) => (
                  <div key={b.id} className="flex items-start gap-3 px-4 py-3 border-b last:border-0"
                    style={{
                      backgroundColor: b.okundu ? 'transparent' : isDark ? '#1a2e2e' : '#F0FDFC',
                      borderColor: isDark ? '#374151' : '#F9FAFB',
                    }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: b.okundu ? (isDark ? '#374151' : '#E5E7EB') : '#25D366' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: textPrimary }}>{b.baslik}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: textSecondary }}>{b.mesaj}</p>
                      <p className="text-xs mt-1" style={{ color: isDark ? '#4B5563' : '#D1D5DB' }}>{b.zaman}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t text-center"
                style={{ borderColor: isDark ? '#374151' : '#F3F4F6', backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
                <button className="text-xs transition-colors" style={{ color: textSecondary }}>
                  {t(lang, 'tumBildirimleri')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Kullanıcı */}
        <div className="flex items-center gap-3 ml-1 pl-3 border-l" style={{ borderColor }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: '#090C14' }}>
            {user?.avatar || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none" style={{ color: textPrimary }}>{user?.name}</p>
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{user?.role}</p>
          </div>
        </div>

        <button onClick={handleLogout}
          className="ml-1 p-2 rounded-xl hover:bg-red-50 transition-colors group" title={t(lang, 'cikisYap')}>
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </header>
  )
}