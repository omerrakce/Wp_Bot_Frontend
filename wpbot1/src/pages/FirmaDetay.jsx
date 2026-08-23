import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminService } from '../services/adminService'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { gosterTelefon } from '../components/common/PhoneInput'
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, User, MessageSquare,
  Package, Users, ImageIcon, Smile, ShoppingCart, AlertCircle, RefreshCw,
} from 'lucide-react'
import useThemeStore from '../store/themeStore'
import useLangStore from '../store/LangStore'
import { t } from '../i18n'

export default function FirmaDetay() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { lang } = useLangStore()
  const isDark = theme === 'dark'

  const [firma, setFirma] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#6B7280' : '#9CA3AF'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const tagBg = isDark ? '#374151' : '#F3F4F6'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'
  const borderColor = isDark ? '#374151' : '#E5E7EB'

  const verileriGetir = useCallback(async () => {
    setYukleniyor(true)
    setHata(null)
    try {
      const veri = await adminService.firmaDetay(id)
      setFirma(veri)
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [id])

  useEffect(() => { verileriGetir() }, [verileriGetir])

  if (yukleniyor) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 py-20">
          <Spinner size="lg" />
          <p className="text-sm" style={{ color: textSecondary }}>{t(lang, 'yukleniyor')}</p>
        </div>
      </Card>
    )
  }

  if (hata || !firma) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
        <p className="text-sm font-medium" style={{ color: textPrimary }}>
          {hata || t(lang, 'firmaBulunamadi')}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/firmalar')}>
            <ArrowLeft className="w-4 h-4" /> {t(lang, 'geriDon')}
          </Button>
          <Button onClick={verileriGetir}>
            <RefreshCw className="w-4 h-4" /> Tekrar Dene
          </Button>
        </div>
      </div>
    )
  }

  const memnuniyet = firma.degerlendirmeSayisi
    ? Math.round((firma.memnunSayisi / firma.degerlendirmeSayisi) * 100) : 0
  const eslesmeOrani = firma.gorselGonderilen
    ? Math.round((firma.gorselEslesen / firma.gorselGonderilen) * 100) : 0
  const sepetOrani = firma.musteriToplam
    ? Math.round((firma.sepeteYonlendirme / firma.musteriToplam) * 100) : 0

  const tarihFormat = (t) => {
    if (!t) return '-'
    try {
      return new Date(t).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    } catch { return '-' }
  }

  const durumMetni = (d) => lang === 'tr' ? d : d === 'Aktif' ? 'Active' : 'Inactive'

  const kartlar = [
    { baslik: t(lang, 'toplamUrun'), deger: firma.urunToplam.toLocaleString('tr-TR'),
      alt: `${firma.urunAktif} ${t(lang, 'aktifUrun')} · ${firma.urunPasif} ${t(lang, 'pasifUrun')}`, icon: Package },
    { baslik: t(lang, 'erisilenMusteri'), deger: firma.musteriToplam.toLocaleString('tr-TR'),
      alt: t(lang, 'botIleEtkilesim'), icon: Users },
    { baslik: t(lang, 'sepeteYonlendirme'), deger: firma.sepeteYonlendirme.toLocaleString('tr-TR'),
      alt: `%${sepetOrani} ${t(lang, 'donusum')}`, icon: ShoppingCart },
    { baslik: t(lang, 'memnuniyet'), deger: firma.degerlendirmeSayisi >= 30 ? `%${memnuniyet}` : '—',
      alt: firma.degerlendirmeSayisi >= 30
        ? `${firma.degerlendirmeSayisi} ${t(lang, 'degerlendirme')}`
        : t(lang, 'yetersizVeri'),
      icon: Smile, renk: memnuniyet >= 80 ? '#10B981' : '#F59E0B' },
  ]

  const planStili = (plan) =>
    plan === 'Enterprise' ? { backgroundColor: isDark ? '#374151' : '#1A1F2E', color: 'white' } :
    plan === 'Pro' ? { backgroundColor: isDark ? '#4B5563' : '#374151', color: 'white' } :
    { backgroundColor: tagBg, color: textSecondary }

  const botMetrikleri = [
    { label: 'Sepete Yönlendirme', value: firma.sepeteYonlendirme },
    { label: 'Temsilciye Bağlantı', value: firma.temsilciyeBaglanti },
    { label: 'Benzer Ürün Araması', value: firma.benzeriArama },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* Başlık */}
      <div className="flex items-center gap-4 flex-wrap">
        <button onClick={() => navigate('/firmalar')}
          className="p-2 rounded-xl border transition-colors" style={{ borderColor: divider }}>
          <ArrowLeft className="w-5 h-5" style={{ color: textSecondary }} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>{firma.company}</h1>
          <p className="text-sm mt-0.5" style={{ color: textSecondary }}>{t(lang, 'firmaDetayi')}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={verileriGetir}
            className="p-2 rounded-lg border transition-colors"
            style={{ borderColor, color: textSecondary }}>
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={planStili(firma.plan)}>
            {firma.plan}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold"
            style={firma.status === 'Aktif'
              ? { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' }
              : { backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2', color: '#EF4444' }}>
            {durumMetni(firma.status)}
          </span>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kartlar.map((k) => (
          <Card key={k.baslik}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs" style={{ color: textSecondary }}>{k.baslik}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: textPrimary }}>{k.deger}</p>
                <p className="text-xs mt-1" style={{ color: textTertiary }}>{k.alt}</p>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tagBg }}>
                <k.icon className="w-4 h-4" style={{ color: k.renk || textSecondary }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Görsel eşleştirme */}
      <Card>
        <h2 className="font-semibold mb-1 flex items-center gap-2" style={{ color: textPrimary }}>
          <ImageIcon className="w-4 h-4" style={{ color: textSecondary }} /> {t(lang, 'gorselEslestirme')}
        </h2>
        <p className="text-xs mb-4" style={{ color: textSecondary }}>{t(lang, 'gorselAciklama')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: t(lang, 'gonderilenGorsel'), value: firma.gorselGonderilen.toLocaleString('tr-TR') },
            { label: t(lang, 'eslesenGorsel'), value: firma.gorselEslesen.toLocaleString('tr-TR'), renk: '#00B4B4' },
            { label: t(lang, 'eslesmeOrani'), value: `%${eslesmeOrani}` },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl" style={{ backgroundColor: subtleBg }}>
              <p className="text-xs" style={{ color: textSecondary }}>{s.label}</p>
              <p className="text-xl font-bold mt-1" style={{ color: s.renk || textPrimary }}>{s.value}</p>
            </div>
          ))}
        </div>
        {firma.gorselGonderilen > 0 && (
          <div className="mt-4">
            <div className="w-full rounded-full h-2" style={{ backgroundColor: tagBg }}>
              <div className="h-2 rounded-full transition-all"
                style={{ width: `${eslesmeOrani}%`, backgroundColor: '#00B4B4' }} />
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* İletişim */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="font-semibold mb-4" style={{ color: textPrimary }}>{t(lang, 'iletisimBilgileri')}</h2>
            <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
              {[
                { icon: Phone, label: t(lang, 'telefon'), value: firma.telefon ? gosterTelefon(firma.telefon) : '—' },
                { icon: MessageSquare, label: t(lang, 'botNumarasi'), value: firma.botNumara ? gosterTelefon(firma.botNumara) : '—' },
                { icon: Mail, label: t(lang, 'eposta'), value: firma.email || '—' },
                { icon: MapPin, label: t(lang, 'adres'), value: firma.adres || '—' },
                { icon: User, label: t(lang, 'yetkili'), value: firma.yetkili || '—' },
                { icon: Calendar, label: t(lang, 'katilim'), value: tarihFormat(firma.joinDate) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-3" style={{ borderColor: divider }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: tagBg }}>
                    <Icon className="w-4 h-4" style={{ color: textSecondary }} />
                  </div>
                  <span className="text-xs flex-1" style={{ color: textSecondary }}>{label}</span>
                  <span className="text-sm font-medium" style={{ color: textPrimary }}>{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bot etkileşimleri */}
        <Card>
          <h2 className="font-semibold mb-1" style={{ color: textPrimary }}>Bot Etkileşimleri</h2>
          <p className="text-xs mb-4" style={{ color: textSecondary }}>
            WhatsApp üzerinden gerçekleşen aksiyonlar
          </p>
          <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
            {botMetrikleri.map((m) => (
              <div key={m.label} className="flex items-center justify-between py-3" style={{ borderColor: divider }}>
                <span className="text-sm" style={{ color: textSecondary }}>{m.label}</span>
                <span className="text-sm font-semibold" style={{ color: textPrimary }}>
                  {m.value.toLocaleString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
          {botMetrikleri.every((m) => m.value === 0) && (
            <p className="text-xs mt-3 p-2.5 rounded-lg" style={{ backgroundColor: subtleBg, color: textSecondary }}>
              Bot entegrasyonu aktif olduğunda bu veriler dolmaya başlayacak.
            </p>
          )}
        </Card>

      </div>
    </div>
  )
}