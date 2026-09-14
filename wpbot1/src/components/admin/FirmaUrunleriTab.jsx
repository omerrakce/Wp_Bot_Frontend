import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../services/adminService'
import Card from '../common/Card'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'
import { Search, X, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'
import useThemeStore from '../../store/themeStore'

const SAYFA_BOYUTU = 20

const tlFormat = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 })

export default function FirmaUrunleriTab({ tenantId }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [urunler, setUrunler] = useState([])
  const [toplam, setToplam] = useState(0)
  const [sayfa, setSayfa] = useState(1)
  const [arama, setArama] = useState('')
  const [aramaGirdi, setAramaGirdi] = useState('')
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const theadBg = isDark ? '#111827' : '#F9FAFB'
  const rowHover = isDark ? '#1F2937' : '#F9FAFB'
  const inputBg = isDark ? '#111827' : 'white'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'

  const verileriGetir = useCallback(async (hedefSayfa, aramaMetni) => {
    setYukleniyor(true)
    setHata(null)
    try {
      const sonuc = await adminService.tenantUrunleri(tenantId, { sayfa: hedefSayfa, boyut: SAYFA_BOYUTU, arama: aramaMetni })
      setUrunler(sonuc.urunler)
      setToplam(sonuc.toplam)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [tenantId])

  useEffect(() => {
    const z = setTimeout(() => { setSayfa(1); setArama(aramaGirdi) }, 400)
    return () => clearTimeout(z)
  }, [aramaGirdi])

  useEffect(() => { verileriGetir(sayfa, arama) }, [sayfa, arama, verileriGetir])

  const toplamSayfa = Math.max(1, Math.ceil(toplam / SAYFA_BOYUTU))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textSecondary }} />
          <input type="text" placeholder="Ürün adı veya kodu ara..." value={aramaGirdi}
            onChange={(e) => setAramaGirdi(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm rounded-lg outline-none"
            style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textPrimary }} />
          {aramaGirdi && (
            <button onClick={() => setAramaGirdi('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded" style={{ color: textSecondary }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button onClick={() => verileriGetir(sayfa, arama)} disabled={yukleniyor}
          className="p-2 rounded-lg border transition-colors disabled:opacity-40"
          style={{ borderColor, color: textSecondary }}>
          <RefreshCw className={`w-4 h-4 ${yukleniyor ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {hata ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <AlertCircle className="w-8 h-8" style={{ color: '#EF4444' }} />
          <p className="text-xs text-center" style={{ color: textSecondary }}>{hata}</p>
        </div>
      ) : yukleniyor ? (
        <div className="flex flex-col items-center gap-3 py-14">
          <Spinner size="lg" />
          <p className="text-sm" style={{ color: textSecondary }}>Ürünler yükleniyor...</p>
        </div>
      ) : urunler.length === 0 ? (
        <EmptyState title="Ürün bulunamadı" description="Bu firma henüz ürün eklememiş." />
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: divider }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
                <tr>
                  {['Ürün', 'Kod', 'Kategori', 'Renk', 'Stok', 'Fiyat', 'Durum'].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                      style={{ color: textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {urunler.map((u) => (
                  <tr key={u.id} className="border-b last:border-0 transition-colors" style={{ borderColor: divider }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        {u.image ? (
                          <img src={u.image} alt={u.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => { e.currentTarget.style.opacity = '0.2' }} />
                        ) : (
                          <div className="w-9 h-9 rounded-lg flex-shrink-0" style={{ backgroundColor: tagBg }} />
                        )}
                        <span className="font-medium whitespace-nowrap" style={{ color: textPrimary }}>{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: tagBg, color: textSecondary }}>{u.urunKodu}</span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: textSecondary }}>{u.category}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: textSecondary }}>{u.renk}</td>
                    <td className="px-4 py-2.5" style={{ color: textSecondary }}>{u.stock}</td>
                    <td className="px-4 py-2.5 font-semibold whitespace-nowrap" style={{ color: textPrimary }}>{tlFormat.format(u.price)}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={u.status === 'Aktif'
                          ? { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' }
                          : { backgroundColor: tagBg, color: textSecondary }}>{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {toplamSayfa > 1 && (
            <div className="flex items-center justify-between px-4 py-2.5 border-t flex-wrap gap-2" style={{ borderColor: divider }}>
              <p className="text-xs" style={{ color: textSecondary }}>
                Sayfa {sayfa} / {toplamSayfa} — toplam {toplam.toLocaleString('tr-TR')} ürün
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setSayfa((s) => Math.max(1, s - 1))} disabled={sayfa === 1}
                  className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor, color: textSecondary }}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-medium" style={{ color: textPrimary }}>{sayfa}</span>
                <button onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))} disabled={sayfa === toplamSayfa}
                  className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor, color: textSecondary }}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}