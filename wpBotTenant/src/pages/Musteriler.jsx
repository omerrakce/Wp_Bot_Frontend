import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { musteriService } from '../services/musteriService'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import PhoneInput, { gosterTelefon, sadeceRakam } from '../components/common/PhoneInput'
import {
  Search, ThumbsUp, ThumbsDown, X, ChevronLeft, ChevronRight,
  AlertCircle, RefreshCw, CloudOff, MoreHorizontal, Plus, Pencil, Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore from '../store/themeStore'

const SAYFA_BOYUTU = 20
const bosForm = { telefon: '', begeni: '', begenmeme: '' }

const sayfaNumaralari = (mevcut, toplam) => {
  if (toplam <= 7) return Array.from({ length: toplam }, (_, i) => i + 1)
  if (mevcut <= 4) return [1, 2, 3, 4, 5, '...', toplam]
  if (mevcut >= toplam - 3) return [1, '...', toplam - 4, toplam - 3, toplam - 2, toplam - 1, toplam]
  return [1, '...', mevcut - 1, mevcut, mevcut + 1, '...', toplam]
}

const MusteriFormu = ({ form, setForm, textSecondary }) => (
  <div className="flex flex-col gap-3">
    <PhoneInput label="Telefon Numarası *" value={form.telefon}
      onChange={(v) => setForm((f) => ({ ...f, telefon: v }))}
      hint="Müşterinin WhatsApp numarası" />
    <div className="grid grid-cols-2 gap-3">
      <Input label="Beğeni Sayısı" placeholder="0" value={form.begeni}
        onChange={(e) => setForm((f) => ({ ...f, begeni: e.target.value.replace(/\D/g, '') }))} />
      <Input label="Beğenmeme Sayısı" placeholder="0" value={form.begenmeme}
        onChange={(e) => setForm((f) => ({ ...f, begenmeme: e.target.value.replace(/\D/g, '') }))} />
    </div>
    <p className="text-xs" style={{ color: textSecondary }}>
      Müşteri kodu sistem tarafından otomatik oluşturulur. Zevk profili, bot ile etkileşim
      arttıkça kendiliğinden şekillenir.
    </p>
  </div>
)

export default function Musteriler() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [musteriler, setMusteriler] = useState([])
  const [toplam, setToplam] = useState(0)
  const [sayfa, setSayfa] = useState(1)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)
  const [canliMi, setCanliMi] = useState(true)

  const [arama, setArama] = useState('')
  const [aramaGirdi, setAramaGirdi] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [duzenleModal, setDuzenleModal] = useState(false)
  const [silOnayModal, setSilOnayModal] = useState(false)
  const [secili, setSecili] = useState(null)
  const [form, setForm] = useState(bosForm)
  const [kaydediyor, setKaydediyor] = useState(false)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const theadBg = isDark ? '#111827' : '#F9FAFB'
  const rowHover = isDark ? '#1F2937' : '#F9FAFB'
  const inputBg = isDark ? '#111827' : 'white'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'

  const verileriGetir = useCallback(async (hedefSayfa, aramaMetni) => {
    setYukleniyor(true)
    setHata(null)
    try {
      const sonuc = await musteriService.listele({
        sayfa: hedefSayfa,
        boyut: SAYFA_BOYUTU,
        arama: aramaMetni,
      })
      setMusteriler(sonuc.musteriler)
      setToplam(sonuc.toplam)
      setCanliMi(sonuc.canli)
    } catch (e) {
      setHata(e.message)
      setMusteriler([])
      setToplam(0)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  useEffect(() => {
    const zamanlayici = setTimeout(() => {
      setSayfa(1)
      setArama(aramaGirdi)
    }, 400)
    return () => clearTimeout(zamanlayici)
  }, [aramaGirdi])

  useEffect(() => {
    verileriGetir(sayfa, arama)
  }, [sayfa, arama, verileriGetir])

  const toplamSayfa = Math.max(1, Math.ceil(toplam / SAYFA_BOYUTU))

  const resetForm = () => { setForm(bosForm); setSecili(null) }
  const handleClose = () => { setModalOpen(false); setDuzenleModal(false); setSilOnayModal(false); resetForm() }

  const dogrula = () => {
    if (sadeceRakam(form.telefon).length !== 10) {
      toast.error('Telefon numarası 10 haneli olmalı'); return false
    }
    return true
  }

  const handleEkle = async () => {
    if (!dogrula()) return
    setKaydediyor(true)
    try {
      await musteriService.olustur(form)
      toast.success('Müşteri eklendi!')
      setModalOpen(false); resetForm()
      setAramaGirdi(''); setSayfa(1)
      await verileriGetir(1, '')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setKaydediyor(false)
    }
  }

  const handleDuzenleAc = (m, e) => {
    e.stopPropagation()
    setSecili(m)
    setForm({ telefon: m.telefon, begeni: String(m.begeni), begenmeme: String(m.begenmeme) })
    setDuzenleModal(true)
  }

  const handleDuzenleKaydet = async () => {
    if (!dogrula()) return
    setKaydediyor(true)
    try {
      await musteriService.guncelle(secili.id, {
        ...form,
        vektorEtiketleri: secili.vektorEtiketleri,
        begenilenUrunler: secili.begenilenUrunler,
        begenilmeyenUrunler: secili.begenilmeyenUrunler,
      })
      toast.success('Müşteri güncellendi!')
      setDuzenleModal(false); resetForm()
      await verileriGetir(sayfa, arama)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setKaydediyor(false)
    }
  }

  const handleSilAc = (m, e) => {
    e.stopPropagation()
    setSecili(m)
    setSilOnayModal(true)
  }

  const handleSilOnayla = async () => {
    setKaydediyor(true)
    try {
      await musteriService.sil(secili.id)
      toast.success('Müşteri silindi')
      setSilOnayModal(false); setSecili(null)
      const sonSayfa = Math.max(1, Math.ceil((toplam - 1) / SAYFA_BOYUTU))
      const yeniSayfa = Math.min(sayfa, sonSayfa)
      if (yeniSayfa !== sayfa) setSayfa(yeniSayfa)
      else await verileriGetir(sayfa, arama)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setKaydediyor(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Müşteriler</h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            {yukleniyor
              ? 'Yükleniyor...'
              : arama
                ? `"${arama}" için ${toplam.toLocaleString('tr-TR')} sonuç`
                : `${toplam.toLocaleString('tr-TR')} müşteri profili`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => verileriGetir(sayfa, arama)} disabled={yukleniyor}
            className="p-2 rounded-lg border transition-colors disabled:opacity-40"
            style={{ borderColor, color: textSecondary }} title="Yenile">
            <RefreshCw className={`w-4 h-4 ${yukleniyor ? 'animate-spin' : ''}`} />
          </button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Müşteri Ekle
          </Button>
        </div>
      </div>

      {!canliMi && !yukleniyor && !hata && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl border"
          style={{
            backgroundColor: isDark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
          }}>
          <CloudOff className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
          <p className="text-xs" style={{ color: textSecondary }}>
            Müşteri servisi henüz hazır değil — örnek veriler gösteriliyor.
          </p>
        </div>
      )}

      {/* Arama */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textSecondary }} />
        <input type="text" placeholder="Müşteri kodu veya telefon ara..." value={aramaGirdi}
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
            <p className="text-sm" style={{ color: textSecondary }}>Müşteriler yükleniyor...</p>
          </div>
        </Card>
      ) : musteriler.length === 0 ? (
        <EmptyState title="Müşteri bulunamadı"
          description={arama ? `"${arama}" aramasına uygun müşteri yok.` : 'Henüz bot ile etkileşen müşteri yok.'}
          action={!arama && (
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4" /> İlk Müşteriyi Ekle
            </Button>
          )} />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
                <tr>
                  {['Müşteri ID', 'Telefon Numarası', 'Alışveriş Vektörü', 'Beğeni Durumu', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                      style={{ color: textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {musteriler.map((musteri, i) => (
                  <tr key={musteri.id ?? i}
                    onClick={() => navigate(`/musteriler/${musteri.id}`)}
                    className="border-b transition-colors cursor-pointer"
                    style={{ borderColor: divider }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: '#1A1F2E' }}>
                          {(sayfa - 1) * SAYFA_BOYUTU + i + 1}
                        </div>
                        <span className="font-medium" style={{ color: textPrimary }}>{musteri.kod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: textSecondary }}>
                      {gosterTelefon(musteri.telefon)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap max-w-72">
                        {musteri.vektorEtiketleri.length === 0 ? (
                          <span className="text-xs" style={{ color: textSecondary }}>Henüz profil oluşmadı</span>
                        ) : musteri.vektorEtiketleri.map((v) => (
                          <span key={v.etiket} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: tagBg, color: textSecondary }}>
                            {v.etiket}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#10B981' }}>
                          <ThumbsUp className="w-3.5 h-3.5" /> {musteri.begeni}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#EF4444' }}>
                          <ThumbsDown className="w-3.5 h-3.5" /> {musteri.begenmeme}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => handleDuzenleAc(musteri, e)}
                          className="p-1.5 rounded-lg border transition-colors"
                          style={{ borderColor, color: textSecondary }}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={(e) => handleSilAc(musteri, e)}
                          className="p-1.5 rounded-lg border transition-colors"
                          style={{ borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#FECACA', color: '#EF4444' }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {toplamSayfa > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t flex-wrap gap-3"
              style={{ borderColor: divider }}>
              <p className="text-xs" style={{ color: textSecondary }}>
                Sayfa {sayfa} / {toplamSayfa.toLocaleString('tr-TR')} — toplam {toplam.toLocaleString('tr-TR')} müşteri
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
                    <span key={`ara-${i}`} className="w-8 h-8 flex items-center justify-center"
                      style={{ color: textSecondary }}>
                      <MoreHorizontal className="w-4 h-4" />
                    </span>
                  ) : (
                    <button key={n} onClick={() => setSayfa(n)} disabled={yukleniyor}
                      className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                      style={n === sayfa
                        ? { backgroundColor: '#1A1F2E', color: 'white' }
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

      {/* Modallar */}
      <Modal isOpen={modalOpen} onClose={handleClose} title="Müşteri Ekle">
        <div className="flex flex-col gap-4">
          <MusteriFormu form={form} setForm={setForm} textSecondary={textSecondary} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} className="flex-1">İptal</Button>
            <Button onClick={handleEkle} loading={kaydediyor} className="flex-1">
              {kaydediyor ? 'Ekleniyor...' : 'Ekle'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={duzenleModal} onClose={handleClose} title="Müşteriyi Düzenle">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg text-xs"
            style={{ backgroundColor: isDark ? '#111827' : '#F9FAFB', color: textSecondary }}>
            <span className="font-medium" style={{ color: textPrimary }}>{secili?.kod}</span>
            <span>— müşteri kodu değiştirilemez</span>
          </div>
          <MusteriFormu form={form} setForm={setForm} textSecondary={textSecondary} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} className="flex-1">İptal</Button>
            <Button onClick={handleDuzenleKaydet} loading={kaydediyor} className="flex-1">
              {kaydediyor ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={silOnayModal} onClose={handleClose} title="Müşteriyi Sil">
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: textSecondary }}>
            <span className="font-semibold" style={{ color: textPrimary }}>{secili?.kod}</span> kodlu müşteriyi
            silmek istediğinize emin misiniz? Zevk profili ve beğeni geçmişi de silinecek.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} className="flex-1">Vazgeç</Button>
            <Button variant="danger" onClick={handleSilOnayla} loading={kaydediyor} className="flex-1">
              {kaydediyor ? 'Siliniyor...' : 'Evet, Sil'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}