import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/adminService'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import {
  Users, ImageIcon, ShoppingCart, Smile, BarChart2,
  AlertCircle, RefreshCw, CloudOff, Sparkles,
} from 'lucide-react'
import useThemeStore from '../store/themeStore'
import useLangStore from '../store/LangStore'
import { t } from '../i18n'

const ZAMAN_FILTRELER = [
  { value: 'hafta', label: 'Bu Hafta' },
  { value: 'ay', label: 'Bu Ay' },
  { value: 'yil', label: 'Bu Yıl' },
]

export default function Raporlar() {
  const { theme } = useThemeStore()
  const { lang } = useLangStore()
  const isDark = theme === 'dark'

  const [zamanFiltre, setZamanFiltre] = useState('ay')
  const [rapor, setRapor] = useState(null)
  const [canli, setCanli] = useState(true)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#6B7280' : '#9CA3AF'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const theadBg = isDark ? '#111827' : '#F9FAFB'
  const rowHover = isDark ? '#1F2937' : '#F9FAFB'
  const inputBg = isDark ? '#111827' : 'white'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'

  const verileriGetir = useCallback(async (periyot) => {
    setYukleniyor(true)
    setHata(null)
    try {
      const sonuc = await adminService.raporlar({ periyot })
      setRapor(sonuc.veri)
      setCanli(sonuc.canli)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  useEffect(() => { verileriGetir(zamanFiltre) }, [zamanFiltre, verileriGetir])

  const planStili = (plan) =>
    plan === 'Enterprise' ? { backgroundColor: isDark ? '#374151' : '#1A1F2E', color: 'white' } :
    plan === 'Pro' ? { backgroundColor: isDark ? '#4B5563' : '#374151', color: 'white' } :
    { backgroundColor: tagBg, color: textSecondary }

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
          <p className="text-sm font-medium" style={{ color: textPrimary }}>Raporlar yüklenemedi</p>
          <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{hata}</p>
          <Button onClick={() => verileriGetir(zamanFiltre)}>
            <RefreshCw className="w-4 h-4" /> Tekrar Dene
          </Button>
        </div>
      </Card>
    )
  }

  const { ozet, aylikVeri, planDagilim, firmalar } = rapor
  const eslesmeOrani = ozet.gorselGonderilen
    ? Math.round((ozet.gorselEslesen / ozet.gorselGonderilen) * 100)
    : 0
  const memnuniyet = ozet.degerlendirmeSayisi ? Math.round((ozet.memnunSayisi / ozet.degerlendirmeSayisi) * 100) : 0
  const yeterliOy = ozet.degerlendirmeSayisi >= 30
  const maxGorsel = Math.max(1, ...aylikVeri.map((a) => a.gorsel))
  const toplamPlan = planDagilim.reduce((a, p) => a + p.count, 0) || 1

  const kartlar = [
    { baslik: t(lang, 'erisilenMusteri'), deger: ozet.musteriToplam.toLocaleString('tr-TR'), icon: Users },
    { baslik: t(lang, 'sepeteYonlendirme'), deger: ozet.sepeteYonlendirme.toLocaleString('tr-TR'), icon: ShoppingCart },
    { baslik: 'Görsel İşlendi', deger: ozet.gorselGonderilen.toLocaleString('tr-TR'),
      alt: ozet.gorselGonderilen ? `%${eslesmeOrani} başarılı eşleşme` : 'Veri bekleniyor', icon: ImageIcon },
    { baslik: 'Ürün Önerildi', deger: ozet.onerilenUrunSayisi.toLocaleString('tr-TR'),
      alt: ozet.gorselGonderilen ? `Görsel başına ~${(ozet.onerilenUrunSayisi / ozet.gorselGonderilen).toFixed(1)} ürün` : 'Veri bekleniyor',
      icon: Sparkles },
    { baslik: t(lang, 'memnuniyet'), deger: yeterliOy ? `%${memnuniyet}` : '—',
      alt: yeterliOy ? `${ozet.degerlendirmeSayisi} değerlendirme` : t(lang, 'yetersizVeri'),
      icon: Smile, renk: memnuniyet >= 80 ? '#10B981' : '#F59E0B' },
  ]

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>{t(lang, 'raporlar')}</h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>{t(lang, 'platformVerileri')}</p>
        </div>
        <div className="flex items-center gap-2">
          {ZAMAN_FILTRELER.map((z) => (
            <button key={z.value} onClick={() => setZamanFiltre(z.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={zamanFiltre === z.value
                ? { backgroundColor: '#1A1F2E', color: 'white' }
                : { backgroundColor: inputBg, color: textSecondary, border: `1px solid ${borderColor}` }}>
              {z.label}
            </button>
          ))}
          <button onClick={() => verileriGetir(zamanFiltre)}
            className="p-2 rounded-lg border transition-colors"
            style={{ borderColor, color: textSecondary }}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!canli && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl border"
          style={{
            backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
          }}>
          <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
          <p className="text-xs" style={{ color: textSecondary }}>
            Rapor ucu henüz hazır değil — özet ve firma tablosu mevcut firma verilerinden hesaplandı.
            Aylık grafik bot etkinlik verisi biriktikçe dolacak.
          </p>
        </div>
      )}

      {/* Özet kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kartlar.map((k) => (
          <Card key={k.baslik}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs" style={{ color: textSecondary }}>{k.baslik}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: textPrimary }}>{k.deger}</p>
                {k.alt && <p className="text-xs mt-1" style={{ color: textTertiary }}>{k.alt}</p>}
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tagBg }}>
                <k.icon className="w-4 h-4" style={{ color: k.renk || textSecondary }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Aylık grafik */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold" style={{ color: textPrimary }}>{t(lang, 'aylikEslestirme')}</h2>
              <span className="text-xs flex items-center gap-1" style={{ color: textSecondary }}>
                <BarChart2 className="w-4 h-4" /> {t(lang, 'sonAltiAy')}
              </span>
            </div>
            {aylikVeri.length === 0 ? (
              <p className="text-sm text-center py-14" style={{ color: textSecondary }}>
                Henüz aylık veri birikmedi.
              </p>
            ) : (
              <div className="flex items-end gap-3 h-40">
                {aylikVeri.map((a) => {
                  const yuzde = Math.round((a.gorsel / maxGorsel) * 100)
                  return (
                    <div key={a.ay} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs" style={{ color: textSecondary }}>
                        {a.gorsel >= 1000 ? `${(a.gorsel / 1000).toFixed(1)}k` : a.gorsel}
                      </span>
                      <div className="w-full rounded-t-md relative" style={{ height: '100px', backgroundColor: tagBg }}>
                        <div className="absolute bottom-0 w-full rounded-t-md transition-all"
                          style={{ height: `${yuzde}%`, backgroundColor: '#00B4B4' }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: textSecondary }}>{a.ay}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Plan dağılımı */}
        <Card>
          <h2 className="font-semibold mb-6" style={{ color: textPrimary }}>{t(lang, 'planDagilimi')}</h2>
          <div className="flex flex-col gap-4">
            {planDagilim.map((item) => {
              const yuzde = Math.round((item.count / toplamPlan) * 100)
              return (
                <div key={item.plan}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: textPrimary }}>{item.plan}</span>
                    <span className="text-sm font-medium" style={{ color: textSecondary }}>{item.count} firma</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: tagBg }}>
                    <div className="h-2 rounded-full"
                      style={{ width: `${yuzde}%`, backgroundColor: item.plan === 'Enterprise' ? '#1A1F2E' : item.plan === 'Pro' ? '#4B5563' : '#9CA3AF' }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: textTertiary }}>%{yuzde}</p>
                </div>
              )
            })}
          </div>
        </Card>

      </div>

      {/* Firma bazlı tablo */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: divider }}>
          <h2 className="font-semibold" style={{ color: textPrimary }}>{t(lang, 'firmaBazliPerformans')}</h2>
        </div>
        {firmalar.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: textSecondary }}>Henüz firma yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
                <tr>
                  {[t(lang, 'firma'), t(lang, 'urun'), t(lang, 'erisilenMusteri'), t(lang, 'sepete'),
                    t(lang, 'gorselEslesme'), t(lang, 'memnuniyet')].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                      style={{ color: textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {firmalar.map((f) => {
                  const mem = f.degerlendirmeSayisi ? Math.round((f.memnunSayisi / f.degerlendirmeSayisi) * 100) : 0
                  const esl = f.gorselGonderilen
                    ? Math.min(100, Math.round((f.gorselEslesen / f.gorselGonderilen) * 100))
                    : 0
                  return (
                    <tr key={f.id} className="border-b transition-colors" style={{ borderColor: divider }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td className="px-5 py-3">
                        <p className="font-medium whitespace-nowrap" style={{ color: textPrimary }}>{f.company}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium" style={planStili(f.plan)}>
                          {f.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3" style={{ color: textSecondary }}>{f.urunToplam.toLocaleString('tr-TR')}</td>
                      <td className="px-5 py-3" style={{ color: textSecondary }}>{f.musteriToplam.toLocaleString('tr-TR')}</td>
                      <td className="px-5 py-3" style={{ color: textSecondary }}>{f.sepeteYonlendirme.toLocaleString('tr-TR')}</td>
                      <td className="px-5 py-3 w-44">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium" style={{ color: '#00B4B4' }}>{f.gorselEslesen.toLocaleString('tr-TR')}</span>
                          <span className="text-xs" style={{ color: textTertiary }}>%{esl}</span>
                        </div>
                        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: tagBg }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${esl}%`, backgroundColor: '#00B4B4' }} />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {f.degerlendirmeSayisi >= 30 ? (
                          <span className="text-xs font-semibold px-2 py-1 rounded-full"
                            style={mem >= 80
                              ? { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' }
                              : { backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : '#FFFBEB', color: '#F59E0B' }}>
                            %{mem}
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: textTertiary }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  )
}