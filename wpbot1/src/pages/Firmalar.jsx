import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService, kullanimSagligi } from '../services/adminService'
import { PLAN_FIYATLARI } from '../mocks/mockData'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import PhoneInput, { sadeceRakam, gosterTelefon } from '../components/common/PhoneInput'
import {
  Plus, Building2, Search, Phone, Mail, MapPin, Pencil, X,
  ChevronLeft, ChevronRight, Copy, KeyRound, Send, CheckCircle,
  AlertCircle, RefreshCw, MoreHorizontal,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore from '../store/themeStore'
import useLangStore from '../store/langStore'
import { t } from '../i18n'

const SAYFA_BOYUTU = 20
const bosForm = { company: '', plan: 'Starter', telefon: '', email: '', adres: '', yetkili: '' }

const sayfaNumaralari = (mevcut, toplam) => {
  if (toplam <= 7) return Array.from({ length: toplam }, (_, i) => i + 1)
  if (mevcut <= 4) return [1, 2, 3, 4, 5, '...', toplam]
  if (mevcut >= toplam - 3) return [1, '...', toplam - 4, toplam - 3, toplam - 2, toplam - 1, toplam]
  return [1, '...', mevcut - 1, mevcut, mevcut + 1, '...', toplam]
}

const FirmaFormu = ({ form, setForm, isDark, inputBg, borderColor, textPrimary, lang }) => (
  <div className="flex flex-col gap-3">
    <Input label={`${t(lang, 'firmaAdi')} *`} placeholder="örn. ModaShop A.Ş." value={form.company}
      onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
    <Input label={t(lang, 'yetkiliKisi')} placeholder="örn. Ayşe Kaya" value={form.yetkili}
      onChange={(e) => setForm((f) => ({ ...f, yetkili: e.target.value }))} />
    <PhoneInput label={`${t(lang, 'telefon')} *`} value={form.telefon}
      onChange={(v) => setForm((f) => ({ ...f, telefon: v }))} />
    <Input label={`${t(lang, 'eposta')} *`} type="email" placeholder="info@firma.com" value={form.email}
      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
    <Input label={t(lang, 'adres')} placeholder="örn. Levent, İstanbul" value={form.adres}
      onChange={(e) => setForm((f) => ({ ...f, adres: e.target.value }))} />
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium" style={{ color: isDark ? '#D1D5DB' : '#374151' }}>{t(lang, 'plan')}</label>
      <select value={form.plan}
        onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textPrimary }}>
        {Object.entries(PLAN_FIYATLARI).map(([p, fiyat]) => (
          <option key={p} value={p}>{p} — {fiyat.toLocaleString()} ₺/{lang === 'tr' ? 'ay' : 'mo'}</option>
        ))}
      </select>
    </div>
  </div>
)

export default function Firmalar() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { lang } = useLangStore()
  const isDark = theme === 'dark'

  const [firmalar, setFirmalar] = useState([])
  const [toplam, setToplam] = useState(0)
  const [sayfa, setSayfa] = useState(1)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  const [arama, setArama] = useState('')
  const [aramaGirdi, setAramaGirdi] = useState('')
  const [aktifPlan, setAktifPlan] = useState('Tümü')
  const [durumFiltre, setDurumFiltre] = useState('Aktif')

  const [modalOpen, setModalOpen] = useState(false)
  const [duzenleModal, setDuzenleModal] = useState(false)
  const [davetModal, setDavetModal] = useState(false)
  const [kaydediyor, setKaydediyor] = useState(false)
  const [form, setForm] = useState(bosForm)
  const [secili, setSecili] = useState(null)
  const [yeniKayit, setYeniKayit] = useState(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#6B7280' : '#9CA3AF'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const theadBg = isDark ? '#111827' : '#F9FAFB'
  const rowHover = isDark ? '#1F2937' : '#F9FAFB'
  const inputBg = isDark ? '#111827' : 'white'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'

  const PLANLAR = [
    { key: 'Tümü', label: t(lang, 'tumu') },
    { key: 'Starter', label: 'Starter' },
    { key: 'Pro', label: 'Pro' },
    { key: 'Enterprise', label: 'Enterprise' },
  ]
  const formProps = { form, setForm, isDark, inputBg, borderColor, textPrimary, lang }
  const durumMetni = (d) => lang === 'tr' ? d : d === 'Aktif' ? 'Active' : 'Inactive'

  const verileriGetir = useCallback(async (hedefSayfa, aramaMetni) => {
    setYukleniyor(true)
    setHata(null)
    try {
      const sonuc = await adminService.firmalariGetir({
        sayfa: hedefSayfa, boyut: SAYFA_BOYUTU, arama: aramaMetni,
      })
      setFirmalar(sonuc.firmalar)
      setToplam(sonuc.toplam)
    } catch (e) {
      setHata(e.message)
      setFirmalar([]); setToplam(0)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  useEffect(() => {
    const z = setTimeout(() => { setSayfa(1); setArama(aramaGirdi) }, 400)
    return () => clearTimeout(z)
  }, [aramaGirdi])

  useEffect(() => { verileriGetir(sayfa, arama) }, [sayfa, arama, verileriGetir])

  const toplamSayfa = Math.max(1, Math.ceil(toplam / SAYFA_BOYUTU))
  const gosterilen = firmalar
    .filter((f) => aktifPlan === 'Tümü' || f.plan === aktifPlan)
    .filter((f) => durumFiltre === 'Tümü' || f.status === durumFiltre)

  const planStili = (plan) =>
    plan === 'Enterprise' ? { backgroundColor: isDark ? '#374151' : '#090C14', color: 'white' } :
    plan === 'Pro' ? { backgroundColor: isDark ? '#4B5563' : '#374151', color: 'white' } :
    { backgroundColor: tagBg, color: textSecondary }

  const dogrula = () => {
    if (!form.company.trim()) { toast.error(t(lang, 'hataFirmaAdi')); return false }
    if (sadeceRakam(form.telefon).length !== 10) { toast.error(t(lang, 'hataTelefon')); return false }
    if (!form.email.includes('@')) { toast.error(t(lang, 'hataEposta')); return false }
    return true
  }

  const handleEkle = async () => {
    if (!dogrula()) return
    setKaydediyor(true)
    try {
      const sonuc = await adminService.firmaOlustur(form)
      setYeniKayit({ ...sonuc.firma, davetGonderildi: sonuc.davetGonderildi })
      setModalOpen(false); setForm(bosForm)
      setDavetModal(true)
      setAramaGirdi(''); setSayfa(1)
      await verileriGetir(1, '')

      if (sonuc.davetGonderildi) {
        toast.success('Firma oluşturuldu, davet e-postası gönderildi!')
      } else {
        toast.error(sonuc.davetMesaji || 'Firma oluşturuldu ancak davet e-postası gönderilemedi.')
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setKaydediyor(false)
    }
  }

  const handleDuzenleAc = (f) => {
    setSecili(f)
    setForm({
      company: f.company, plan: f.plan, telefon: f.telefon, email: f.email,
      adres: f.adres === '-' ? '' : f.adres,
      yetkili: f.yetkili === '-' ? '' : f.yetkili,
    })
    setDuzenleModal(true)
  }

  const handleDuzenleKaydet = async () => {
    if (!dogrula()) return
    setKaydediyor(true)
    try {
      await adminService.firmaGuncelle(secili.id, form, secili.status)
      toast.success(t(lang, 'firmaGuncellendi'))
      setDuzenleModal(false); setForm(bosForm); setSecili(null)
      await verileriGetir(sayfa, arama)
    } catch (e) {
        const mesaj = e.status === 409
        ? 'Bu e-posta adresi başka bir firma tarafından kullanılıyor.'
        : e.message
      toast.error(mesaj)
    } finally {
      setKaydediyor(false)
    }
  }

  const toggleStatus = async (firma) => {
    const yeni = firma.status === 'Aktif' ? 'Pasif' : 'Aktif'
    try {
      await adminService.durumDegistir(firma.id, yeni)
      setFirmalar((prev) => prev.map((f) => f.id === firma.id ? { ...f, status: yeni } : f))
      toast.success(yeni === 'Aktif' ? 'Firma aktifleştirildi' : 'Firma pasife alındı')
    } catch (e) {
      toast.error(e.message)
    }
  }

    const handleDavetYenidenGonder = async (firma) => {
    try {
      const sonuc = await adminService.davetYenidenGonder(firma.id)
      if (sonuc.davetGonderildi) {
        toast.success(`${firma.company} için davet e-postası tekrar gönderildi`)
      } else {
        toast.error(sonuc.davetMesaji || 'E-posta gönderilemedi, lütfen tekrar deneyin')
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const kopyala = (metin, etiket) => {
    navigator.clipboard.writeText(metin)
    toast.success(`${etiket} ${t(lang, 'kopyalandi')}`)
  }

  const handleClose = () => {
    setModalOpen(false); setDuzenleModal(false); setForm(bosForm); setSecili(null)
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>{t(lang, 'firmalar')}</h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            {yukleniyor ? t(lang, 'yukleniyor') : `${toplam.toLocaleString('tr-TR')} ${t(lang, 'firmaKayitli')}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => verileriGetir(sayfa, arama)} disabled={yukleniyor}
            className="p-2 rounded-lg border transition-colors disabled:opacity-40"
            style={{ borderColor, color: textSecondary }}>
            <RefreshCw className={`w-4 h-4 ${yukleniyor ? 'animate-spin' : ''}`} />
          </button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> {t(lang, 'yeniFirmaEkle')}
          </Button>
        </div>
      </div>

      {/* Arama + filtre */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textSecondary }} />
          <input type="text" placeholder={t(lang, 'firmaAra')} value={aramaGirdi}
            onChange={(e) => setAramaGirdi(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm rounded-lg outline-none"
            style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textPrimary }} />
          {aramaGirdi && (
            <button onClick={() => setAramaGirdi('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded"
              style={{ color: textSecondary }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {PLANLAR.map((p) => (
          <button key={p.key} onClick={() => setAktifPlan(p.key)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={aktifPlan === p.key
              ? { backgroundColor: '#090C14', color: 'white' }
              : { backgroundColor: inputBg, color: textSecondary, border: `1px solid ${borderColor}` }}>
            {p.label}
          </button>
        ))}
        <div className="w-px h-6" style={{ backgroundColor: borderColor }} />
          {['Aktif', 'Pasif', 'Tümü'].map((d) => (
          <button key={d} onClick={() => setDurumFiltre(d)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={durumFiltre === d
              ? { backgroundColor: '#090C14', color: 'white' }
              : { backgroundColor: inputBg, color: textSecondary, border: `1px solid ${borderColor}` }}>
            {d}
            {d !== 'Tümü' && (
              <span className="ml-1.5 text-xs opacity-60">
                ({firmalar.filter((f) => f.status === d).length})
              </span>
            )}
          </button>
        ))}
        <span className="text-xs" style={{ color: textSecondary }}>
          {gosterilen.length} {t(lang, 'sonuc')}
        </span>
      </div>

      {hata ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-10">
            <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
            <p className="text-sm font-medium" style={{ color: textPrimary }}>Veriler yüklenemedi</p>
            <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{hata}</p>
            <Button onClick={() => verileriGetir(sayfa, arama)}>
              <RefreshCw className="w-4 h-4" /> Tekrar Dene
            </Button>
          </div>
        </Card>
      ) : yukleniyor ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-16">
            <Spinner size="lg" />
            <p className="text-sm" style={{ color: textSecondary }}>Firmalar yükleniyor...</p>
          </div>
        </Card>
      ) : gosterilen.length === 0 ? (
        <EmptyState title="Firma bulunamadı"
          description={arama ? `"${arama}" aramasına uygun firma yok.` : 'Henüz firma kaydı yok.'}
          action={!arama && (
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4" /> İlk Firmayı Ekle
            </Button>
          )} />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
                <tr>
                  {[t(lang, 'firma'), t(lang, 'iletisim'), t(lang, 'urun'), t(lang, 'erisilenMusteri'),
                  t(lang, 'memnuniyet'), t(lang, 'gorsel'), 'Kullanım', t(lang, 'durum'), t(lang, 'islem')].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                      style={{ color: textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gosterilen.map((firma) => {
                  const memnuniyet = firma.degerlendirmeSayisi
                    ? Math.round((firma.memnunSayisi / firma.degerlendirmeSayisi) * 100) : 0
                  const eslesme = firma.gorselGonderilen
                    ? Math.round((firma.gorselEslesen / firma.gorselGonderilen) * 100) : 0
                  const sepetOrani = firma.musteriToplam
                    ? Math.round((firma.sepeteYonlendirme / firma.musteriToplam) * 100) : 0
                  const yeterliOy = firma.degerlendirmeSayisi >= 30

                  return (
                    <tr key={firma.id} className="border-b transition-colors" style={{ borderColor: divider }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: tagBg }}>
                            <Building2 className="w-4 h-4" style={{ color: textSecondary }} />
                          </div>
                          <div>
                            <p className="font-medium whitespace-nowrap" style={{ color: textPrimary }}>{firma.company}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                              style={planStili(firma.plan)}>{firma.plan}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-xs whitespace-nowrap" style={{ color: textPrimary }}>
                            <Phone className="w-3 h-3 flex-shrink-0" style={{ color: textTertiary }} />
                            {gosterTelefon(firma.telefon)}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs whitespace-nowrap" style={{ color: textSecondary }}>
                            <Mail className="w-3 h-3 flex-shrink-0" style={{ color: textTertiary }} />
                            {firma.email}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs whitespace-nowrap" style={{ color: textSecondary }}>
                            <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: textTertiary }} />
                            {firma.adres}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-semibold" style={{ color: textPrimary }}>{firma.urunToplam.toLocaleString('tr-TR')}</p>
                        <p className="text-xs mt-0.5 whitespace-nowrap">
                          <span style={{ color: '#10B981' }}>{firma.urunAktif} {t(lang, 'aktifUrun')}</span>
                          <span style={{ color: textTertiary }}> · </span>
                          <span style={{ color: textSecondary }}>{firma.urunPasif} {t(lang, 'pasifUrun')}</span>
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-semibold" style={{ color: textPrimary }}>{firma.musteriToplam.toLocaleString('tr-TR')}</p>
                        <p className="text-xs mt-0.5 whitespace-nowrap" style={{ color: textSecondary }}>
                          {firma.sepeteYonlendirme.toLocaleString('tr-TR')} {t(lang, 'sepete')} (%{sepetOrani})
                        </p>
                      </td>

                      <td className="px-4 py-3 w-36">
                        {yeterliOy ? (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold" style={{ color: textPrimary }}>%{memnuniyet}</span>
                              <span className="text-xs" style={{ color: textTertiary }}>{firma.degerlendirmeSayisi} {t(lang, 'oy')}</span>
                            </div>
                            <div className="w-full rounded-full h-1.5" style={{ backgroundColor: tagBg }}>
                              <div className="h-1.5 rounded-full"
                                style={{
                                  width: `${memnuniyet}%`,
                                  backgroundColor: memnuniyet >= 80 ? '#10B981' : memnuniyet >= 60 ? '#F59E0B' : '#EF4444',
                                }} />
                            </div>
                          </>
                        ) : (
                          <span className="text-xs" style={{ color: textTertiary }}>
                            {t(lang, 'yetersizVeri')} ({firma.degerlendirmeSayisi})
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs whitespace-nowrap" style={{ color: textSecondary }}>
                          {t(lang, 'gonderilen')}: <span className="font-medium" style={{ color: textPrimary }}>
                            {firma.gorselGonderilen.toLocaleString('tr-TR')}</span>
                        </p>
                        <p className="text-xs mt-0.5 whitespace-nowrap" style={{ color: textSecondary }}>
                          {t(lang, 'eslesen')}: <span className="font-medium" style={{ color: '#25D366' }}>
                            {firma.gorselEslesen.toLocaleString('tr-TR')}</span>
                          <span style={{ color: textTertiary }}> (%{eslesme})</span>
                        </p>
                      </td>

                      <td className="px-4 py-3">
                      {(() => {
                        const saglik = kullanimSagligi(firma)
                        return (
                          <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium"
                            style={{ backgroundColor: `${saglik.renk}1A`, color: saglik.renk }}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: saglik.renk }} />
                            {saglik.etiket}
                          </span>
                        )
                      })()}
                    </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium"
                          style={firma.status === 'Aktif'
                            ? { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' }
                            : { backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2', color: '#EF4444' }}>
                          {durumMetni(firma.status)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/firmalar/${firma.id}`)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg border whitespace-nowrap"
                            style={{ borderColor, color: textSecondary }}>{t(lang, 'detay')}</button>
                          <button onClick={() => handleDuzenleAc(firma)}
                            className="p-1.5 rounded-lg border" style={{ borderColor, color: textSecondary }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        <button onClick={() => handleDavetYenidenGonder(firma)}
                          className="p-1.5 rounded-lg border" style={{ borderColor, color: textSecondary }}
                          title="Daveti Yeniden Gönder">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                          <button onClick={() => toggleStatus(firma)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg border whitespace-nowrap"
                            style={firma.status === 'Aktif'
                              ? { borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#FECACA', color: '#EF4444' }
                              : { borderColor: isDark ? 'rgba(16,185,129,0.3)' : '#A7F3D0', color: '#10B981' }}>
                            {firma.status === 'Aktif' ? t(lang, 'pasifeAl') : t(lang, 'aktifeAl')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {toplamSayfa > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t flex-wrap gap-3"
              style={{ borderColor: divider }}>
              <p className="text-xs" style={{ color: textSecondary }}>
                Sayfa {sayfa} / {toplamSayfa} — toplam {toplam.toLocaleString('tr-TR')}
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                <button onClick={() => setSayfa(1)} disabled={sayfa === 1 || yukleniyor}
                  className="px-2.5 h-8 rounded-lg border text-xs font-medium disabled:opacity-40"
                  style={{ borderColor, color: textSecondary }}>İlk</button>
                <button onClick={() => setSayfa((s) => Math.max(1, s - 1))} disabled={sayfa === 1 || yukleniyor}
                  className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor, color: textSecondary }}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {sayfaNumaralari(sayfa, toplamSayfa).map((n, i) =>
                  n === '...' ? (
                    <span key={`a-${i}`} className="w-8 h-8 flex items-center justify-center"
                      style={{ color: textSecondary }}><MoreHorizontal className="w-4 h-4" /></span>
                  ) : (
                    <button key={n} onClick={() => setSayfa(n)} disabled={yukleniyor}
                      className="w-8 h-8 rounded-lg text-xs font-medium"
                      style={n === sayfa
                        ? { backgroundColor: '#090C14', color: 'white' }
                        : { color: textSecondary, border: `1px solid ${borderColor}` }}>{n}</button>
                  )
                )}
                <button onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}
                  disabled={sayfa === toplamSayfa || yukleniyor}
                  className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor, color: textSecondary }}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => setSayfa(toplamSayfa)} disabled={sayfa === toplamSayfa || yukleniyor}
                  className="px-2.5 h-8 rounded-lg border text-xs font-medium disabled:opacity-40"
                  style={{ borderColor, color: textSecondary }}>Son</button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Ekle modalı */}
      <Modal isOpen={modalOpen} onClose={handleClose} title={t(lang, 'yeniFirmaEkle')}>
        <div className="flex flex-col gap-4">
          <FirmaFormu {...formProps} />
          <div className="flex items-start gap-2 p-3 rounded-lg text-xs"
            style={{ backgroundColor: subtleBg, color: textSecondary }}>
            <KeyRound className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#25D366' }} />
            <p>{t(lang, 'sifreBilgisi')}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose} className="flex-1">{t(lang, 'iptal')}</Button>
            <Button onClick={handleEkle} loading={kaydediyor} className="flex-1">
              {kaydediyor ? t(lang, 'olusturuluyor') : t(lang, 'firmaOlustur')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Düzenle modalı */}
      <Modal isOpen={duzenleModal} onClose={handleClose} title={t(lang, 'firmaDuzenle')}>
        <div className="flex flex-col gap-4">
          <FirmaFormu {...formProps} />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose} className="flex-1">{t(lang, 'iptal')}</Button>
            <Button onClick={handleDuzenleKaydet} loading={kaydediyor} className="flex-1">
              {kaydediyor ? t(lang, 'kaydediliyor') : t(lang, 'kaydet')}
            </Button>
          </div>
        </div>
      </Modal>

           {/* Davet modalı */}
      <Modal isOpen={davetModal} onClose={() => { setDavetModal(false); setYeniKayit(null) }}
        title="Firma Oluşturuldu">
        <div className="flex flex-col gap-4">
          {yeniKayit?.davetGonderildi ? (
            <div className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#ECFDF5' }}>
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: textPrimary }}>
                  {yeniKayit?.company} kaydedildi
                </p>
                <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                  {yeniKayit?.email} adresine davet e-postası gönderildi.
                  Firma, e-postadaki bağlantıyla kendi şifresini belirleyecek.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB' }}>
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: textPrimary }}>
                  {yeniKayit?.company} kaydedildi
                </p>
                <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                  Firma oluşturuldu ancak davet e-postası gönderilemedi.
                  Firma listesinden "Daveti Yeniden Gönder" ile tekrar deneyin.
                </p>
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: subtleBg, color: textSecondary }}>
            Bağlantı 48 saat geçerlidir. Firma bu süre içinde şifresini belirlemezse
            "Daveti Yeniden Gönder" ile yeni bir bağlantı oluşturabilirsiniz.
          </div>

          <Button variant="secondary"
            onClick={() => { setDavetModal(false); setYeniKayit(null) }}>
            Kapat
          </Button>
        </div>
      </Modal>

    </div>
  )
}