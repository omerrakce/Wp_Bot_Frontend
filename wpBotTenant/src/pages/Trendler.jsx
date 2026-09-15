import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { insightService } from '../services/insightService'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import EmptyState from '../components/common/EmptyState'
import Spinner from '../components/common/Spinner'
import {
  AlertCircle, RefreshCw, CloudOff, ImageIcon, Trash2, CheckCircle2,
  TrendingUp, Clock, ThumbsUp, Eye, PackagePlus, 
} from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore from '../store/themeStore'

const SAYFA_BOYUTU = 20

const ONCELIK_RENK = {
  Kritik: '#EF4444',
  Yüksek: '#F59E0B',
  Orta: '#3B82F6',
  Düşük: '#9CA3AF',
}

export default function Trendler() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  // Talepler (eşleşmeyen aramalar)
  const [talepler, setTalepler] = useState([])
  const [toplam, setToplam] = useState(0)
  const [sayfa, setSayfa] = useState(1)
  const [durumFiltre, setDurumFiltre] = useState('pending')
  const [bekleyenSayi, setBekleyenSayi] = useState(null)
  const [incelenenSayi, setIncelenenSayi] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)
  const [canli, setCanli] = useState(true)

  // Trend ürünler (ayrı, dönem filtreli)
  const [periyot, setPeriyot] = useState('ay')
  const [trendUrunler, setTrendUrunler] = useState([])
  const [trendYukleniyor, setTrendYukleniyor] = useState(true)
  const [trendCanli, setTrendCanli] = useState(true)

  // Silme onayı
  const [silinecekTalep, setSilinecekTalep] = useState(null)
  const [siliniyor, setSiliniyor] = useState(false)
  const [islenenId, setIslenenId] = useState(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#6B7280' : '#9CA3AF'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'

  // ---- Talepler ----
  const verileriGetir = useCallback(async (hedefSayfa, durum) => {
    setYukleniyor(true)
    setHata(null)
    try {
      const offset = (hedefSayfa - 1) * SAYFA_BOYUTU
      const status = durum === 'tumu' ? null : durum
      const sonuc = await insightService.talepler({ limit: SAYFA_BOYUTU, offset, status })
      setTalepler(sonuc.talepler)
      setToplam(sonuc.toplam)
      setCanli(sonuc.canli)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  const sayaclariGetir = useCallback(async () => {
    try {
      const [bekleyen, incelenen] = await Promise.all([
        insightService.talepler({ limit: 1, offset: 0, status: 'pending' }),
        insightService.talepler({ limit: 1, offset: 0, status: 'reviewed' }),
      ])
      setBekleyenSayi(bekleyen.toplam)
      setIncelenenSayi(incelenen.toplam)
    } catch {
      // sayaçlar opsiyonel, sessizce geç
    }
  }, [])

  useEffect(() => { verileriGetir(sayfa, durumFiltre) }, [sayfa, durumFiltre, verileriGetir])
  useEffect(() => { sayaclariGetir() }, [sayaclariGetir])

  const toplamSayfa = Math.max(1, Math.ceil(toplam / SAYFA_BOYUTU))

  const handleDurumDegistir = (yeni) => {
    setDurumFiltre(yeni)
    setSayfa(1)
  }

  const handleIncelendiIsaretle = async (talep) => {
    setIslenenId(talep.id)
    try {
      await insightService.talepDurumGuncelle(talep.id, 'reviewed')
      toast.success('Talep incelendi olarak işaretlendi')
      await verileriGetir(sayfa, durumFiltre)
      await sayaclariGetir()
    } catch (e) {
      toast.error(e.message || 'Bu işlem henüz desteklenmiyor')
    } finally {
      setIslenenId(null)
    }
  }

  const handleSilOnayla = async () => {
    setSiliniyor(true)
    try {
      await insightService.talepSil(silinecekTalep.id)
      toast.success('Talep silindi')
      setSilinecekTalep(null)
      const sonSayfa = Math.max(1, Math.ceil((toplam - 1) / SAYFA_BOYUTU))
      setSayfa((s) => Math.min(s, sonSayfa))
      await verileriGetir(Math.min(sayfa, sonSayfa), durumFiltre)
      await sayaclariGetir()
    } catch (e) {
      toast.error(e.message || 'Bu işlem henüz desteklenmiyor')
    } finally {
      setSiliniyor(false)
    }
  }

  // ---- Trend ürünler ----
  const trendGetir = useCallback(async (p) => {
    setTrendYukleniyor(true)
    try {
      const sonuc = await insightService.trendUrunler({ periyot: p })
      setTrendUrunler(sonuc.urunler ?? sonuc.kayitlar ?? [])
      setTrendCanli(sonuc.canli)
    } catch {
      setTrendUrunler([])
      setTrendCanli(false)
    } finally {
      setTrendYukleniyor(false)
    }
  }, [])

  useEffect(() => { trendGetir(periyot) }, [periyot, trendGetir])

  const tarihFormat = (t) => {
    if (!t) return '-'
    try { return new Date(t).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) }
    catch { return '-' }
  }

  const DurumSekmesi = ({ deger, etiket, sayi }) => (
    <button onClick={() => handleDurumDegistir(deger)}
      className="px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5"
      style={durumFiltre === deger
        ? { backgroundColor: '#25D366', color: 'white' }
        : { backgroundColor: subtleBg, color: textSecondary, border: `1px solid ${borderColor}` }}>
      {etiket}
      {sayi !== null && sayi !== undefined && (
        <span className="text-xs opacity-80">({sayi})</span>
      )}
    </button>
  )

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Trendler</h1>
        <p className="text-sm mt-1" style={{ color: textSecondary }}>
          Müşterilerinizin aradığı ama bulamadığı ürünleri takip edin, en çok ilgi gören ürünlerinizi görün
        </p>
      </div>

      {/* ============ TALEP RADARI ============ */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2" style={{ color: textPrimary }}>
              <Clock className="w-4 h-4" style={{ color: textSecondary }} /> Talep Radarı
            </h2>
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
              Bulunamayan aramalar — stok açığı fırsatlarınız
            </p>
          </div>
          <button onClick={() => { verileriGetir(sayfa, durumFiltre); sayaclariGetir() }} disabled={yukleniyor}
            className="p-2 rounded-lg border transition-colors disabled:opacity-40"
            style={{ borderColor, color: textSecondary }}>
            <RefreshCw className={`w-4 h-4 ${yukleniyor ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <DurumSekmesi deger="pending" etiket="Bekleyen" sayi={bekleyenSayi} />
          <DurumSekmesi deger="reviewed" etiket="İncelendi" sayi={incelenenSayi} />
          <DurumSekmesi deger="archived" etiket="Arşivlendi" sayi={null} />
          <DurumSekmesi deger="tumu" etiket="Tümü" sayi={null} />
        </div>

        {!canli && !yukleniyor && !hata && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl border mb-4"
            style={{
              backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
              borderColor: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
            }}>
            <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
            <p className="text-xs" style={{ color: textSecondary }}>
              Talep radarı servisi henüz hazır değil — bu bölüm sunucu güncellenince aktif olacak.
            </p>
          </div>
        )}

        {hata ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <AlertCircle className="w-8 h-8" style={{ color: '#EF4444' }} />
            <p className="text-sm font-medium" style={{ color: textPrimary }}>Talepler yüklenemedi</p>
            <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{hata}</p>
            <Button onClick={() => verileriGetir(sayfa, durumFiltre)}>
              <RefreshCw className="w-4 h-4" /> Tekrar Dene
            </Button>
          </div>
        ) : yukleniyor ? (
          <div className="flex flex-col items-center gap-3 py-14">
            <Spinner size="lg" />
            <p className="text-sm" style={{ color: textSecondary }}>Talepler yükleniyor...</p>
          </div>
        ) : talepler.length === 0 ? (
          <EmptyState
            title={durumFiltre === 'pending' ? 'Bekleyen talep yok' : durumFiltre === 'reviewed' ? 'İncelenen talep yok' : durumFiltre === 'archived' ? 'Arşivlenen talep yok' : 'Talep bulunamadı'}
            description="Müşterileriniz aradığı ama bulamadığı bir ürün olduğunda burada görünecek." />
        ) : (
          <>
            <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
              {talepler.map((talep) => (
                <div key={talep.id} className="flex items-center gap-3 py-3" style={{ borderColor: divider }}>
                  {talep.gorsel ? (
                    <img src={talep.gorsel} alt="Aranan görsel"
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  ) : (
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tagBg }}>
                      <ImageIcon className="w-5 h-5" style={{ color: textTertiary }} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: textPrimary }}>
                      {talep.metin || 'Görsel araması'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                      {talep.adet ?? 1} kez arandı · Son görülme: {tarihFormat(talep.sonGorulme)}
                    </p>
                  </div>

                  {talep.oncelik && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                      style={{ backgroundColor: `${ONCELIK_RENK[talep.oncelik] || textTertiary}1A`, color: ONCELIK_RENK[talep.oncelik] || textTertiary }}>
                      {talep.oncelik}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => navigate('/katalog', { state: { onerilenAd: talep.metin } })}
                      className="p-2 rounded-lg border transition-colors"
                      style={{ borderColor: isDark ? 'rgba(37,211,102,0.3)' : '#BBF7D0', color: '#25D366' }}
                      title="Bu talebe uygun ürün ekle">
                      <PackagePlus className="w-4 h-4" />
                    </button>
                    {talep.durum !== 'reviewed' && (
                      <button onClick={() => handleIncelendiIsaretle(talep)} disabled={islenenId === talep.id}
                        className="p-2 rounded-lg border transition-colors disabled:opacity-40"
                        style={{ borderColor: isDark ? 'rgba(16,185,129,0.3)' : '#A7F3D0', color: '#10B981' }}
                        title="İncelendi olarak işaretle">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setSilinecekTalep(talep)}
                      className="p-2 rounded-lg border transition-colors"
                      style={{ borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#FECACA', color: '#EF4444' }}
                      title="Sil">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {toplamSayfa > 1 && (
              <div className="flex items-center justify-between pt-4 mt-2 border-t flex-wrap gap-3" style={{ borderColor: divider }}>
                <p className="text-xs" style={{ color: textSecondary }}>
                  Sayfa {sayfa} / {toplamSayfa} — toplam {toplam.toLocaleString('tr-TR')} talep
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSayfa((s) => Math.max(1, s - 1))} disabled={sayfa === 1}
                    className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40"
                    style={{ borderColor, color: textSecondary }}>Önceki</button>
                  <button onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))} disabled={sayfa === toplamSayfa}
                    className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40"
                    style={{ borderColor, color: textSecondary }}>Sonraki</button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* ============ TREND ÜRÜNLER ============ */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2" style={{ color: textPrimary }}>
              <TrendingUp className="w-4 h-4" style={{ color: textSecondary }} /> En Çok İlgi Gören Ürünler
            </h2>
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
              Bot tarafından en sık önerilen ve beğenilen ürünleriniz
            </p>
          </div>
          <div className="flex items-center gap-1">
            {[{ v: 'hafta', l: 'Bu Hafta' }, { v: 'ay', l: 'Bu Ay' }, { v: 'yil', l: 'Bu Yıl' }].map((p) => (
              <button key={p.v} onClick={() => setPeriyot(p.v)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={periyot === p.v
                  ? { backgroundColor: '#25D366', color: 'white' }
                  : { backgroundColor: subtleBg, color: textSecondary, border: `1px solid ${borderColor}` }}>
                {p.l}
              </button>
            ))}
          </div>
        </div>

        {!trendCanli && !trendYukleniyor && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl border mb-4"
            style={{
              backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
              borderColor: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
            }}>
            <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
            <p className="text-xs" style={{ color: textSecondary }}>
              Trend ürünler servisi henüz hazır değil.
            </p>
          </div>
        )}

        {trendYukleniyor ? (
          <div className="flex flex-col items-center gap-3 py-14">
            <Spinner size="lg" />
            <p className="text-sm" style={{ color: textSecondary }}>Yükleniyor...</p>
          </div>
        ) : trendUrunler.length === 0 ? (
          <EmptyState title="Henüz trend ürün yok" description="Bot ürünlerinizi önerdikçe burada birikecek." />
        ) : (
          <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
            {trendUrunler.map((urun) => (
              <div key={urun.id} className="flex items-center gap-3 py-3" style={{ borderColor: divider }}>
                {urun.image ? (
                  <img src={urun.image} alt={urun.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { e.currentTarget.style.display = 'none' }} />
                ) : (
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tagBg }}>
                    <ImageIcon className="w-5 h-5" style={{ color: textTertiary }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: textPrimary }}>{urun.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{urun.urunKodu}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs font-medium" style={{ color: textSecondary }}>
                    <Eye className="w-3.5 h-3.5" /> {(urun.gosterimSayisi ?? 0).toLocaleString('tr-TR')}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#10B981' }}>
                    <ThumbsUp className="w-3.5 h-3.5" /> {(urun.begeniSayisi ?? 0).toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Silme Onayı */}
      <Modal isOpen={!!silinecekTalep} onClose={() => setSilinecekTalep(null)} title="Talebi Sil">
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: textSecondary }}>
            <span className="font-semibold" style={{ color: textPrimary }}>
              "{silinecekTalep?.metin || 'Bu talep'}"
            </span> kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setSilinecekTalep(null)} className="flex-1">Vazgeç</Button>
            <Button variant="danger" onClick={handleSilOnayla} loading={siliniyor} className="flex-1">
              {siliniyor ? 'Siliniyor...' : 'Evet, Sil'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}