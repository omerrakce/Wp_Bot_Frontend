import { Menu, LogOut, Bell, Check, Sun, Moon, Languages } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import useAuthStore from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useThemeStore from '../../store/themeStore'
import useLangStore from '../../store/langStore'

const mockBildirimler = [
  { id: 1, baslik: 'Yeni beğeni', mesaj: 'MŞT-1042 "Siyah Deri Ceket" ürününü beğendi.', zaman: '3 dk önce', okundu: false },
  { id: 2, baslik: 'Yeni müşteri profili', mesaj: 'MŞT-1039 bot ile ilk etkileşimini tamamladı.', zaman: '22 dk önce', okundu: false },
  { id: 3, baslik: 'Zevk vektörü güncellendi', mesaj: 'MŞT-1041 profilinde "Nötr ton" sinyali güçlendi.', zaman: '1 saat önce', okundu: false },
  { id: 4, baslik: 'Ürün beğenilmedi', mesaj: 'MŞT-1040 "Mavi Kot Pantolon" ürününü beğenmedi.', zaman: '3 saat önce', okundu: true },
  { id: 5, baslik: 'Katalog güncellendi', mesaj: '3 yeni ürün kataloğa eklendi.', zaman: 'Dün 18:00', okundu: true },
]

export default function Navbar({ onMenuClick }) {
  const { user, cikisYap } = useAuthStore()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore()
  const { lang, toggleLang } = useLangStore()
  const [bildirimAcik, setBildirimAcik] = useState(false)
  const [bildirimler, setBildirimler] = useState(mockBildirimler)
  const bildirimRef = useRef(null)

  const okunmamis = bildirimler.filter((b) => !b.okundu).length
  const isDark = theme === 'dark'

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
    toast.success('Çıkış yapıldı')
    navigate('/login')
  }

  const hepsiniOku = () => {
    setBildirimler((prev) => prev.map((b) => ({ ...b, okundu: true })))
  }

  return (
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-6 border-b z-10 relative transition-colors"
      style={{
        backgroundColor: isDark ? '#111827' : 'white',
        borderColor: isDark ? '#1F2937' : '#E5E7EB',
      }}
    >
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg transition-colors"
        style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-1">

        {/* Dil Değiştirici */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border"
          style={{
            backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
            borderColor: isDark ? '#374151' : '#E5E7EB',
            color: isDark ? '#D1D5DB' : '#374151',
          }}
          title={lang === 'tr' ? 'Switch to English' : 'Türkçeye Geç'}
        >
          <Languages className="w-3.5 h-3.5" />
          {lang === 'tr' ? 'TR' : 'EN'}
        </button>

        {/* Tema Değiştirici */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-all"
          style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
          title={isDark ? 'Açık tema' : 'Koyu tema'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Bildirim */}
        <div className="relative" ref={bildirimRef}>
          <button
            onClick={() => setBildirimAcik(!bildirimAcik)}
            className="p-2 rounded-xl transition-colors relative"
            style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
          >
            <Bell className="w-5 h-5" />
            {okunmamis > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center font-medium"
                style={{ backgroundColor: '#00B4B4', fontSize: '10px' }}>
                {okunmamis}
              </span>
            )}
          </button>

          {bildirimAcik && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-xl z-50 overflow-hidden border"
              style={{
                backgroundColor: isDark ? '#1F2937' : 'white',
                borderColor: isDark ? '#374151' : '#E5E7EB',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: isDark ? '#374151' : '#F3F4F6' }}>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: isDark ? '#F9FAFB' : '#1F2937' }}>
                    {lang === 'tr' ? 'Bildirimler' : 'Notifications'}
                  </h3>
                  {okunmamis > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}>
                      {okunmamis} {lang === 'tr' ? 'okunmamış' : 'unread'}
                    </p>
                  )}
                </div>
                {okunmamis > 0 && (
                  <button onClick={hepsiniOku} className="flex items-center gap-1 text-xs transition-colors"
                    style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}>
                    <Check className="w-3 h-3" />
                    {lang === 'tr' ? 'Tümünü oku' : 'Mark all read'}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {bildirimler.map((b) => (
                  <div key={b.id} className="flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors"
                    style={{
                      backgroundColor: b.okundu
                        ? 'transparent'
                        : isDark ? '#1a2e2e' : '#F0FDFC',
                      borderColor: isDark ? '#374151' : '#F9FAFB',
                    }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: b.okundu ? (isDark ? '#374151' : '#E5E7EB') : '#00B4B4' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: isDark ? '#F9FAFB' : '#1F2937' }}>{b.baslik}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: isDark ? '#6B7280' : '#6B7280' }}>{b.mesaj}</p>
                      <p className="text-xs mt-1" style={{ color: isDark ? '#4B5563' : '#D1D5DB' }}>{b.zaman}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t text-center"
                style={{ borderColor: isDark ? '#374151' : '#F3F4F6', backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
                <button className="text-xs transition-colors" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}>
                  {lang === 'tr' ? 'Tüm bildirimleri gör' : 'View all notifications'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Kullanıcı */}
        <div className="flex items-center gap-3 ml-1 pl-3 border-l"
          style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#1A1F2E' }}>
            {user?.avatar || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none" style={{ color: isDark ? '#F9FAFB' : '#1F2937' }}>{user?.name}</p>
            <p className="text-xs mt-0.5" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}>{user?.role}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="ml-1 p-2 rounded-xl hover:bg-red-50 transition-colors group" title="Çıkış Yap">
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </header>
  )
}