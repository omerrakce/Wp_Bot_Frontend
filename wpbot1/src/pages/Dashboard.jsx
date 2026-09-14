import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService, kullanimSagligi } from '../services/adminService'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import {
  Building2, Users, ImageIcon, Smile, ArrowRight,
  AlertCircle, RefreshCw, AlertTriangle
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'
import useLangStore from '../store/LangStore'
import { t } from '../i18n'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { lang } = useLangStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [ozet, setOzet] = useState(null)
  const [firmalar, setFirmalar] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#6B7280' : '#9CA3AF'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const theadBg = isDark ? '#111827' : '#F9FAFB'
  const rowHover = isDark ? '#1F2937' : '#F9FAFB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'
  const borderColor = isDark ? '#374151' : '#E5E7EB'

  const bugun = new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const verileriGetir = useCallback(async () => {
    setYukleniyor(true)
    setHata(null)
    try {
      const [stats, firmaSonuc] = await Promise.all([
        adminService.platformIstatistik(),
        adminService.firmalariGetir({ sayfa: 1, boyut: 10 }),
      ])
      setOzet(stats)
      setFirmalar(firmaSonuc.firmalar)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  useEffect(() => { verileriGetir() }, [verileriGetir])

  if (yukleniyor) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 py-20">
          <Spinner size="lg" />
          <p className="text-sm" style={{ color: textSecondary }}>{t(lang, 'yukleniyor')}</p>
        </div>
      </Card>
    )
  }

  if (hata) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 py-16">
          <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
          <p className="text-sm font-medium" style={{ color: textPrimary }}>Panel yüklenemedi</p>
          <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{hata}</p>
          <Button onClick={verileriGetir}>
            <RefreshCw className="w-4 h-4" /> Tekrar Dene
          </Button>
        </div>
      </Card>
    )
  }

  const eslesmeOrani = ozet.gorselGonderilen
    ? Math.round((ozet.gorselEslesen / ozet.gorselGonderilen) * 100) : 0
  const memnuniyet = ozet.degerlendirmeSayisi
    ? Math.round((ozet.memnunSayisi / ozet.degerlendirmeSayisi) * 100) : 0
  const yeterliOy = ozet.degerlendirmeSayisi >= 30

  const kartlar = [
    { baslik: t(lang, 'toplamFirma'), deger: ozet.firmaToplam.toLocaleString('tr-TR'),
      alt: `${ozet.firmaAktif} ${t(lang, 'aktif').toLowerCase()}`, icon: Building2 },
    { baslik: t(lang, 'erisilenMusteri'), deger: ozet.musteriToplam.toLocaleString('tr-TR'),
      alt: `${ozet.sepeteYonlendirme.toLocaleString('tr-TR')} ${t(lang, 'sepete')}`, icon: Users },
    { baslik: t(lang, 'eslesenGorsel'), deger: ozet.gorselEslesen.toLocaleString('tr-TR'),
      alt: ozet.gorselGonderilen ? `%${eslesmeOrani} ${t(lang, 'eslesmeOrani').toLowerCase()}` : 'Veri bekleniyor',
      icon: ImageIcon },
    { baslik: t(lang, 'memnuniyet'), deger: yeterliOy ? `%${memnuniyet}` : '—',
      alt: yeterliOy ? `${ozet.degerlendirmeSayisi.toLocaleString('tr-TR')} ${t(lang, 'degerlendirme')}` : t(lang, 'yetersizVeri'),
      icon: Smile, renk: memnuniyet >= 80 ? '#10B981' : '#F59E0B' },
  ]

  const planStili = (plan) =>
    plan === 'Enterprise' ? { backgroundColor: isDark ? '#374151' : '#090C14', color: 'white' } :
    plan === 'Pro' ? { backgroundColor: isDark ? '#4B5563' : '#374151', color: 'white' } :
    { backgroundColor: tagBg, color: textSecondary }

  const oran = (f) => f.degerlendirmeSayisi
    ? Math.round((f.memnunSayisi / f.degerlendirmeSayisi) * 100) : 0

  const pasifFirmalar = firmalar.filter((f) => kullanimSagligi(f).seviye === 'pasif')

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>
            {t(lang, 'hosgeldin')}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>{bugun}</p>
        </div>
        <button onClick={verileriGetir}
          className="p-2 rounded-lg border transition-colors"
          style={{ borderColor, color: textSecondary }}>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kartlar.map((k) => (
          <Card key={k.baslik}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm" style={{ color: textSecondary }}>{k.baslik}</p>
                <p className="text-3xl font-bold mt-1" style={{ color: textPrimary }}>{k.deger}</p>
                <p className="text-xs mt-1.5" style={{ color: textTertiary }}>{k.alt}</p>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tagBg }}>
                <k.icon className="w-4 h-4" style={{ color: k.renk || textSecondary }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {pasifFirmalar.length > 0 && (
        <div onClick={() => navigate('/firmalar')}
          className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border flex-wrap cursor-pointer transition-colors"
          style={{
            backgroundColor: isDark ? 'rgba(245,158,11,0.06)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(245,158,11,0.2)' : '#FDE68A',
          }}>
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} />
            <p className="text-sm" style={{ color: textPrimary }}>
              <span className="font-semibold">{pasifFirmalar.length} firma</span> botu aktif kullanmıyor
            </p>
          </div>
          <span className="text-xs font-medium flex items-center gap-1 flex-shrink-0" style={{ color: '#F59E0B' }}>
            İncele <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      )}
      
      {/* Firma tablosu */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: divider }}>
          <div>
            <h2 className="font-semibold" style={{ color: textPrimary }}>{t(lang, 'firmaPerformansi')}</h2>
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{t(lang, 'platformOzet')}</p>
          </div>
          <button onClick={() => navigate('/firmalar')}
            className="flex items-center gap-1 text-xs font-medium" style={{ color: '#25D366' }}>
            {t(lang, 'tumunuGor')} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {firmalar.length === 0 ? (
          <p className="text-sm text-center py-12" style={{ color: textSecondary }}>
            Henüz firma kaydı yok.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
                <tr>
                  {[t(lang, 'firma'), t(lang, 'urun'), t(lang, 'erisilenMusteri'),
                    t(lang, 'sepete'), t(lang, 'eslesenGorsel'), t(lang, 'memnuniyet')].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                      style={{ color: textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {firmalar.map((f) => (
                  <tr key={f.id}
                    onClick={() => navigate(`/firmalar/${f.id}`)}
                    className="border-b transition-colors cursor-pointer" style={{ borderColor: divider }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td className="px-5 py-3">
                      <p className="font-medium whitespace-nowrap" style={{ color: textPrimary }}>{f.company}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={planStili(f.plan)}>{f.plan}</span>
                    </td>
                    <td className="px-5 py-3" style={{ color: textSecondary }}>{f.urunToplam.toLocaleString('tr-TR')}</td>
                    <td className="px-5 py-3" style={{ color: textSecondary }}>{f.musteriToplam.toLocaleString('tr-TR')}</td>
                    <td className="px-5 py-3" style={{ color: textSecondary }}>{f.sepeteYonlendirme.toLocaleString('tr-TR')}</td>
                    <td className="px-5 py-3">
                      <span className="font-medium" style={{ color: '#25D366' }}>
                        {f.gorselEslesen.toLocaleString('tr-TR')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {f.degerlendirmeSayisi >= 30 ? (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={oran(f) >= 80
                            ? { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' }
                            : { backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : '#FFFBEB', color: '#F59E0B' }
                          }>%{oran(f)}</span>
                      ) : (
                        <span className="text-xs" style={{ color: textTertiary }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  )
}