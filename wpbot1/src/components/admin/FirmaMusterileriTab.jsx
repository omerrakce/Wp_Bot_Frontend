import { useState, useEffect, useCallback, useRef } from 'react'
import { adminService } from '../../services/adminService'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'
import { gosterTelefon } from '../common/PhoneInput'
import {
  Search, X, ThumbsUp, ThumbsDown, AlertCircle, RefreshCw,
  ArrowLeft, Phone, ImageIcon, ShoppingBag, MousePointerClick, MessageCircle,
} from 'lucide-react'
import useThemeStore from '../../store/themeStore'

const SAYFA_BOYUTU = 20

const butonEtiketCoz = (icerik) => {
  if (!icerik) return null
  if (icerik.startsWith('like_')) return { metin: 'Ürünü beğendi', Icon: ThumbsUp, renk: '#10B981' }
  if (icerik.startsWith('dislike_')) return { metin: 'Ürünü beğenmedi', Icon: ThumbsDown, renk: '#EF4444' }
  if (icerik.startsWith('buy_')) return { metin: 'Satın almak istedi', Icon: ShoppingBag, renk: '#25D366' }
  if (icerik === 'CONNECT_AGENT') return { metin: 'Temsilciye bağlanmak istedi', Icon: MessageCircle, renk: '#F59E0B' }
  if (icerik === 'NEW_SEARCH') return { metin: 'Yeni arama yapmak istedi', Icon: Search, renk: '#3B82F6' }
  if (icerik === 'button_reply') return { metin: 'Bir seçenek seçti', Icon: MousePointerClick, renk: '#9CA3AF' }
  if (/^\d{10,}$/.test(icerik)) return { metin: 'Görsel gönderdi', Icon: ImageIcon, renk: '#3B82F6' }
  return null
}

// content alanındaki ham JSON'ı (product_card / button) çözer
const mesajIcerigiCoz = (icerik) => {
  if (!icerik || typeof icerik !== 'string') return null
  const trimmed = icerik.trim()
  if (!trimmed.startsWith('{')) return null
  try {
    const veri = JSON.parse(trimmed)
    if (veri.type === 'product_card') {
      return {
        tur: 'urun_karti',
        isim: veri.product_name || 'Ürün',
        skor: veri.similarity != null ? Math.round(veri.similarity * 100) : null,
        gorselUrl: veri.image_url || null,
      }
    }
    if (veri.type === 'button') {
      return { tur: 'buton_mesaji', metin: veri.body || 'Buton mesajı' }
    }
    return null
  } catch {
    return null
  }
}

function SohbetGorunumu({ tenantId, musteri, geriDon }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const [mesajlar, setMesajlar] = useState([])
  const [urunGorselleri, setUrunGorselleri] = useState({})
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)
  const sohbetSonuRef = useRef(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'
  const borderColor = isDark ? '#374151' : '#E5E7EB'

  useEffect(() => {
    let iptal = false
    setYukleniyor(true)
    setHata(null)
    Promise.all([
      adminService.tenantMusteriMesajlari(tenantId, musteri.id),
      adminService.tenantUrunleri(tenantId, { sayfa: 1, boyut: 100 }).catch(() => ({ urunler: [] })),
    ])
      .then(([mesajListesi, urunSonuc]) => {
        if (iptal) return
        setMesajlar(mesajListesi)
        const harita = {}
        urunSonuc.urunler.forEach((u) => { harita[u.name] = u.image })
        setUrunGorselleri(harita)
      })
      .catch((e) => { if (!iptal) setHata(e.message) })
      .finally(() => { if (!iptal) setYukleniyor(false) })
    return () => { iptal = true }
  }, [tenantId, musteri.id])

  useEffect(() => {
    if (mesajlar.length > 0 && sohbetSonuRef.current) {
      sohbetSonuRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [mesajlar])

  const mesajZamanFormat = (t) => {
    if (!t) return ''
    try { return new Date(t).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }
    catch { return '' }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button onClick={geriDon} className="p-2 rounded-lg border" style={{ borderColor, color: textSecondary }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="font-semibold" style={{ color: textPrimary }}>{musteri.kod}</p>
          <p className="text-xs flex items-center gap-1" style={{ color: textSecondary }}>
            <Phone className="w-3 h-3" /> {gosterTelefon(musteri.telefon)}
          </p>
        </div>
      </div>

      {hata ? (
        <p className="text-xs text-center py-8" style={{ color: '#EF4444' }}>{hata}</p>
      ) : yukleniyor ? (
        <div className="flex flex-col items-center gap-2 py-10">
          <Spinner size="md" />
          <p className="text-xs" style={{ color: textSecondary }}>Mesajlar yükleniyor...</p>
        </div>
      ) : mesajlar.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: textSecondary }}>Henüz mesaj kaydı yok.</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[26rem] overflow-y-auto pr-1">
          {mesajlar.map((m) => {
            const gelenMi = m.yon === 'in'
            const hizalanma = gelenMi ? 'flex-start' : 'flex-end'
            const baloncukBg = gelenMi ? subtleBg : (isDark ? 'rgba(37,211,102,0.15)' : '#E0F7F7')
            const baloncukRadius = gelenMi ? '12px 12px 12px 2px' : '12px 12px 2px 12px'

            const buton = m.tip === 'interactive' ? butonEtiketCoz(m.interaktif?.button_id || m.icerik) : null
            const cozulenMesaj = !buton ? mesajIcerigiCoz(m.icerik) : null
            const kartGorseli = cozulenMesaj?.tur === 'urun_karti'
              ? (cozulenMesaj.gorselUrl || urunGorselleri[cozulenMesaj.isim] || null)
              : null

            let icerikBlok
            if (m.tip === 'image') {
              const gercekUrlMi = m.medyaUrl && /^https?:\/\//.test(m.medyaUrl)
              icerikBlok = gercekUrlMi ? (
                <img src={m.medyaUrl} alt="görsel" className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none' }} />
              ) : (
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#3B82F6' }} />
                  <p className="text-sm">Görsel gönderdi</p>
                </div>
              )
            } else if (m.tip === 'interactive' && m.interaktif?.type === 'product_list') {
              icerikBlok = (
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 flex-shrink-0" style={{ color: '#25D366' }} />
                  <p className="text-sm">Müşteriye Katalog Ürün Önerisi Gönderildi</p>
                </div>
              )
            } else if (buton) {
              icerikBlok = (
                <div className="flex items-center gap-2">
                  <buton.Icon className="w-4 h-4 flex-shrink-0" style={{ color: buton.renk }} />
                  <p className="text-sm">{buton.metin}</p>
                </div>
              )
            } else if (cozulenMesaj?.tur === 'urun_karti') {
              icerikBlok = (
                <div className="flex items-center gap-2.5">
                  {kartGorseli ? (
                    <img src={kartGorseli} alt={cozulenMesaj.isim}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  ) : (
                    <ShoppingBag className="w-4 h-4 flex-shrink-0" style={{ color: '#25D366' }} />
                  )}
                  <div>
                    <p className="text-sm">{cozulenMesaj.isim}</p>
                    {cozulenMesaj.skor !== null && (
                      <p className="text-xs mt-0.5" style={{ color: textSecondary }}>%{cozulenMesaj.skor} benzerlik</p>
                    )}
                  </div>
                </div>
              )
            } else if (cozulenMesaj?.tur === 'buton_mesaji') {
              icerikBlok = <p className="text-sm">{cozulenMesaj.metin}</p>
            } else {
              icerikBlok = <p className="text-sm whitespace-pre-wrap">{m.icerik || '(boş mesaj)'}</p>
            }

            return (
              <div key={m.id} className="flex flex-col max-w-[75%]" style={{ alignSelf: hizalanma }}>
                <div className="px-3 py-2" style={{ backgroundColor: baloncukBg, color: textPrimary, borderRadius: baloncukRadius }}>
                  {icerikBlok}
                </div>
                <span className="text-xs mt-1 px-1" style={{ color: textSecondary, alignSelf: hizalanma }}>
                  {gelenMi ? 'Müşteri' : 'Bot'} · {mesajZamanFormat(m.tarih)}
                </span>
              </div>
            )
          })}
          <div ref={sohbetSonuRef} />
        </div>
      )}
    </div>
  )
}

export default function FirmaMusterileriTab({ tenantId }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [musteriler, setMusteriler] = useState([])
  const [toplam, setToplam] = useState(0)
  const [arama, setArama] = useState('')
  const [aramaGirdi, setAramaGirdi] = useState('')
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)
  const [seciliMusteri, setSeciliMusteri] = useState(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const theadBg = isDark ? '#111827' : '#F9FAFB'
  const rowHover = isDark ? '#1F2937' : '#F9FAFB'
  const inputBg = isDark ? '#111827' : 'white'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'

  const verileriGetir = useCallback(async (aramaMetni) => {
    setYukleniyor(true)
    setHata(null)
    try {
      const sonuc = await adminService.tenantMusterileri(tenantId, { sayfa: 1, boyut: 50, arama: aramaMetni })
      setMusteriler(sonuc.musteriler)
      setToplam(sonuc.toplam)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [tenantId])

  useEffect(() => {
    const z = setTimeout(() => { setArama(aramaGirdi) }, 400)
    return () => clearTimeout(z)
  }, [aramaGirdi])

  useEffect(() => { verileriGetir(arama) }, [arama, verileriGetir])

  if (seciliMusteri) {
    return <SohbetGorunumu tenantId={tenantId} musteri={seciliMusteri} geriDon={() => setSeciliMusteri(null)} />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textSecondary }} />
          <input type="text" placeholder="Müşteri kodu veya telefon ara..." value={aramaGirdi}
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
        <button onClick={() => verileriGetir(arama)} disabled={yukleniyor}
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
          <p className="text-sm" style={{ color: textSecondary }}>Müşteriler yükleniyor...</p>
        </div>
      ) : musteriler.length === 0 ? (
        <EmptyState title="Müşteri bulunamadı" description="Bu firma için henüz müşteri kaydı yok." />
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: divider }}>
          <table className="w-full text-sm">
            <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
              <tr>
                {['Müşteri', 'Telefon', 'Zevk Etiketleri', 'Beğeni'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                    style={{ color: textSecondary }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {musteriler.map((m) => (
                <tr key={m.id} onClick={() => setSeciliMusteri(m)}
                  className="border-b last:border-0 transition-colors cursor-pointer" style={{ borderColor: divider }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td className="px-4 py-2.5 font-medium" style={{ color: textPrimary }}>{m.kod}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: textSecondary }}>{gosterTelefon(m.telefon)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1 flex-wrap max-w-56">
                      {m.vektorEtiketleri.length === 0
                        ? <span className="text-xs" style={{ color: textSecondary }}>—</span>
                        : m.vektorEtiketleri.slice(0, 3).map((v) => (
                          <span key={v.etiket} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: tagBg, color: textSecondary }}>{v.etiket}</span>
                        ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#10B981' }}>
                        <ThumbsUp className="w-3.5 h-3.5" /> {m.begeni}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#EF4444' }}>
                        <ThumbsDown className="w-3.5 h-3.5" /> {m.begenmeme}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 border-t text-xs" style={{ borderColor: divider, color: textSecondary }}>
            {toplam.toLocaleString('tr-TR')} müşteri
          </div>
        </div>
      )}
    </div>
  )
}