import { useState, useEffect, useCallback } from 'react'
import Card from './common/Card'
import Button from './common/Button'
import Modal from './common/Modal'
import Spinner from './common/Spinner'
import PhoneInput, { sadeceRakam, gosterTelefon } from './common/PhoneInput'
import { whatsappService } from '../services/whatsappService'
import {
  MessageCircle, CheckCircle2, AlertTriangle, Link2Off,
  ShieldCheck, Clock, RefreshCw, ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore from '../store/themeStore'

const KALITE_RENK = {
  GREEN: { renk: '#10B981', metin: 'Yüksek' },
  YELLOW: { renk: '#F59E0B', metin: 'Orta' },
  RED: { renk: '#EF4444', metin: 'Düşük' },
}

export default function WhatsAppBaglanti() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [durum, setDurum] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [canli, setCanli] = useState(true)
  const [baglaniyor, setBaglaniyor] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [kesModal, setKesModal] = useState(false)
  const [telefon, setTelefon] = useState('')
  const [metaAdim, setMetaAdim] = useState('')

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#6B7280' : '#9CA3AF'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'

  const verileriGetir = useCallback(async () => {
    setYukleniyor(true)
    try {
      const sonuc = await whatsappService.durumGetir()
      setDurum(sonuc.veri)
      setCanli(sonuc.canli)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  useEffect(() => { verileriGetir() }, [verileriGetir])

    const handleBaglan = async () => {
    if (sadeceRakam(telefon).length !== 10) {
      toast.error('Telefon numarası 10 haneli olmalı')
      return
    }
    setBaglaniyor(true)
    setMetaAdim('Meta ekranına yönlendiriliyor...')
    try {
      await new Promise((r) => setTimeout(r, 900))
      setMetaAdim('Hesap doğrulanıyor...')
      await new Promise((r) => setTimeout(r, 900))
      setMetaAdim('Numara bağlanıyor...')

      const sonuc = await whatsappService.baglantiTamamla(sadeceRakam(telefon))

      setModalOpen(false)
      setTelefon('')
      toast.success(sonuc.canli
        ? 'WhatsApp hattı bağlandı!'
        : 'Bağlandı (test modu — sunucu ucu hazır değil)')

      await verileriGetir()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBaglaniyor(false)
      setMetaAdim('')
    }
  }

  const handleKes = async () => {
    setBaglaniyor(true)
    try {
      await whatsappService.baglantiKes()
      setDurum({ bagli: false, durum: 'baglanmadi', telefon: '' })
      setKesModal(false)
      toast.success('WhatsApp bağlantısı kesildi')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBaglaniyor(false)
    }
  }

  if (yukleniyor) {
    return (
      <Card>
        <div className="flex items-center gap-3 py-6 justify-center">
          <Spinner size="md" />
          <p className="text-sm" style={{ color: textSecondary }}>WhatsApp durumu kontrol ediliyor...</p>
        </div>
      </Card>
    )
  }

  const bagli = durum?.bagli
  const kalite = KALITE_RENK[durum?.kaliteDurumu] ?? null

  return (
    <>
      <Card>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: bagli ? (isDark ? 'rgba(37,211,102,0.15)' : '#DCFCE7') : subtleBg }}>
              <MessageCircle className="w-5 h-5" style={{ color: bagli ? '#25D366' : textSecondary }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: textPrimary }}>WhatsApp Bağlantısı</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                {bagli ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#25D366' }} />
                    <span className="text-xs font-medium" style={{ color: '#25D366' }}>
                      Bağlı — bot mesajları yanıtlıyor
                    </span>
                  </>
                ) : (
                  <>
                    <Link2Off className="w-3.5 h-3.5" style={{ color: textSecondary }} />
                    <span className="text-xs" style={{ color: textSecondary }}>
                      Henüz bağlanmadı
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button onClick={verileriGetir}
            className="p-2 rounded-lg border transition-colors"
            style={{ borderColor, color: textSecondary }}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {bagli ? (
          <>
            <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
              {[
                { label: 'Hat Numarası', value: gosterTelefon(durum.telefon) },
                { label: 'İşletme Adı', value: durum.isletmeAdi || '—' },
                ...(kalite ? [{ label: 'Hat Kalitesi', value: kalite.metin, renk: kalite.renk }] : []),
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-3" style={{ borderColor: divider }}>
                  <span className="text-sm" style={{ color: textSecondary }}>{s.label}</span>
                  <span className="text-sm font-medium" style={{ color: s.renk || textPrimary }}>{s.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg mt-4"
              style={{ backgroundColor: subtleBg }}>
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: textSecondary }} />
              <p className="text-xs" style={{ color: textSecondary }}>
                WhatsApp kuralları gereği bot, müşteri yazdıktan sonraki 24 saat içinde serbestçe
                yanıt verebilir. Bu süre dolduğunda yalnızca onaylı şablon mesajlar gönderilebilir.
              </p>
            </div>

            <div className="mt-4">
              <Button variant="secondary" onClick={() => setKesModal(true)}>
                <Link2Off className="w-4 h-4" /> Bağlantıyı Kes
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: subtleBg }}>
              <p className="text-sm font-medium mb-2" style={{ color: textPrimary }}>
                Botu çalıştırmak için WhatsApp Business hesabınızı bağlayın
              </p>
              <ul className="flex flex-col gap-1.5">
                {[
                  'Meta hesabınızla güvenli giriş yapılır',
                  'Kullanacağınız numara doğrulanır',
                  'Bot anında mesaj almaya başlar',
                ].map((m, i) => (
                  <li key={m} className="flex items-start gap-2 text-xs" style={{ color: textSecondary }}>
                    <span className="font-semibold" style={{ color: '#25D366' }}>{i + 1}.</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg mb-4"
              style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.08)' : '#EFF6FF' }}>
              <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#3B82F6' }} />
              <p className="text-xs" style={{ color: textSecondary }}>
                Numaranız ve mesajlarınız size ait kalır. HumerSoft yalnızca bot yanıtlarını
                iletmek için yetkilendirilir, dilediğiniz zaman bağlantıyı kesebilirsiniz.
              </p>
            </div>

            <Button onClick={() => setModalOpen(true)}>
              <MessageCircle className="w-4 h-4" /> WhatsApp'ı Bağla
            </Button>

            {!canli && (
              <p className="text-xs mt-3" style={{ color: textTertiary }}>
                Not: Bağlantı servisi henüz hazır değil, şu an test modunda çalışıyor.
              </p>
            )}
          </>
        )}
      </Card>

      {/* Bağlantı modalı */}
      <Modal isOpen={modalOpen} onClose={() => !baglaniyor && setModalOpen(false)}
        title="WhatsApp Hattını Bağla">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-2.5 p-3 rounded-lg"
            style={{ backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB' }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
            <p className="text-xs" style={{ color: textSecondary }}>
              Meta bağlantı akışı hazırlanıyor. Şu an numaranızı girerek test modunda
              devam edebilirsiniz — gerçek bağlantı kurulduğunda Meta ekranı açılacak.
            </p>
          </div>

          <PhoneInput label="WhatsApp Business Numarası *" value={telefon}
            onChange={setTelefon}
            hint="Botun çalışacağı hat — müşteriler bu numaraya yazacak" />

          <div className="p-3 rounded-lg" style={{ backgroundColor: subtleBg }}>
            <p className="text-xs font-medium mb-1.5" style={{ color: textPrimary }}>
              Bağlamadan önce kontrol edin
            </p>
            <ul className="flex flex-col gap-1">
              {[
                'Numara başka bir WhatsApp hesabında kayıtlı olmamalı',
                'Kişisel WhatsApp uygulamasından çıkış yapılmış olmalı',
                'SMS veya sesli arama ile doğrulama yapılabilmeli',
              ].map((m) => (
                <li key={m} className="text-xs flex items-start gap-1.5" style={{ color: textSecondary }}>
                  <span style={{ color: textTertiary }}>·</span> {m}
                </li>
              ))}
            </ul>
          </div>

            {baglaniyor && metaAdim && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(37,211,102,0.08)' : '#F0FDF4' }}>
              <Spinner size="sm" />
              <p className="text-xs" style={{ color: textSecondary }}>{metaAdim}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}
              disabled={baglaniyor} className="flex-1">
              İptal
            </Button>
            <Button onClick={handleBaglan} loading={baglaniyor} className="flex-1">
              {baglaniyor ? 'Bağlanıyor...' : 'Bağlantıyı Başlat'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bağlantı kesme onayı */}
      <Modal isOpen={kesModal} onClose={() => !baglaniyor && setKesModal(false)}
        title="Bağlantıyı Kes">
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: textSecondary }}>
            WhatsApp bağlantısını kesmek istediğinize emin misiniz?
            <span className="font-medium" style={{ color: textPrimary }}> Bot mesaj almayı durduracak</span> ve
            müşterileriniz yanıt alamayacak.
          </p>

          {baglaniyor && metaAdim && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(37,211,102,0.08)' : '#F0FDF4' }}>
              <Spinner size="sm" />
              <p className="text-xs" style={{ color: textSecondary }}>{metaAdim}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setKesModal(false)}
              disabled={baglaniyor} className="flex-1">
              Vazgeç
            </Button>
            <Button variant="danger" onClick={handleKes} loading={baglaniyor} className="flex-1">
              {baglaniyor ? 'Kesiliyor...' : 'Evet, Kes'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}