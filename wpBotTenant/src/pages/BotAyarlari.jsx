import { useState, useEffect, useCallback } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import WhatsAppBaglanti from '../components/WhatsAppBaglanti'
import { whatsappService } from '../services/whatsappService'
import {
  MessageSquare, Clock, Zap, Search, Sparkles,
  AlertCircle, RefreshCw, CloudOff, Info,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore from '../store/themeStore'

const Anahtar = ({ acik, onChange, isDark }) => (
  <button onClick={onChange}
    className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
    style={{ backgroundColor: acik ? '#00B4B4' : (isDark ? '#374151' : '#E5E7EB') }}>
    <span className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
      style={{ left: acik ? '26px' : '4px' }} />
  </button>
)

export default function BotAyarlari() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [ayar, setAyar] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kaydediyor, setKaydediyor] = useState(false)
  const [hata, setHata] = useState(null)
  const [canli, setCanli] = useState(true)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#6B7280' : '#9CA3AF'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const inputBg = isDark ? '#111827' : 'white'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'

  const verileriGetir = useCallback(async () => {
    setYukleniyor(true)
    setHata(null)
    try {
      const sonuc = await whatsappService.ayarlariGetir()
      setAyar(sonuc.veri)
      setCanli(sonuc.canli)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  useEffect(() => { verileriGetir() }, [verileriGetir])

  const handleKaydet = async () => {
    if (!ayar.karsilamaMesaji.trim()) {
      toast.error('Karşılama mesajı boş bırakılamaz')
      return
    }
    setKaydediyor(true)
    try {
      const sonuc = await whatsappService.ayarlariKaydet(ayar)
      setAyar(sonuc.veri)
      setCanli(sonuc.canli)
      toast.success(sonuc.canli ? 'Bot ayarları kaydedildi!' : 'Kaydedildi (sunucu hazır değil, yerel)')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setKaydediyor(false)
    }
  }

  const guncelle = (alan, deger) => setAyar((a) => ({ ...a, [alan]: deger }))
  const saatGuncelle = (alan, deger) =>
    setAyar((a) => ({ ...a, calismaSaatleri: { ...a.calismaSaatleri, [alan]: deger } }))

  if (yukleniyor) {
    return (
      <div className="max-w-3xl">
        <Card>
          <div className="flex flex-col items-center gap-3 py-16">
            <Spinner size="lg" />
            <p className="text-sm" style={{ color: textSecondary }}>Bot ayarları yükleniyor...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (hata || !ayar) {
    return (
      <div className="max-w-3xl">
        <Card>
          <div className="flex flex-col items-center gap-3 py-10">
            <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
            <p className="text-sm font-medium" style={{ color: textPrimary }}>Ayarlar yüklenemedi</p>
            <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{hata}</p>
            <Button onClick={verileriGetir}>
              <RefreshCw className="w-4 h-4" /> Tekrar Dene
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const ozellikler = [
    {
      key: 'gorselAramaAktif', icon: Search,
      baslik: 'Görselle Arama',
      aciklama: 'Müşteri fotoğraf gönderdiğinde bot, katalogdaki en benzer ürünleri bulup gösterir.',
    },
    {
      key: 'gunlukKapsulAktif', icon: Sparkles,
      baslik: 'Günlük Kapsül',
      aciklama: 'Müşterinin zevk profiline göre her gün otomatik ürün önerisi gönderilir.',
      not: 'Bu özellik Meta onaylı şablon mesaj gerektirir.',
    },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Bot Ayarları</h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            WhatsApp asistanınızın davranışını yapılandırın
          </p>
        </div>
        <button onClick={verileriGetir}
          className="p-2 rounded-lg border transition-colors"
          style={{ borderColor, color: textSecondary }}>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* WhatsApp bağlantısı */}
      <WhatsAppBaglanti />

      {!canli && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl border"
          style={{
            backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
          }}>
          <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
          <p className="text-xs" style={{ color: textSecondary }}>
            Ayar servisi henüz hazır değil — değişiklikler geçici olarak yerelde tutuluyor.
          </p>
        </div>
      )}

      {/* Karşılama mesajı */}
      <Card>
        <h2 className="font-semibold mb-1 flex items-center gap-2" style={{ color: textPrimary }}>
          <MessageSquare className="w-4 h-4" style={{ color: textSecondary }} /> Karşılama Mesajı
        </h2>
        <p className="text-xs mb-4" style={{ color: textSecondary }}>
          Müşteri ilk kez yazdığında gönderilir
        </p>
        <textarea
          value={ayar.karsilamaMesaji}
          onChange={(e) => guncelle('karsilamaMesaji', e.target.value)}
          rows={3} maxLength={1000}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
          style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textPrimary }}
          placeholder="Merhaba! Size nasıl yardımcı olabilirim?"
        />
        <p className="text-xs mt-1" style={{ color: textTertiary }}>
          {ayar.karsilamaMesaji.length} / 1000 karakter
        </p>
      </Card>

      {/* Çalışma saatleri */}
      <Card>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold flex items-center gap-2" style={{ color: textPrimary }}>
            <Clock className="w-4 h-4" style={{ color: textSecondary }} /> Çalışma Saatleri
          </h2>
          <Anahtar acik={ayar.calismaSaatleri.aktif} isDark={isDark}
            onChange={() => saatGuncelle('aktif', !ayar.calismaSaatleri.aktif)} />
        </div>
        <p className="text-xs mb-4" style={{ color: textSecondary }}>
          {ayar.calismaSaatleri.aktif
            ? 'Belirlenen saatler dışında müşterilere bilgilendirme mesajı gönderilir.'
            : 'Kapalı — bot her saat aynı şekilde yanıt verir.'}
        </p>

        {ayar.calismaSaatleri.aktif && (
          <div className="flex flex-col gap-4 pt-3 border-t" style={{ borderColor: divider }}>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: textSecondary }}>Başlangıç</label>
                <input type="time" value={ayar.calismaSaatleri.baslangic}
                  onChange={(e) => saatGuncelle('baslangic', e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textPrimary }} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: textSecondary }}>Bitiş</label>
                <input type="time" value={ayar.calismaSaatleri.bitis}
                  onChange={(e) => saatGuncelle('bitis', e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textPrimary }} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: textPrimary }}>Mesai Dışı Mesajı</label>
              <textarea
                value={ayar.mesaiDisiMesaji}
                onChange={(e) => guncelle('mesaiDisiMesaji', e.target.value)}
                rows={2} maxLength={500}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textPrimary }}
                placeholder="Şu an kapalıyız, en kısa sürede döneceğiz."
              />
                <p className="text-xs mt-1" style={{ color: textTertiary }}>
                Boş bırakırsanız bot mesai dışında da normal şekilde yanıt vermeye devam eder.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Özellikler */}
      <Card>
        <h2 className="font-semibold mb-1 flex items-center gap-2" style={{ color: textPrimary }}>
          <Zap className="w-4 h-4" style={{ color: textSecondary }} /> Bot Özellikleri
        </h2>
        <p className="text-xs mb-4" style={{ color: textSecondary }}>
          Müşterilerinize sunulacak yetenekleri seçin
        </p>
        <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
          {ozellikler.map((o) => (
            <div key={o.key} className="flex items-start justify-between gap-4 py-4" style={{ borderColor: divider }}>
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: subtleBg }}>
                  <o.icon className="w-4 h-4" style={{ color: ayar[o.key] ? '#00B4B4' : textSecondary }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: textPrimary }}>{o.baslik}</p>
                  <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{o.aciklama}</p>
                  {o.not && (
                    <p className="text-xs mt-1.5 flex items-start gap-1" style={{ color: textTertiary }}>
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" /> {o.not}
                    </p>
                  )}
                </div>
              </div>
              <Anahtar acik={ayar[o.key]} isDark={isDark}
                onChange={() => guncelle(o.key, !ayar[o.key])} />
            </div>
          ))}
        </div>
      </Card>

      {/* Sonuç adedi */}
      <Card>
        <h2 className="font-semibold mb-1" style={{ color: textPrimary }}>Gösterilecek Ürün Sayısı</h2>
        <p className="text-xs mb-4" style={{ color: textSecondary }}>
          Bot her aramada müşteriye kaç ürün göstersin?
        </p>
        <div className="flex items-center gap-4">
          <input type="range" min="1" max="10" value={ayar.sonucAdedi}
            onChange={(e) => guncelle('sonucAdedi', Number(e.target.value))}
            className="flex-1" />
          <div className="w-14 h-10 rounded-lg flex items-center justify-center font-semibold flex-shrink-0"
            style={{ backgroundColor: subtleBg, color: textPrimary }}>
            {ayar.sonucAdedi}
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: textTertiary }}>
          Çok fazla sonuç müşteriyi yorabilir. 3–5 arası genelde en iyi sonucu verir.
        </p>
      </Card>

      <div>
        <Button onClick={handleKaydet} loading={kaydediyor}>
          {kaydediyor ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </Button>
      </div>

    </div>
  )
}