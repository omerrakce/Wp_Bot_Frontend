import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import Spinner from '../components/common/Spinner'
import PhoneInput, { sadeceRakam, gosterTelefon } from '../components/common/PhoneInput'
import { firmaService } from '../services/firmaService'
import { whatsappService } from '../services/whatsappService'
import {
  Building2, Link2, Users, Plus, Pencil, Trash2, Upload, X,
  ExternalLink, AlertCircle, RefreshCw, CloudOff, Radio, ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore from '../store/themeStore'

const bosTezgahtar = { ad: '', telefon: '', gorsel: '' }

const TezgahtarFormu = ({ form, setForm, preview, setPreview, setDosya, dragOver, setDragOver, handleFile, handleDrop, isDark, textPrimary, textSecondary, borderColor, subtleBg }) => (
  <div className="flex flex-col gap-3">
    <Input label="Ad Soyad *" placeholder="örn. Mehmet Demir" value={form.ad}
      onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))} />
    <PhoneInput label="Telefon Numarası *" value={form.telefon}
      onChange={(v) => setForm((f) => ({ ...f, telefon: v }))} />
    <div>
      <label className="text-sm font-medium block mb-1.5" style={{ color: textPrimary }}>Profil Görseli</label>
      {preview ? (
        <div className="flex items-center gap-4">
          <img src={preview} alt="önizleme"
            className="w-20 h-20 rounded-full object-cover border flex-shrink-0" style={{ borderColor }} />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer w-fit"
              style={{ borderColor, color: textSecondary, backgroundColor: subtleBg }}>
              Görseli Değiştir
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </label>
            <button type="button" onClick={() => { setPreview(null); setDosya(null); setForm((f) => ({ ...f, gorsel: '' })) }}
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
            borderColor: dragOver ? '#25D366' : borderColor,
            backgroundColor: dragOver ? (isDark ? '#0D2626' : '#F0FDFC') : subtleBg,
          }}>
          <Upload className="w-5 h-5 mb-1.5" style={{ color: textSecondary }} />
          <p className="text-sm" style={{ color: textSecondary }}>
            Sürükle bırak veya <span className="font-medium" style={{ color: textPrimary }}>dosya seç</span>
          </p>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </label>
      )}
    </div>
  </div>
)

function BotDurumuOzeti() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const [durum, setDurum] = useState(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const borderColor = isDark ? '#374151' : '#E5E7EB'

  useEffect(() => {
    whatsappService.durumGetir().then((sonuc) => setDurum(sonuc.veri)).catch(() => setDurum(null))
  }, [])

  const bagliMi = durum?.bagli

  return (
    <Link to="/bot-durumu"
      className="flex items-center justify-between gap-3 p-4 rounded-2xl border transition-colors"
      style={{ borderColor, backgroundColor: isDark ? '#111827' : 'white' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bagliMi ? 'rgba(37,211,102,0.15)' : (isDark ? '#374151' : '#F3F4F6') }}>
          <Radio className="w-5 h-5" style={{ color: bagliMi ? '#25D366' : textSecondary }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: textPrimary }}>Bot Durumu</p>
          <p className="text-xs mt-0.5" style={{ color: bagliMi ? '#25D366' : textSecondary }}>
            {durum === null ? 'Yükleniyor...' : bagliMi ? 'Bağlı — bot mesajları yanıtlıyor' : 'WhatsApp bağlı değil'}
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: textSecondary }} />
    </Link>
  )
}

export default function FirmaBilgileri() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [firma, setFirma] = useState(null)
  const [tezgahtarlar, setTezgahtarlar] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)
  const [ayarCanli, setAyarCanli] = useState(true)
  const [staffCanli, setStaffCanli] = useState(true)

  const [firmaLoading, setFirmaLoading] = useState(false)
  const [tezgahtarLoading, setTezgahtarLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [duzenleModal, setDuzenleModal] = useState(false)
  const [silOnayModal, setSilOnayModal] = useState(false)
  const [secili, setSecili] = useState(null)
  const [form, setForm] = useState(bosTezgahtar)
  const [preview, setPreview] = useState(null)
  const [dosya, setDosya] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'

  const verileriGetir = useCallback(async () => {
    setYukleniyor(true)
    setHata(null)
    try {
      const [ayar, staff] = await Promise.all([
        firmaService.ayarlariGetir(),
        firmaService.tezgahtarlariGetir(),
      ])
      setFirma(ayar.veri)
      setTezgahtarlar(staff.veri)
      setAyarCanli(ayar.canli)
      setStaffCanli(staff.canli)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  useEffect(() => { verileriGetir() }, [verileriGetir])

  const handleFirmaKaydet = async () => {
    if (!firma.firmaAdi.trim()) { toast.error('Firma adı zorunludur'); return }
    if (sadeceRakam(firma.botTelefon).length !== 10) {
      toast.error('WhatsApp bot numarası 10 haneli olmalı'); return
    }
    setFirmaLoading(true)
    try {
      const sonuc = await firmaService.ayarlariKaydet(firma)
      setFirma(sonuc.veri)
      setAyarCanli(sonuc.canli)
      toast.success(sonuc.canli ? 'Firma bilgileri kaydedildi!' : 'Kaydedildi (sunucu hazır değil, yerel)')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setFirmaLoading(false)
    }
  }

  const toggleTezgahtar = async () => {
    const yeni = !firma.tezgahtarAktif
    const guncel = { ...firma, tezgahtarAktif: yeni }
    setFirma(guncel)
    try {
      await firmaService.ayarlariKaydet(guncel)
      toast.success(yeni
        ? 'Tezgahtar yönlendirme açıldı'
        : 'Tezgahtar kapatıldı — müşteriler online siteye yönlendirilecek')
    } catch (e) {
      setFirma(firma)
      toast.error(e.message)
    }
  }

  const handleFile = (secilen) => {
    if (!secilen) return
    if (!secilen.type.startsWith('image/')) { toast.error('Sadece görsel dosyası yükleyebilirsiniz'); return }
    setDosya(secilen)
    setPreview(URL.createObjectURL(secilen))
  }

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }

  const resetForm = () => { setForm(bosTezgahtar); setPreview(null); setDosya(null); setSecili(null) }
  const handleClose = () => { setModalOpen(false); setDuzenleModal(false); setSilOnayModal(false); resetForm() }

  const dogrula = () => {
    if (!form.ad.trim()) { toast.error('Ad Soyad zorunludur'); return false }
    if (sadeceRakam(form.telefon).length !== 10) { toast.error('Telefon numarası 10 haneli olmalı'); return false }
    return true
  }

  const handleEkle = async () => {
    if (!dogrula()) return
    setTezgahtarLoading(true)
    try {
      const sonuc = await firmaService.tezgahtarEkle(form, dosya)
      setTezgahtarlar((prev) => [...prev, sonuc.veri])
      setModalOpen(false); resetForm()
      toast.success('Tezgahtar eklendi!')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setTezgahtarLoading(false)
    }
  }

  const handleDuzenleAc = (t) => {
    setSecili(t)
    setForm({ ad: t.ad, telefon: t.telefon, gorsel: t.gorsel })
    setPreview(t.gorsel || null)
    setDosya(null)
    setDuzenleModal(true)
  }

  const handleDuzenleKaydet = async () => {
    if (!dogrula()) return
    setTezgahtarLoading(true)
    try {
      const sonuc = await firmaService.tezgahtarGuncelle(secili.id, form, dosya)
      setTezgahtarlar((prev) => prev.map((t) => t.id === secili.id ? sonuc.veri : t))
      setDuzenleModal(false); resetForm()
      toast.success('Tezgahtar güncellendi!')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setTezgahtarLoading(false)
    }
  }

  const handleSilOnayla = async () => {
    setTezgahtarLoading(true)
    try {
      await firmaService.tezgahtarSil(secili.id)
      setTezgahtarlar((prev) => prev.filter((t) => t.id !== secili.id))
      setSilOnayModal(false); setSecili(null)
      toast.success('Tezgahtar silindi')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setTezgahtarLoading(false)
    }
  }

  const formProps = { form, setForm, preview, setPreview, setDosya, dragOver, setDragOver, handleFile, handleDrop, isDark, textPrimary, textSecondary, borderColor, subtleBg }

  if (yukleniyor) {
    return (
      <div className="max-w-3xl">
        <Card>
          <div className="flex flex-col items-center gap-3 py-16">
            <Spinner size="lg" />
            <p className="text-sm" style={{ color: textSecondary }}>Firma bilgileri yükleniyor...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (hata || !firma) {
    return (
      <div className="max-w-3xl">
        <Card>
          <div className="flex flex-col items-center gap-3 py-10">
            <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
            <p className="text-sm font-medium" style={{ color: textPrimary }}>Bilgiler yüklenemedi</p>
            <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{hata}</p>
            <Button onClick={verileriGetir}>
              <RefreshCw className="w-4 h-4" /> Tekrar Dene
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Firma Bilgileri</h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            Firma kimliği, bot hattı ve yönlendirme ayarları
          </p>
        </div>
        <button onClick={verileriGetir}
          className="p-2 rounded-lg border transition-colors"
          style={{ borderColor, color: textSecondary }} title="Yenile">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <BotDurumuOzeti />

      {/* Genel Bilgiler */}
      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: textPrimary }}>
          <Building2 className="w-4 h-4" style={{ color: textSecondary }} /> Genel Bilgiler
        </h2>
        <div className="flex flex-col gap-4">
          <Input label="Firma Adı *" value={firma.firmaAdi}
            onChange={(e) => setFirma((f) => ({ ...f, firmaAdi: e.target.value }))} />
          <PhoneInput label="WhatsApp Bot Numarası *" value={firma.botTelefon}
            onChange={(v) => setFirma((f) => ({ ...f, botTelefon: v }))}
            hint="Botun çalışacağı hat — müşteriler bu numaraya yazacak" />
        </div>
      </Card>

      {/* Web Bağlantıları */}
      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: textPrimary }}>
          <Link2 className="w-4 h-4" style={{ color: textSecondary }} /> Web Bağlantıları
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input label="Sepet Bağlantı Linki" value={firma.sepetLinki}
              onChange={(e) => setFirma((f) => ({ ...f, sepetLinki: e.target.value }))}
              placeholder="https://siteniz.com/sepet" />
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
              Müşteri satın almak istediğinde bu linke yönlendirilir
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <Input label="Katalog Sayfası Linki" value={firma.katalogLinki}
              onChange={(e) => setFirma((f) => ({ ...f, katalogLinki: e.target.value }))}
              placeholder="https://siteniz.com/katalog" />
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
              Ürün detayları için müşterinin gideceği sayfa
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleFirmaKaydet} loading={firmaLoading}>
            {firmaLoading ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
          </Button>
        </div>
      </Card>

      {/* Tezgahtar */}
      <Card>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold flex items-center gap-2" style={{ color: textPrimary }}>
            <Users className="w-4 h-4" style={{ color: textSecondary }} /> Tezgahtar Yönlendirme
          </h2>
          <button onClick={toggleTezgahtar}
            className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
            style={{ backgroundColor: firma.tezgahtarAktif ? '#25D366' : (isDark ? '#374151' : '#E5E7EB') }}>
            <span className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
              style={{ left: firma.tezgahtarAktif ? '26px' : '4px' }} />
          </button>
        </div>
        <p className="text-xs mb-4" style={{ color: textSecondary }}>
          {firma.tezgahtarAktif
            ? 'Açık — müşteriler bir tezgahtara yönlendirilir.'
            : 'Kapalı — müşteriler doğrudan online sitenize yönlendirilir.'}
        </p>

        {!staffCanli && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg mb-4"
            style={{ backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB' }}>
            <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
            <p className="text-xs" style={{ color: textSecondary }}>
              Tezgahtar servisi henüz hazır değil — bu bölümdeki değişiklikler yerelde tutuluyor.
            </p>
          </div>
        )}

        {firma.tezgahtarAktif ? (
          <>
            <div className="flex items-center justify-between mb-3 pt-3 border-t" style={{ borderColor: divider }}>
              <p className="text-sm" style={{ color: textSecondary }}>{tezgahtarlar.length} tezgahtar kayıtlı</p>
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="w-4 h-4" /> Tezgahtar Ekle
              </Button>
            </div>

            {tezgahtarlar.length === 0 ? (
              <div className="text-center py-8 rounded-xl" style={{ backgroundColor: subtleBg }}>
                <p className="text-sm" style={{ color: textSecondary }}>Henüz tezgahtar eklemediniz.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
                {tezgahtarlar.map((t) => (
                  <div key={t.id} className="flex items-center gap-4 py-3" style={{ borderColor: divider }}>
                    {t.gorsel ? (
                      <img src={t.gorsel} alt={t.ad}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                        onError={(e) => { e.currentTarget.style.opacity = '0.3' }} />
                    ) : (
                      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ backgroundColor: subtleBg, color: textSecondary }}>
                        {t.ad.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: textPrimary }}>{t.ad}</p>
                      <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{gosterTelefon(t.telefon)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleDuzenleAc(t)}
                        className="p-1.5 rounded-lg border transition-colors"
                        style={{ borderColor, color: textSecondary }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { setSecili(t); setSilOnayModal(true) }}
                        className="p-1.5 rounded-lg border transition-colors"
                        style={{ borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#FECACA', color: '#EF4444' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-start gap-3 p-4 rounded-xl border"
            style={{
              backgroundColor: isDark ? '#0D2626' : '#F0FDFC',
              borderColor: isDark ? '#134E4A' : '#99F6E4',
            }}>
            <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#25D366' }} />
            <div className="min-w-0">
              <p className="text-sm font-medium" style={{ color: textPrimary }}>Online yönlendirme aktif</p>
              <p className="text-xs mt-1 break-all" style={{ color: textSecondary }}>
                Müşteriler temsilci yerine sepet linkine yönlendirilir:{' '}
                <span className="font-medium" style={{ color: '#25D366' }}>{firma.sepetLinki || '—'}</span>
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Modallar */}
      <Modal isOpen={modalOpen} onClose={handleClose} title="Tezgahtar Ekle">
        <div className="flex flex-col gap-4">
          <TezgahtarFormu {...formProps} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} className="flex-1">İptal</Button>
            <Button onClick={handleEkle} loading={tezgahtarLoading} className="flex-1">
              {tezgahtarLoading ? 'Ekleniyor...' : 'Ekle'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={duzenleModal} onClose={handleClose} title="Tezgahtarı Düzenle">
        <div className="flex flex-col gap-4">
          <TezgahtarFormu {...formProps} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} className="flex-1">İptal</Button>
            <Button onClick={handleDuzenleKaydet} loading={tezgahtarLoading} className="flex-1">
              {tezgahtarLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={silOnayModal} onClose={handleClose} title="Tezgahtarı Sil">
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: textSecondary }}>
            <span className="font-semibold" style={{ color: textPrimary }}>{secili?.ad}</span> adlı tezgahtarı silmek istediğinize emin misiniz?
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} className="flex-1">Vazgeç</Button>
            <Button variant="danger" onClick={handleSilOnayla} loading={tezgahtarLoading} className="flex-1">
              {tezgahtarLoading ? 'Siliniyor...' : 'Evet, Sil'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}