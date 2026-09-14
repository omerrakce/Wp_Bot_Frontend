import { useState } from 'react'
import { mockSorguGecmisi, mockSorguGrafik } from '../mocks/mockData'
import Card from '../components/common/Card'
import { BarChart2, Image, Zap, Users, TrendingUp, Calendar } from 'lucide-react'
import useThemeStore from '../store/themeStore'

const TIPLER = ['Tümü', 'Görsel Arama', 'Günlük Kapsül']
const SONUCLAR = ['Tümü', 'Sıcak Talep', 'Gezindi']
const ZAMAN_FILTRELER = [
  { label: 'Bugün', value: 'bugun' },
  { label: 'Bu Hafta', value: 'hafta' },
  { label: 'Bu Ay', value: 'ay' },
  { label: 'Bu Yıl', value: 'yil' },
  { label: 'Özel', value: 'ozel' },
]

const maxEslesme = Math.max(...mockSorguGrafik.map((g) => g.eslesme))
const zamanCarpan = { bugun: 0.08, hafta: 0.4, ay: 1, yil: 8 }

export default function Sorgular() {
  const [tipFiltre, setTipFiltre] = useState('Tümü')
  const [sonucFiltre, setSonucFiltre] = useState('Tümü')
  const [zamanFiltre, setZamanFiltre] = useState('ay')
  const [ozelBaslangic, setOzelBaslangic] = useState('')
  const [ozelBitis, setOzelBitis] = useState('')
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#4B5563' : '#D1D5DB'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const theadBg = isDark ? '#111827' : '#F9FAFB'
  const rowHover = isDark ? '#1F2937' : '#F9FAFB'
  const inputBg = isDark ? '#111827' : 'white'
  const filterActiveBg = '#090C14'
  const filterInactiveBg = isDark ? '#1F2937' : 'white'
  const filterInactiveBorder = isDark ? '#374151' : '#E5E7EB'

  const carpan = zamanCarpan[zamanFiltre] || 1
  const filtrelenmis = mockSorguGecmisi.filter((s) => {
    const tipUygun = tipFiltre === 'Tümü' || s.tip === tipFiltre
    const sonucUygun = sonucFiltre === 'Tümü' || s.sonuc === sonucFiltre
    return tipUygun && sonucUygun
  })

  const toplamEslesme = Math.round(mockSorguGecmisi.length * carpan * 480)
  const toplamSicakTalep = filtrelenmis.filter((s) => s.sonuc === 'Sıcak Talep').length
  const toplamGorsel = Math.round(filtrelenmis.filter((s) => s.tip === 'Görsel Arama').length * carpan * 200)
  const toplamKapsul = Math.round(filtrelenmis.filter((s) => s.tip === 'Günlük Kapsül').length * carpan * 200)
  const sicakTalepOrani = Math.round((toplamSicakTalep / (filtrelenmis.length || 1)) * 100)
  const zamanLabel = ZAMAN_FILTRELER.find((z) => z.value === zamanFiltre)?.label

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Sorgular</h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>Müşteri eşleştirme geçmişi ve istatistikleri</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {ZAMAN_FILTRELER.map((z) => (
            <button key={z.value} onClick={() => setZamanFiltre(z.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={zamanFiltre === z.value
                ? { backgroundColor: filterActiveBg, color: 'white' }
                : { backgroundColor: filterInactiveBg, color: textSecondary, border: `1px solid ${filterInactiveBorder}` }
              }>
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* Özel Tarih */}
      {zamanFiltre === 'ozel' && (
        <Card>
          <div className="flex items-center gap-4 flex-wrap">
            <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: textSecondary }} />
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: textSecondary }}>Başlangıç</label>
                <input type="date" value={ozelBaslangic} onChange={(e) => setOzelBaslangic(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${filterInactiveBorder}`, color: textPrimary }} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: textSecondary }}>Bitiş</label>
                <input type="date" value={ozelBitis} onChange={(e) => setOzelBitis(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${filterInactiveBorder}`, color: textPrimary }} />
              </div>
              <button className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: filterActiveBg }}>
                Uygula
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Toplam Eşleştirme', value: toplamEslesme.toLocaleString(), icon: BarChart2, desc: zamanLabel },
          { title: 'Görsel Arama', value: toplamGorsel.toLocaleString(), icon: Image, desc: 'Fotoğrafla arama' },
          { title: 'Günlük Kapsül', value: toplamKapsul.toLocaleString(), icon: Zap, desc: 'Otomatik öneri' },
          { title: 'Sıcak Talep', value: toplamSicakTalep, icon: Users, desc: `%${sicakTalepOrani} dönüşüm` },
        ].map((item) => (
          <Card key={item.title} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: isDark ? '#0D2626' : '#E0F7F7' }}>
              <item.icon className="w-6 h-6" style={{ color: '#25D366' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: textSecondary }}>{item.title}</p>
              <p className="text-2xl font-bold" style={{ color: textPrimary }}>{item.value}</p>
              <p className="text-xs mt-0.5" style={{ color: textTertiary }}>{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Grafik */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold" style={{ color: textPrimary }}>Eşleştirme Trendi</h2>
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{zamanLabel} verisi gösteriliyor</p>
          </div>
          <span className="text-xs flex items-center gap-1" style={{ color: textSecondary }}>
            <TrendingUp className="w-4 h-4" /> Son 7 gün
          </span>
        </div>
        <div className="flex items-end gap-3 h-32">
          {mockSorguGrafik.map((item) => {
            const yuzde = Math.round((item.eslesme / maxEslesme) * 100)
            const sicakYuzde = Math.round((item.lead / item.eslesme) * 100)
            return (
              <div key={item.gun} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-md relative" style={{ height: '80px', backgroundColor: isDark ? '#374151' : '#F3F4F6' }}>
                  <div className="absolute bottom-0 w-full rounded-t-md" style={{ height: `${yuzde}%`, backgroundColor: isDark ? '#374151' : '#E0F7F7' }} />
                  <div className="absolute bottom-0 w-full rounded-t-md" style={{ height: `${Math.round(yuzde * sicakYuzde / 100)}%`, backgroundColor: '#25D366' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: textSecondary }}>{item.gun}</span>
                <span className="text-xs" style={{ color: textTertiary }}>{item.lead} talep</span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: isDark ? '#374151' : '#E0F7F7' }} />
            <span className="text-xs" style={{ color: textSecondary }}>Eşleştirme</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#25D366' }} />
            <span className="text-xs" style={{ color: textSecondary }}>Sıcak Talep</span>
          </div>
        </div>
      </Card>

      {/* Filtreler */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: textSecondary }}>Tip:</span>
          {TIPLER.map((tip) => (
            <button key={tip} onClick={() => setTipFiltre(tip)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={tipFiltre === tip
                ? { backgroundColor: filterActiveBg, color: 'white' }
                : { backgroundColor: filterInactiveBg, color: textSecondary, border: `1px solid ${filterInactiveBorder}` }
              }>
              {tip}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: textSecondary }}>Sonuç:</span>
          {SONUCLAR.map((sonuc) => (
            <button key={sonuc} onClick={() => setSonucFiltre(sonuc)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={sonucFiltre === sonuc
                ? { backgroundColor: filterActiveBg, color: 'white' }
                : { backgroundColor: filterInactiveBg, color: textSecondary, border: `1px solid ${filterInactiveBorder}` }
              }>
              {sonuc}
            </button>
          ))}
        </div>
        <span className="text-xs" style={{ color: textSecondary }}>{filtrelenmis.length} kayıt</span>
      </div>

      {/* Tablo */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
              <tr>
                {['Müşteri', 'Sorgu Tipi', 'Eşleştirilen Ürün', 'Sonuç', 'Zaman'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: textSecondary }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrelenmis.map((sorgu) => (
                <tr key={sorgu.id} className="border-b transition-colors" style={{ borderColor: divider }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td className="px-6 py-4 font-medium" style={{ color: textPrimary }}>{sorgu.musteri}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full w-fit"
                      style={sorgu.tip === 'Görsel Arama'
                        ? { backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#EFF6FF', color: '#3B82F6' }
                        : { backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : '#FEF3C7', color: '#D97706' }
                      }>
                      {sorgu.tip === 'Görsel Arama' ? <Image className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                      {sorgu.tip}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ color: textSecondary }}>{sorgu.eslesme}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium"
                      style={sorgu.sonuc === 'Sıcak Talep'
                        ? { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' }
                        : { backgroundColor: isDark ? '#374151' : '#F3F4F6', color: textSecondary }
                      }>
                      {sorgu.sonuc === 'Sıcak Talep' ? '🔥 Sıcak Talep' : '👁 Gezindi'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs" style={{ color: textTertiary }}>{sorgu.zaman}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  )
}