import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { istatistikService } from '../services/istatistikService'
import { firmaService } from '../services/firmaService'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { gosterTelefon, sadeceRakam } from '../components/common/PhoneInput'
import {
  Package, Users, ThumbsUp, ThumbsDown, ArrowRight, Phone,
  ExternalLink, AlertCircle, RefreshCw, CloudOff,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [ozet, setOzet] = useState(null)
  const [sonUrunler, setSonUrunler] = useState([])
  const [sonMusteriler, setSonMusteriler] = useState([])
  const [firma, setFirma] = useState(null)
  const [tezgahtarSayisi, setTezgahtarSayisi] = useState(0)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)
  const [firmaCanli, setFirmaCanli] = useState(true)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#4B5563' : '#D1D5DB'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'
  const borderColor = isDark ? '#374151' : '#E5E7EB'

  const bugun = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const verileriGetir = useCallback(async () => {
    setYukleniyor(true)
    setHata(null)
    try {
      const [ozetSonuc, urunler, musteriler, ayar, staff] = await Promise.all([
        istatistikService.ozet(),
        istatistikService.sonUrunler(4),
        istatistikService.sonMusteriler(4),
        firmaService.ayarlariGetir(),
        firmaService.tezgahtarlariGetir(),
      ])
      setOzet(ozetSonuc)
      setSonUrunler(urunler)
      setSonMusteriler(musteriler)
      setFirma(ayar.veri)
      setFirmaCanli(ayar.canli)
      setTezgahtarSayisi(staff.veri.length)
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
          <p className="text-sm" style={{ color: textSecondary }}>Panel yükleniyor...</p>
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

  const v = ozet.veri
  const urunAlt = v.urunAktif !== null
    ? `${v.urunAktif} aktif · ${v.urunPasif} pasif`
    : 'Katalogdaki toplam kayıt'

  const kartlar = [
    { baslik: 'Toplam Ürün', deger: v.urunToplam.toLocaleString('tr-TR'), alt: urunAlt, icon: Package },
    { baslik: 'Toplam Müşteri', deger: v.musteriToplam.toLocaleString('tr-TR'), alt: 'Bot ile etkileşimde', icon: Users },
    { baslik: 'Toplam Beğeni', deger: v.toplamBegeni.toLocaleString('tr-TR'), alt: 'Ürün görsellerine', icon: ThumbsUp, renk: '#10B981' },
    { baslik: 'Toplam Beğenmeme', deger: v.toplamBegenmeme.toLocaleString('tr-TR'), alt: 'Ürün görsellerine', icon: ThumbsDown, renk: '#EF4444' },
  ]

  const eksikAlanlar = []
  if (firma && sadeceRakam(firma.botTelefon).length !== 10) eksikAlanlar.push('WhatsApp bot numarası')
  if (firma && !firma.sepetLinki) eksikAlanlar.push('Sepet linki')
  if (firma && !firma.katalogLinki) eksikAlanlar.push('Katalog linki')

  const kismenMock = !ozet.musteriCanli || !firmaCanli

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>
            Hoş geldin, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>{bugun}</p>
        </div>
        <button onClick={verileriGetir}
          className="p-2 rounded-lg border transition-colors"
          style={{ borderColor, color: textSecondary }} title="Yenile">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {kismenMock && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl border"
          style={{
            backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
          }}>
          <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
          <p className="text-xs" style={{ color: textSecondary }}>
            Ürün verileri canlı sunucudan geliyor. Müşteri ve firma servisleri henüz hazır olmadığı için
            o bölümlerde örnek veriler gösteriliyor.
          </p>
        </div>
      )}

      {/* İstatistik kartları */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Son eklenen ürünler */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: divider }}>
              <div>
                <h2 className="font-semibold" style={{ color: textPrimary }}>Son Eklenen Ürünler</h2>
                <p className="text-xs mt-0.5" style={{ color: textSecondary }}>Kataloğa en son eklenen kayıtlar</p>
              </div>
              <button onClick={() => navigate('/katalog')}
                className="flex items-center gap-1 text-xs font-medium" style={{ color: '#25D366' }}>
                Tümü <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {sonUrunler.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: textSecondary }}>Henüz ürün yok.</p>
            ) : (
              <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
                {sonUrunler.map((urun) => (
                  <div key={urun.id}
                    onClick={() => navigate('/katalog')}
                    className="flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors"
                    style={{ borderColor: divider }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = subtleBg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <img src={urun.image} alt={urun.name}
                      className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.currentTarget.style.opacity = '0.3' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: textPrimary }}>{urun.name}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: textSecondary }}>
                        {urun.urunKodu} · {urun.category}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold" style={{ color: textPrimary }}>{urun.price}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block"
                        style={urun.status === 'Aktif'
                          ? { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' }
                          : { backgroundColor: tagBg, color: textSecondary }}>
                        {urun.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Firma durumu */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: textPrimary }}>Firma Durumu</h2>
            <button onClick={() => navigate('/firma')}
              className="text-xs font-medium" style={{ color: '#25D366' }}>Düzenle</button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: textSecondary }} />
              <div className="min-w-0">
                <p className="text-xs" style={{ color: textSecondary }}>Bot Numarası</p>
                <p className="text-sm font-medium" style={{ color: textPrimary }}>
                  {firma ? gosterTelefon(firma.botTelefon) : '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-3 border-t" style={{ borderColor: divider }}>
              <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: textSecondary }} />
              <div className="min-w-0">
                <p className="text-xs" style={{ color: textSecondary }}>Yönlendirme</p>
                <p className="text-sm font-medium" style={{ color: textPrimary }}>
                  {firma?.tezgahtarAktif ? `Tezgahtar (${tezgahtarSayisi} kişi)` : 'Online site'}
                </p>
              </div>
            </div>

            {eksikAlanlar.length > 0 ? (
              <div className="flex items-start gap-2.5 p-3 rounded-lg mt-1"
                style={{ backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB' }}>
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
                <div>
                  <p className="text-xs font-medium" style={{ color: textPrimary }}>Eksik bilgi</p>
                  <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{eksikAlanlar.join(', ')}</p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg mt-1" style={{ backgroundColor: subtleBg }}>
                <p className="text-xs" style={{ color: textSecondary }}>Firma bilgileri eksiksiz.</p>
              </div>
            )}
          </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Popüler zevk etiketleri */}
        <Card>
          <h2 className="font-semibold mb-1" style={{ color: textPrimary }}>Öne Çıkan Zevk Sinyalleri</h2>
          <p className="text-xs mb-4" style={{ color: textSecondary }}>
            Müşteri vektörlerinde en sık geçen etiketler
          </p>
          {v.populerEtiketler.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: textSecondary }}>
              Henüz zevk profili oluşmadı.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {v.populerEtiketler.map((e) => (
                <span key={e.etiket}
                  className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  style={{ backgroundColor: tagBg, color: textSecondary }}>
                  {e.etiket}
                  <span className="font-semibold" style={{ color: '#25D366' }}>{e.adet}</span>
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Müşteriler */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: divider }}>
              <h2 className="font-semibold" style={{ color: textPrimary }}>Müşteriler</h2>
              <button onClick={() => navigate('/musteriler')}
                className="flex items-center gap-1 text-xs font-medium" style={{ color: '#25D366' }}>
                Tümü <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {sonMusteriler.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: textSecondary }}>Henüz müşteri yok.</p>
            ) : (
              <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
                {sonMusteriler.map((m, i) => (
                  <div key={m.id ?? i}
                    onClick={() => navigate(`/musteriler/${m.id}`)}
                    className="flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors"
                    style={{ borderColor: divider }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = subtleBg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#090C14' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: textPrimary }}>{m.kod}</p>
                      <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{gosterTelefon(m.telefon)}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#10B981' }}>
                        <ThumbsUp className="w-3.5 h-3.5" /> {m.begeni}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#EF4444' }}>
                        <ThumbsDown className="w-3.5 h-3.5" /> {m.begenmeme}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>

    </div>
  )
}