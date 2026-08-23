import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { musteriService } from '../services/musteriService'
import { urunService } from '../services/urunService'
import { mockProducts } from '../mocks/mockData'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { gosterTelefon } from '../components/common/PhoneInput'
import {
  ArrowLeft, ThumbsUp, ThumbsDown, Phone, AlertCircle, RefreshCw,
  CloudOff, ImageIcon, ShoppingCart, MessageCircle, Search, Star,
} from 'lucide-react'
import useThemeStore from '../store/themeStore'

const OLAY_IKON = {
  image_received: ImageIcon,
  match_shown: Search,
  product_liked: ThumbsUp,
  product_disliked: ThumbsDown,
  cart_redirect: ShoppingCart,
  agent_connect: MessageCircle,
  similar_search: Search,
  rating_given: Star,
  no_match: AlertCircle,
}

export default function MusteriDetay() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [musteri, setMusteri] = useState(null)
  const [urunler, setUrunler] = useState([])
  const [olaylar, setOlaylar] = useState([])
  const [olaylarCanli, setOlaylarCanli] = useState(true)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)
  const [canliMi, setCanliMi] = useState(true)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const barBg = isDark ? '#374151' : '#F3F4F6'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'

  const verileriGetir = useCallback(async () => {
    setYukleniyor(true)
    setHata(null)
    try {
      const sonuc = await musteriService.detay(id)
      setMusteri(sonuc.musteri)
      setCanliMi(sonuc.canli)

      if (sonuc.canli) {
        try {
          const liste = await urunService.listele({ sayfa: 1, boyut: 100 })
          setUrunler(liste.urunler)
        } catch {
          setUrunler(mockProducts)
        }
      } else {
        setUrunler(mockProducts)
      }

      const zaman = await musteriService.zaman_cizelgesi(id)
      setOlaylar(zaman.olaylar)
      setOlaylarCanli(zaman.canli)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [id])

  useEffect(() => { verileriGetir() }, [verileriGetir])

  if (yukleniyor) {
    return (
      <div className="max-w-2xl">
        <Card>
          <div className="flex flex-col items-center gap-3 py-16">
            <Spinner size="lg" />
            <p className="text-sm" style={{ color: textSecondary }}>Müşteri profili yükleniyor...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (hata || !musteri) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
        <p className="text-sm font-medium" style={{ color: textPrimary }}>
          {hata || 'Müşteri bulunamadı.'}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/musteriler')}>
            <ArrowLeft className="w-4 h-4" /> Geri Dön
          </Button>
          {hata && (
            <Button onClick={verileriGetir}>
              <RefreshCw className="w-4 h-4" /> Tekrar Dene
            </Button>
          )}
        </div>
      </div>
    )
  }

  const urunBul = (urunId) => urunler.find((u) => String(u.id) === String(urunId))
  const begenilen = musteri.begenilenUrunler.map(urunBul).filter(Boolean)
  const begenilmeyen = musteri.begenilmeyenUrunler.map(urunBul).filter(Boolean)

  const zamanFormat = (t) => {
    if (!t) return '-'
    try {
      const tarih = new Date(t)
      const simdi = new Date()
      const farkDk = Math.round((simdi - tarih) / 60000)
      if (farkDk < 1) return 'az önce'
      if (farkDk < 60) return `${farkDk} dk önce`
      const farkSaat = Math.round(farkDk / 60)
      if (farkSaat < 24) return `${farkSaat} saat önce`
      return tarih.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })
    } catch { return '-' }
  }

  const UrunSatiri = ({ urun }) => (
    <div className="flex items-center gap-3 py-2.5" style={{ borderColor: divider }}>
      <img src={urun.image} alt={urun.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        onError={(e) => { e.currentTarget.style.opacity = '0.3' }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: textPrimary }}>{urun.name}</p>
        <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{urun.renk} · {urun.category}</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {/* Başlık */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/musteriler')}
          className="p-2 rounded-xl transition-colors border" style={{ borderColor: divider }}>
          <ArrowLeft className="w-5 h-5" style={{ color: textSecondary }} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>{musteri.kod}</h1>
          <p className="text-sm mt-0.5 flex items-center gap-1.5" style={{ color: textSecondary }}>
            <Phone className="w-3.5 h-3.5" /> {gosterTelefon(musteri.telefon)}
          </p>
        </div>
        <button onClick={verileriGetir}
          className="p-2 rounded-lg border transition-colors"
          style={{ borderColor, color: textSecondary }} title="Yenile">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {!canliMi && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl border"
          style={{
            backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
          }}>
          <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
          <p className="text-xs" style={{ color: textSecondary }}>
            Müşteri servisi henüz hazır değil — örnek veri gösteriliyor.
          </p>
        </div>
      )}

      {/* Son Aktiviteler (Timeline) */}
      <Card>
        <h2 className="font-semibold mb-1" style={{ color: textPrimary }}>Son Aktiviteler</h2>
        <p className="text-xs mb-4" style={{ color: textSecondary }}>
          Müşterinin bot ile gerçekleşen etkileşim geçmişi
        </p>

        {!olaylarCanli ? (
          <div className="flex items-start gap-2.5 p-3 rounded-lg"
            style={{ backgroundColor: subtleBg }}>
            <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: textSecondary }} />
            <p className="text-xs" style={{ color: textSecondary }}>
              Etkinlik geçmişi servisi henüz hazır değil. Bot ile ilk etkileşim gerçekleştiğinde
              burada müşterinin attığı görseller, önerilen ürünler ve verdiği tepkiler
              zaman sırasıyla listelenecek.
            </p>
          </div>
        ) : olaylar.length === 0 ? (
          <p className="text-sm py-6 text-center" style={{ color: textSecondary }}>
            Bu müşteri için henüz kayıtlı etkinlik yok.
          </p>
        ) : (
          <div className="flex flex-col">
            {olaylar.map((olay, i) => {
              const Icon = OLAY_IKON[olay.tip] || AlertCircle
              const ilgiliUrun = olay.urunId ? urunBul(olay.urunId) : null
              return (
                <div key={olay.id ?? i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${olay.renk}1A` }}>
                      <Icon className="w-4 h-4" style={{ color: olay.renk }} />
                    </div>
                    {i < olaylar.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ backgroundColor: divider, minHeight: '16px' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium" style={{ color: textPrimary }}>{olay.baslik}</p>
                      <span className="text-xs flex-shrink-0" style={{ color: textSecondary }}>
                        {zamanFormat(olay.tarih)}
                      </span>
                    </div>
                    {ilgiliUrun && (
                      <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{ilgiliUrun.name}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Alışveriş Vektörü */}
      <Card>
        <h2 className="font-semibold mb-1" style={{ color: textPrimary }}>Alışveriş Vektörü</h2>
        <p className="text-xs mb-4" style={{ color: textSecondary }}>
          Müşterinin geçmiş etkileşimlerinden çıkarılan zevk sinyalleri
        </p>
        {musteri.vektorEtiketleri.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: textSecondary }}>
            Bu müşteri için henüz zevk profili oluşmadı.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {musteri.vektorEtiketleri.map((v) => (
              <div key={v.etiket}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm" style={{ color: textPrimary }}>{v.etiket}</span>
                  <span className="text-xs font-semibold" style={{ color: textSecondary }}>%{v.skor}</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ backgroundColor: barBg }}>
                  <div className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${v.skor}%`, backgroundColor: '#00B4B4' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Beğeni Durumu */}
      <Card>
        <h2 className="font-semibold mb-1" style={{ color: textPrimary }}>Beğeni Durumu</h2>
        <p className="text-xs mb-4" style={{ color: textSecondary }}>
          WhatsApp üzerinden ürün görsellerine verilen tepkiler
        </p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#ECFDF5' }}>
            <ThumbsUp className="w-5 h-5 flex-shrink-0" style={{ color: '#10B981' }} />
            <div>
              <p className="text-xl font-bold" style={{ color: textPrimary }}>{musteri.begeni}</p>
              <p className="text-xs" style={{ color: textSecondary }}>Beğendi</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2' }}>
            <ThumbsDown className="w-5 h-5 flex-shrink-0" style={{ color: '#EF4444' }} />
            <div>
              <p className="text-xl font-bold" style={{ color: textPrimary }}>{musteri.begenmeme}</p>
              <p className="text-xs" style={{ color: textSecondary }}>Beğenmedi</p>
            </div>
          </div>
        </div>

        {begenilen.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium mb-1 flex items-center gap-1.5" style={{ color: '#10B981' }}>
              <ThumbsUp className="w-3.5 h-3.5" /> Beğendiği ürünler
            </p>
            <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
              {begenilen.map((urun) => <UrunSatiri key={urun.id} urun={urun} />)}
            </div>
          </div>
        )}

        {begenilmeyen.length > 0 && (
          <div className="pt-4 border-t" style={{ borderColor: divider }}>
            <p className="text-xs font-medium mb-1 flex items-center gap-1.5" style={{ color: '#EF4444' }}>
              <ThumbsDown className="w-3.5 h-3.5" /> Beğenmediği ürünler
            </p>
            <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
              {begenilmeyen.map((urun) => <UrunSatiri key={urun.id} urun={urun} />)}
            </div>
          </div>
        )}

        {begenilen.length === 0 && begenilmeyen.length === 0 && (
          <p className="text-sm py-2 text-center" style={{ color: textSecondary }}>
            Henüz ürün bazlı tepki kaydı yok.
          </p>
        )}
      </Card>

    </div>
  )
}