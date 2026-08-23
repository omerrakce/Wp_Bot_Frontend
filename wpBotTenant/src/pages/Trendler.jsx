import { useState, useEffect, useCallback } from 'react'
import { insightService } from '../services/insightService'
import { urunService } from '../services/urunService'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import {
  Search, AlertTriangle, TrendingUp, RefreshCw, CloudOff,
  ImageIcon, AlertCircle,
} from 'lucide-react'
import useThemeStore from '../store/themeStore'

const PERIYOTLAR = [
  { key: 'hafta', label: 'Bu Hafta' },
  { key: 'ay', label: 'Bu Ay' },
  { key: 'yil', label: 'Bu Yıl' },
]

const ONCELIK_STIL = {
  Kritik: { bg: '#FEF2F2', bgDark: 'rgba(239,68,68,0.15)', renk: '#EF4444' },
  Yüksek: { bg: '#FFFBEB', bgDark: 'rgba(245,158,11,0.15)', renk: '#F59E0B' },
  Orta: { bg: '#EFF6FF', bgDark: 'rgba(59,130,246,0.15)', renk: '#3B82F6' },
  Düşük: { bg: '#F3F4F6', bgDark: '#374151', renk: '#9CA3AF' },
}

export default function Trendler() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [periyot, setPeriyot] = useState('ay')
  const [kayitlar, setKayitlar] = useState([])
  const [trendUrunler, setTrendUrunler] = useState([])
  const [urunler, setUrunler] = useState([])
  const [canli, setCanli] = useState(true)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#6B7280' : '#9CA3AF'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const theadBg = isDark ? '#111827' : '#F9FAFB'
  const rowHover = isDark ? '#1F2937' : '#F9FAFB'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'

  const verileriGetir = useCallback(async (hedefPeriyot) => {
    setYukleniyor(true)
    setHata(null)
    try {
      const [stok, trend, urunSonuc] = await Promise.all([
        insightService.stokAcigi({ periyot: hedefPeriyot }),
        insightService.trendUrunler({ periyot: hedefPeriyot }),
        urunService.listele({ sayfa: 1, boyut: 100 }).catch(() => ({ urunler: [] })),
      ])
      setKayitlar(stok.kayitlar)
      setTrendUrunler(trend.urunler)
      setUrunler(urunSonuc.urunler)
      setCanli(stok.canli && trend.canli)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  useEffect(() => { verileriGetir(periyot) }, [periyot, verileriGetir])

  const urunBul = (id) => urunler.find((u) => String(u.id) === String(id))
  const trendListesi = trendUrunler
    .map((t) => ({ ...t, urun: urunBul(t.urunId) }))
    .filter((t) => t.urun)
    .slice(0, 8)

  const kritikSayisi = kayitlar.filter((k) => k.oncelik === 'Kritik').length

  if (hata) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 py-16">
          <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
          <p className="text-sm font-medium" style={{ color: textPrimary }}>Veriler yüklenemedi</p>
          <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{hata}</p>
          <Button onClick={() => verileriGetir(periyot)}>
            <RefreshCw className="w-4 h-4" /> Tekrar Dene
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Trendler</h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            Müşterilerin aradığı ama bulamadığı ürünler ve popüler modeller
          </p>
        </div>
        <div className="flex items-center gap-2">
          {PERIYOTLAR.map((p) => (
            <button key={p.key} onClick={() => setPeriyot(p.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={periyot === p.key
                ? { backgroundColor: '#1A1F2E', color: 'white' }
                : { backgroundColor: subtleBg, color: textSecondary, border: `1px solid ${borderColor}` }}>
              {p.label}
            </button>
          ))}
          <button onClick={() => verileriGetir(periyot)} disabled={yukleniyor}
            className="p-2 rounded-lg border transition-colors disabled:opacity-40"
            style={{ borderColor, color: textSecondary }}>
            <RefreshCw className={`w-4 h-4 ${yukleniyor ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {!canli && !yukleniyor && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl border"
          style={{
            backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
          }}>
          <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
          <p className="text-xs" style={{ color: textSecondary }}>
            Trend analizi servisi henüz hazır değil. Müşteriler bot üzerinden görsel aramaya
            başladıkça, katalogunuzda eksik olan ürünler ve en çok ilgi gören modeller burada listelenecek.
          </p>
        </div>
      )}

      {yukleniyor ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-16">
            <Spinner size="lg" />
            <p className="text-sm" style={{ color: textSecondary }}>Veriler yükleniyor...</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Özet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#EF4444' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: textSecondary }}>Kritik Stok Açığı</p>
                <p className="text-2xl font-bold" style={{ color: textPrimary }}>{kritikSayisi}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tagBg }}>
                <Search className="w-5 h-5" style={{ color: textSecondary }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: textSecondary }}>Toplam Eşleşmeyen Arama</p>
                <p className="text-2xl font-bold" style={{ color: textPrimary }}>{kayitlar.length}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: isDark ? 'rgba(0,180,180,0.15)' : '#E0F7F7' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#00B4B4' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: textSecondary }}>Trend Ürün Sayısı</p>
                <p className="text-2xl font-bold" style={{ color: textPrimary }}>{trendListesi.length}</p>
              </div>
            </Card>
          </div>

          {/* Stok açığı listesi */}
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: divider }}>
              <h2 className="font-semibold" style={{ color: textPrimary }}>Bulunamayan Aramalar</h2>
              <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                Müşterilerin gönderdiği ama katalogunuzda karşılığı olmayan görsel/ürün istekleri
              </p>
            </div>

            {kayitlar.length === 0 ? (
              <div className="py-10">
                <EmptyState title="Kayıt yok" description="Bu dönemde eşleşmeyen bir arama bulunmadı." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
                    <tr>
                      {['Görsel', 'Arama', 'Kaç Kez', 'Öncelik', 'Son Görülme'].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                          style={{ color: textSecondary }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {kayitlar.map((k) => {
                      const stil = ONCELIK_STIL[k.oncelik] || ONCELIK_STIL.Düşük
                      return (
                        <tr key={k.id} className="border-b transition-colors" style={{ borderColor: divider }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td className="px-5 py-3">
                            {k.gorselUrl ? (
                              <img src={k.gorselUrl} alt="" className="w-10 h-10 rounded-lg object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none' }} />
                            ) : (
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: tagBg }}>
                                <ImageIcon className="w-4 h-4" style={{ color: textTertiary }} />
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3 font-medium" style={{ color: textPrimary }}>{k.aramaMetni}</td>
                          <td className="px-5 py-3" style={{ color: textSecondary }}>{k.adet}</td>
                          <td className="px-5 py-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{ backgroundColor: isDark ? stil.bgDark : stil.bg, color: stil.renk }}>
                              {k.oncelik}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-xs" style={{ color: textTertiary }}>
                            {k.sonGorulme ? new Date(k.sonGorulme).toLocaleDateString('tr-TR') : '-'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Trend ürünler */}
          {trendListesi.length > 0 && (
            <Card>
              <h2 className="font-semibold mb-1" style={{ color: textPrimary }}>En Çok İlgi Gören Ürünler</h2>
              <p className="text-xs mb-4" style={{ color: textSecondary }}>
                Bot tarafından en sık önerilen ve beğenilen modeller
              </p>
              <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
                {trendListesi.map((t) => (
                  <div key={t.urunId} className="flex items-center gap-3 py-3">
                    <img src={t.urun.image} alt={t.urun.name}
                      className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.currentTarget.style.opacity = '0.3' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: textPrimary }}>{t.urun.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{t.urun.urunKodu}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold" style={{ color: '#00B4B4' }}>{t.gosterim} gösterim</p>
                      <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{t.begeni} beğeni</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

    </div>
  )
}