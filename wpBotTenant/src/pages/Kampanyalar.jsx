import { useState, useEffect, useCallback } from 'react'
import { kampanyaService } from '../services/kampanyaService'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import EmptyState from '../components/common/EmptyState'
import Spinner from '../components/common/Spinner'
import {
  Plus, Send, Trash2, Upload, X, RefreshCw, CloudOff,
  AlertCircle, Megaphone, ImageIcon, Users, Calendar,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore from '../store/themeStore'

const bosForm = { baslik: '', metin: '' }

const Anahtar = ({ acik, onChange, isDark }) => (
  <button type="button" onClick={onChange}
    className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
    style={{ backgroundColor: acik ? '#00B4B4' : (isDark ? '#374151' : '#E5E7EB') }}>
    <span className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
      style={{ left: acik ? '22px' : '4px' }} />
  </button>
)

export default function Kampanyalar() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [kampanyalar, setKampanyalar] = useState([])
  const [canli, setCanli] = useState(true)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [silOnayModal, setSilOnayModal] = useState(false)
  const [broadcastOnayModal, setBroadcastOnayModal] = useState(false)
  const [seciliKampanya, setSeciliKampanya] = useState(null)

  const [form, setForm] = useState(bosForm)
  const [preview, setPreview] = useState(null)
  const [dosya, setDosya] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const [kaydediyor, setKaydediyor] = useState(false)
  const [siliniyor, setSiliniyor] = useState(false)
  const [gonderiliyor, setGonderiliyor] = useState(false)
  const [degisenId, setDegisenId] = useState(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#6B7280' : '#9CA3AF'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const inputBg = isDark ? '#111827' : 'white'
  const tagBg = isDark ? '#374151' : '#F3F4F6'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'

  const verileriGetir = useCallback(async () => {
    setYukleniyor(true)
    setHata(null)
    try {
      const sonuc = await kampanyaService.listele()
      setKampanyalar(sonuc.kampanyalar)
      setCanli(sonuc.canli)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  useEffect(() => { verileriGetir() }, [verileriGetir])

  const handleFile = (secilen) => {
    if (!secilen) return
    if (!secilen.type.startsWith('image/')) { toast.error('Sadece görsel dosyası yükleyebilirsiniz'); return }
    setDosya(secilen)
    setPreview(URL.createObjectURL(secilen))
  }
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }

  const resetForm = () => { setForm(bosForm); setPreview(null); setDosya(null) }
  const handleClose = () => {
    setModalOpen(false); setSilOnayModal(false); setBroadcastOnayModal(false)
    setSeciliKampanya(null); resetForm()
  }

  const handleEkle = async () => {
    if (!form.baslik.trim()) { toast.error('Kampanya başlığı zorunludur'); return }
    if (!form.metin.trim()) { toast.error('Kampanya metni zorunludur'); return }
    setKaydediyor(true)
    try {
      const sonuc = await kampanyaService.olustur(form, dosya)
      toast.success(sonuc.canli ? 'Kampanya oluşturuldu!' : 'Kampanya oluşturuldu (yerel — sunucu hazır değil)')
      setModalOpen(false); resetForm()
      await verileriGetir()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setKaydediyor(false)
    }
  }

  const handleDurumDegistir = async (kampanya) => {
    const yeni = kampanya.durum === 'Aktif' ? 'Pasif' : 'Aktif'
    setDegisenId(kampanya.id)
    try {
      await kampanyaService.durumDegistir(kampanya.id, yeni)
      setKampanyalar((prev) => prev.map((k) => (k.id === kampanya.id ? { ...k, durum: yeni } : k)))
      toast.success(yeni === 'Aktif' ? 'Kampanya aktifleştirildi' : 'Kampanya pasife alındı')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDegisenId(null)
    }
  }

  const handleSilOnayla = async () => {
    setSiliniyor(true)
    try {
      await kampanyaService.sil(seciliKampanya.id)
      toast.success('Kampanya silindi')
      handleClose()
      await verileriGetir()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSiliniyor(false)
    }
  }

  const handleBroadcastOnayla = async () => {
    setGonderiliyor(true)
    try {
      const sonuc = await kampanyaService.broadcastGonder(seciliKampanya.id)
      if (sonuc.basarili) {
        toast.success(
          sonuc.hedefSayisi
            ? `Kampanya ${sonuc.hedefSayisi.toLocaleString('tr-TR')} müşteriye gönderildi!`
            : 'Kampanya tüm müşterilere gönderildi!'
        )
        handleClose()
        await verileriGetir()
      } else {
        toast.error(sonuc.mesaj || 'Gönderim başarısız oldu.')
      }
    } catch (e) {
      toast.error(e.message || 'Toplu gönderim servisi henüz hazır değil.')
    } finally {
      setGonderiliyor(false)
    }
  }

  const tarihFormat = (t) => {
    if (!t) return null
    try { return new Date(t).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }) }
    catch { return null }
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Kampanyalar</h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            {yukleniyor ? 'Yükleniyor...' : `${kampanyalar.length} kampanya`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={verileriGetir} disabled={yukleniyor}
            className="p-2 rounded-lg border transition-colors disabled:opacity-40"
            style={{ borderColor, color: textSecondary }} title="Yenile">
            <RefreshCw className={`w-4 h-4 ${yukleniyor ? 'animate-spin' : ''}`} />
          </button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Yeni Kampanya
          </Button>
        </div>
      </div>

      {!canli && !yukleniyor && !hata && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl border"
          style={{
            backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
          }}>
          <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
          <p className="text-xs" style={{ color: textSecondary }}>
            Kampanya servisi henüz hazır değil — değişiklikler geçici olarak yerelde tutuluyor.
            Toplu gönderim, sunucu hazır olana kadar çalışmayacak.
          </p>
        </div>
      )}

      {hata ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-10">
            <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
            <p className="text-sm font-medium" style={{ color: textPrimary }}>Kampanyalar yüklenemedi</p>
            <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{hata}</p>
            <Button onClick={verileriGetir}>
              <RefreshCw className="w-4 h-4" /> Tekrar Dene
            </Button>
          </div>
        </Card>
      ) : yukleniyor ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-16">
            <Spinner size="lg" />
            <p className="text-sm" style={{ color: textSecondary }}>Kampanyalar yükleniyor...</p>
          </div>
        </Card>
      ) : kampanyalar.length === 0 ? (
        <EmptyState title="Henüz kampanya yok"
          description="Müşterilerinize toplu mesaj göndermek için ilk kampanyanızı oluşturun."
          action={
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4" /> İlk Kampanyayı Oluştur
            </Button>
          } />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kampanyalar.map((k) => (
            <Card key={k.id} className="p-0 overflow-hidden flex flex-col">
              {k.gorselUrl ? (
                <img src={k.gorselUrl} alt={k.baslik} className="w-full h-36 object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none' }} />
              ) : (
                <div className="w-full h-36 flex items-center justify-center" style={{ backgroundColor: subtleBg }}>
                  <ImageIcon className="w-8 h-8" style={{ color: textTertiary }} />
                </div>
              )}

              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold flex-1 min-w-0" style={{ color: textPrimary }}>{k.baslik}</h3>
                  <Anahtar acik={k.durum === 'Aktif'} isDark={isDark}
                    onChange={() => handleDurumDegistir(k)} />
                </div>

                <p className="text-sm line-clamp-2" style={{ color: textSecondary }}>{k.metin}</p>

                <div className="flex flex-col gap-1 mt-auto pt-2 border-t" style={{ borderColor: divider }}>
                  {k.gonderimSayisi !== null && (
                    <p className="text-xs flex items-center gap-1.5" style={{ color: textTertiary }}>
                      <Users className="w-3 h-3" /> {k.gonderimSayisi.toLocaleString('tr-TR')} kişiye gönderildi
                    </p>
                  )}
                  {tarihFormat(k.sonGonderimTarihi) && (
                    <p className="text-xs flex items-center gap-1.5" style={{ color: textTertiary }}>
                      <Calendar className="w-3 h-3" /> Son gönderim: {tarihFormat(k.sonGonderimTarihi)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button className="flex-1" onClick={() => { setSeciliKampanya(k); setBroadcastOnayModal(true) }}
                    disabled={k.durum !== 'Aktif'}>
                    <Send className="w-3.5 h-3.5" /> Tüm Müşterilere Gönder
                  </Button>
                  <button onClick={() => { setSeciliKampanya(k); setSilOnayModal(true) }}
                    className="p-2 rounded-lg border transition-colors flex-shrink-0"
                    style={{ borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#FECACA', color: '#EF4444' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Yeni Kampanya Modalı */}
      <Modal isOpen={modalOpen} onClose={handleClose} title="Yeni Kampanya">
        <div className="flex flex-col gap-4">
          <Input label="Kampanya Başlığı *" placeholder="örn. Yaz Koleksiyonu %20 İndirim"
            value={form.baslik} onChange={(e) => setForm((f) => ({ ...f, baslik: e.target.value }))} />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: isDark ? '#D1D5DB' : '#374151' }}>Kampanya Metni *</label>
            <textarea rows={4} maxLength={1000}
              value={form.metin} onChange={(e) => setForm((f) => ({ ...f, metin: e.target.value }))}
              placeholder="Müşterilere WhatsApp üzerinden gönderilecek mesaj metni..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textPrimary }} />
            <p className="text-xs mt-0.5" style={{ color: textTertiary }}>{form.metin.length} / 1000 karakter</p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: textPrimary }}>Kampanya Görseli</label>
            {preview ? (
              <div className="flex items-center gap-4">
                <img src={preview} alt="önizleme" className="w-24 h-24 rounded-lg object-cover border flex-shrink-0"
                  style={{ borderColor }} />
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer w-fit"
                    style={{ borderColor, color: textSecondary, backgroundColor: subtleBg }}>
                    Görseli Değiştir
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                  </label>
                  <button type="button" onClick={() => { setPreview(null); setDosya(null) }}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border w-fit"
                    style={{ borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#FECACA', color: '#EF4444' }}>
                    <X className="w-3 h-3" /> Görseli Kaldır
                  </button>
                </div>
              </div>
            ) : (
              <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer transition-colors"
                style={{
                  borderColor: dragOver ? '#00B4B4' : borderColor,
                  backgroundColor: dragOver ? (isDark ? '#0D2626' : '#F0FDFC') : subtleBg,
                }}>
                <Upload className="w-5 h-5 mb-1.5" style={{ color: textSecondary }} />
                <p className="text-sm" style={{ color: textSecondary }}>
                  Sürükle bırak veya <span className="font-medium" style={{ color: textPrimary }}>dosya seç</span>
                </p>
                <p className="text-xs mt-1" style={{ color: textTertiary }}>Opsiyonel — JPG, PNG, WEBP</p>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              </label>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} className="flex-1">İptal</Button>
            <Button onClick={handleEkle} loading={kaydediyor} className="flex-1">
              {kaydediyor ? 'Oluşturuluyor...' : 'Kampanyayı Oluştur'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Silme Onayı */}
      <Modal isOpen={silOnayModal} onClose={handleClose} title="Kampanyayı Sil">
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: textSecondary }}>
            <span className="font-semibold" style={{ color: textPrimary }}>{seciliKampanya?.baslik}</span> adlı
            kampanyayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose} className="flex-1">Vazgeç</Button>
            <Button variant="danger" onClick={handleSilOnayla} loading={siliniyor} className="flex-1">
              {siliniyor ? 'Siliniyor...' : 'Evet, Sil'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toplu Gönderim Onayı */}
      <Modal isOpen={broadcastOnayModal} onClose={handleClose} title="Tüm Müşterilere Gönder">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg"
            style={{ backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB' }}>
            <Megaphone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: textPrimary }}>
                "{seciliKampanya?.baslik}" tüm aktif müşterilerinize WhatsApp üzerinden gönderilecek.
              </p>
              <p className="text-xs mt-1" style={{ color: textSecondary }}>
                Bu işlem geri alınamaz ve gerçek müşterilerinize mesaj gönderir. Devam etmeden önce
                kampanya metnini ve görselini kontrol ettiğinizden emin olun.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose} className="flex-1" disabled={gonderiliyor}>Vazgeç</Button>
            <Button onClick={handleBroadcastOnayla} loading={gonderiliyor} className="flex-1">
              {gonderiliyor ? 'Gönderiliyor...' : 'Evet, Gönder'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}