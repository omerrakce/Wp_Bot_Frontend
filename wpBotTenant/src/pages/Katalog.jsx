import { useState, useEffect, useCallback, useMemo } from 'react'
import { KATEGORILER, SEZONLAR, BEDEN_GRUPLARI } from '../mocks/mockData'
import { urunService } from '../services/urunService'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import CategoryCombobox from '../components/common/CategoryCombobox'
import EmptyState from '../components/common/EmptyState'
import Card from '../components/common/Card'
import Spinner from '../components/common/Spinner'
import {
  Plus, Upload, X, Search, Pencil, Trash2,
  ChevronLeft, ChevronRight, AlertCircle, RefreshCw, MoreHorizontal,
  LayoutList, LayoutGrid, ArrowLeft, Send, Folder, ArrowUpDown,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore from '../store/themeStore'
import { useLocation, useNavigate } from 'react-router-dom'

const SAYFA_BOYUTU = 20
const KATEGORI_URUN_SAYFA_BOYUTU = 20

const SIRALAMA_SECENEKLERI = [
  { deger: '', etiket: 'Varsayılan' },
  { deger: 'newest', etiket: 'En Yeni' },
  { deger: 'oldest', etiket: 'En Eski' },
  { deger: 'price_asc', etiket: 'Fiyat: Düşükten Yükseğe' },
  { deger: 'price_desc', etiket: 'Fiyat: Yüksekten Düşüğe' },
]

const bosForm = {
  name: '', price: '', category: KATEGORILER[0], renk: '',
  uretici: '', bedenler: [], bedenGrubu: 'Harf Beden',
  urunKodu: '', sezon: '', status: 'Aktif', stock: '',
}

const Secim = ({ label, value, onChange, options, bosSecenek, isDark, textPrimary, borderColor }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium" style={{ color: isDark ? '#D1D5DB' : '#374151' }}>{label}</label>
    <select value={value} onChange={onChange}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
      style={{ backgroundColor: isDark ? '#111827' : 'white', border: `1px solid ${borderColor}`, color: textPrimary }}>
      {bosSecenek && <option value="">{bosSecenek}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
)

const FormIcerigi = ({ form, setForm, preview, setPreview, setDosya, dragOver, setDragOver, handleFile, handleDrop, isDark, textPrimary, textSecondary, borderColor, kategoriSecenekleri }) => {
  const secenekler = { isDark, textPrimary, borderColor }
  const mevcutBedenler = BEDEN_GRUPLARI[form.bedenGrubu] || []

  const bedenToggle = (b) => {
    setForm((f) => ({
      ...f,
      bedenler: f.bedenler.includes(b) ? f.bedenler.filter((x) => x !== b) : [...f.bedenler, b],
    }))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Ürün Adı *" placeholder="örn. Saten Midi Elbise" value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Input label="Fiyat (₺) *" placeholder="örn. 1899" value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value.replace(/[^\d.,]/g, '') }))} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CategoryCombobox label="Kategori *" value={form.category}
          onChange={(v) => setForm((f) => ({ ...f, category: v }))}
          options={kategoriSecenekleri} />
        <Input label="Renk *" placeholder="örn. Bordo, Çiçek Desen..." value={form.renk}
          onChange={(e) => setForm((f) => ({ ...f, renk: e.target.value }))} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Ürün Kodu *" placeholder="örn. ELB-1001" value={form.urunKodu}
          onChange={(e) => setForm((f) => ({ ...f, urunKodu: e.target.value.toLocaleUpperCase('tr-TR') }))} />
        <Input label="Stok Adedi" placeholder="örn. 50" value={form.stock}
          onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value.replace(/\D/g, '') }))} />
      </div>

      <Input label="Üretici (opsiyonel)" placeholder="örn. Modaline Tekstil" value={form.uretici}
        onChange={(e) => setForm((f) => ({ ...f, uretici: e.target.value }))} />

      <div className="grid grid-cols-2 gap-3">
        <Secim label="Sezon" value={form.sezon}
          onChange={(e) => setForm((f) => ({ ...f, sezon: e.target.value }))}
          options={SEZONLAR} bosSecenek="Belirtilmedi" {...secenekler} />
        <Secim label="Durum" value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          options={['Aktif', 'Pasif']} {...secenekler} />
      </div>

      <div className="flex flex-col gap-2">
        <Secim label="Beden Tipi" value={form.bedenGrubu}
          onChange={(e) => setForm((f) => ({ ...f, bedenGrubu: e.target.value, bedenler: [] }))}
          options={Object.keys(BEDEN_GRUPLARI)} {...secenekler} />
        <div>
          <p className="text-xs mb-1.5" style={{ color: textSecondary }}>
            Bedenleri seçin * ({form.bedenler.length} seçili)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {mevcutBedenler.map((b) => {
              const secili = form.bedenler.includes(b)
              return (
                <button key={b} type="button" onClick={() => bedenToggle(b)}
                  className="text-xs px-2.5 py-1 rounded-lg border transition-all"
                  style={secili
                    ? { backgroundColor: '#25D366', color: 'white', borderColor: '#25D366' }
                    : { backgroundColor: 'transparent', color: textSecondary, borderColor }}>
                  {b}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1" style={{ color: textPrimary }}>Ürün Görseli</label>
        {preview ? (
          <div className="flex items-center gap-4">
            <img src={preview} alt="önizleme" className="w-24 h-24 rounded-lg object-cover border flex-shrink-0"
              style={{ borderColor }} />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer w-fit"
                style={{ borderColor, color: textSecondary, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
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
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors"
            style={{
              borderColor: dragOver ? '#25D366' : borderColor,
              backgroundColor: dragOver ? (isDark ? '#0D2620' : '#F0FDF4') : (isDark ? '#111827' : '#F9FAFB'),
            }}>
            <Upload className="w-6 h-6 mb-2" style={{ color: textSecondary }} />
            <p className="text-sm" style={{ color: textSecondary }}>
              Sürükle bırak veya <span className="font-medium" style={{ color: textPrimary }}>dosya seç</span>
            </p>
            <p className="text-xs mt-1" style={{ color: textSecondary }}>JPG, PNG, WEBP desteklenir</p>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </label>
        )}
      </div>
    </div>
  )
}

const sayfaNumaralari = (mevcut, toplam) => {
  if (toplam <= 7) return Array.from({ length: toplam }, (_, i) => i + 1)
  if (mevcut <= 4) return [1, 2, 3, 4, 5, '...', toplam]
  if (mevcut >= toplam - 3) return [1, '...', toplam - 4, toplam - 3, toplam - 2, toplam - 1, toplam]
  return [1, '...', mevcut - 1, mevcut, mevcut + 1, '...', toplam]
}

export default function Katalog() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  // Tablo görünümü state'i
  const [urunler, setUrunler] = useState([])
  const [toplam, setToplam] = useState(0)
  const [sayfa, setSayfa] = useState(1)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  const [arama, setArama] = useState('')
  const [aramaGirdi, setAramaGirdi] = useState('')
  const [sirala, setSirala] = useState('')
  const [durumFiltre, setDurumFiltre] = useState('')
  const [gorunumModu, setGorunumModu] = useState('tablo') // 'tablo' | 'kategori'

  // Kategori görünümü state'i
  const [kategoriIstatistik, setKategoriIstatistik] = useState([])
  const [kategoriIstatistikYukleniyor, setKategoriIstatistikYukleniyor] = useState(false)
  const [kategoriIstatistikHata, setKategoriIstatistikHata] = useState(null)
  const [seciliKategori, setSeciliKategori] = useState(null)
  const [kategoriSayfa, setKategoriSayfa] = useState(1)
  const [kategoriUrunler, setKategoriUrunler] = useState([])
  const [kategoriToplam, setKategoriToplam] = useState(0)
  const [kategoriUrunYukleniyor, setKategoriUrunYukleniyor] = useState(false)
  const [kategoriUrunHata, setKategoriUrunHata] = useState(null)
  const [kategoriArama, setKategoriArama] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [duzenleModal, setDuzenleModal] = useState(false)
  const [silOnayModal, setSilOnayModal] = useState(false)
  const [seciliUrun, setSeciliUrun] = useState(null)
  const [kaydediyor, setKaydediyor] = useState(false)
  const [form, setForm] = useState(bosForm)
  const [preview, setPreview] = useState(null)
  const [dosya, setDosya] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const theadBg = isDark ? '#111827' : '#F9FAFB'
  const rowHover = isDark ? '#1F2937' : '#F9FAFB'
  const inputBg = isDark ? '#111827' : 'white'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'
  const codeBg = isDark ? '#111827' : '#F3F4F6'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'

  // --- Tablo görünümü veri çekme ---
  const verileriGetir = useCallback(async (hedefSayfa, aramaMetni, siralamaDegeri, durumDegeri) => {
    setYukleniyor(true)
    setHata(null)
    try {
      const sonuc = await urunService.listele({
        sayfa: hedefSayfa, boyut: SAYFA_BOYUTU, arama: aramaMetni, sirala: siralamaDegeri, durum: durumDegeri,
      })
      setUrunler(sonuc.urunler)
      setToplam(sonuc.toplam)
    } catch (e) {
      setHata(e.message)
      setUrunler([])
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
    if (gorunumModu === 'tablo') verileriGetir(sayfa, arama, sirala, durumFiltre)
  }, [sayfa, arama, sirala, durumFiltre, gorunumModu, verileriGetir])

    useEffect(() => {
    if (location.state?.onerilenAd) {
      setForm((f) => ({ ...f, name: location.state.onerilenAd }))
      setModalOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

  const toplamSayfa = Math.max(1, Math.ceil(toplam / SAYFA_BOYUTU))

  // --- Kategori istatistikleri ---
  const kategoriIstatistikGetir = useCallback(async () => {
    setKategoriIstatistikYukleniyor(true)
    setKategoriIstatistikHata(null)
    try {
      const liste = await urunService.kategoriIstatistikleri()
      setKategoriIstatistik(liste)
    } catch (e) {
      setKategoriIstatistikHata(e.message)
    } finally {
      setKategoriIstatistikYukleniyor(false)
    }
  }, [])

  useEffect(() => {
    if (gorunumModu === 'kategori' && !seciliKategori) {
      kategoriIstatistikGetir()
    }
  }, [gorunumModu, seciliKategori, kategoriIstatistikGetir])

  // --- Seçili kategorideki ürünler ---
  const kategoriUrunleriGetir = useCallback(async (kategori, hedefSayfa, aramaMetni) => {
    setKategoriUrunYukleniyor(true)
    setKategoriUrunHata(null)
    try {
      const sonuc = await urunService.listele({
        sayfa: hedefSayfa, boyut: KATEGORI_URUN_SAYFA_BOYUTU, arama: aramaMetni, kategori,
      })
      setKategoriUrunler(sonuc.urunler)
      setKategoriToplam(sonuc.toplam)
    } catch (e) {
      setKategoriUrunHata(e.message)
      setKategoriUrunler([])
    } finally {
      setKategoriUrunYukleniyor(false)
    }
  }, [])

  useEffect(() => {
    if (seciliKategori) kategoriUrunleriGetir(seciliKategori, kategoriSayfa, kategoriArama)
  }, [seciliKategori, kategoriSayfa, kategoriArama, kategoriUrunleriGetir])

  const kategoriTopSayfa = Math.max(1, Math.ceil(kategoriToplam / KATEGORI_URUN_SAYFA_BOYUTU))

  const kategoriyaGir = (kategori) => {
    setSeciliKategori(kategori)
    setKategoriSayfa(1)
    setKategoriArama('')
  }

  const kategoriListesineDon = () => {
    setSeciliKategori(null)
    setKategoriUrunler([])
    setKategoriToplam(0)
  }

  const handleGorunumDegis = (mod) => {
    setGorunumModu(mod)
    if (mod === 'kategori') {
      setSeciliKategori(null)
    }
  }

  // Kategori seçenekleri: sabit liste + tablo görünümünde o an yüklü ürünlerin kategorileri
  const kategoriSecenekleri = useMemo(() => {
    const dinamikler = urunler.map((u) => u.category).filter((c) => c && c !== '-')
    const istatistikten = kategoriIstatistik.map((k) => k.kategori).filter((c) => c && c !== 'Kategorisiz')
    return Array.from(new Set([...KATEGORILER, ...dinamikler, ...istatistikten])).sort((a, b) => a.localeCompare(b, 'tr'))
  }, [urunler, kategoriIstatistik])

  const handleFile = (secilen) => {
    if (!secilen) return
    if (!secilen.type.startsWith('image/')) { toast.error('Sadece görsel dosyası yükleyebilirsiniz'); return }
    setDosya(secilen)
    setPreview(URL.createObjectURL(secilen))
  }

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }

  const dogrula = (dosyaVarMi) => {
    if (!dosyaVarMi) { toast.error('Önce görsel seç'); return false }
    if (!form.name.trim() || !form.category.trim() || !form.renk.trim() || !form.urunKodu.trim()) {
      toast.error('Zorunlu alanları (*) doldur'); return false
    }
    if (form.bedenler.length === 0) { toast.error('En az 1 beden seç'); return false }
    if (!form.price || isNaN(Number(form.price.replace(',', '.')))) {
      toast.error('Fiyat geçerli bir sayı olmalı'); return false
    }
    return true
  }

  const yenidenYukle = () => {
    if (gorunumModu === 'tablo') {
      verileriGetir(sayfa, arama, sirala, durumFiltre)
    } else if (seciliKategori) {
      kategoriUrunleriGetir(seciliKategori, kategoriSayfa, kategoriArama)
    } else {
      kategoriIstatistikGetir()
    }
  }

  const handleEkle = async () => {
    if (!dogrula(!!dosya)) return
    setKaydediyor(true)
    try {
      await urunService.olustur(form, dosya)
      toast.success('Ürün başarıyla eklendi!')
      setModalOpen(false); resetForm()
      setSayfa(1)
      if (gorunumModu === 'tablo') await verileriGetir(1, arama, sirala, durumFiltre)
      else if (seciliKategori) await kategoriUrunleriGetir(seciliKategori, 1, kategoriArama)
      else await kategoriIstatistikGetir()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setKaydediyor(false)
    }
  }

  const bedenGrubuBul = (bedenler = []) => {
    const giris = Object.entries(BEDEN_GRUPLARI).find(([, liste]) => bedenler.some((b) => liste.includes(b)))
    return giris ? giris[0] : 'Harf Beden'
  }

  const handleDuzenleAc = (product) => {
    setSeciliUrun(product)
    setForm({
      name: product.name,
      price: String(product.priceRaw ?? ''),
      category: product.category === '-' ? KATEGORILER[0] : product.category,
      renk: product.renk === '-' ? '' : product.renk,
      uretici: product.uretici || '',
      bedenler: product.bedenler || [],
      bedenGrubu: bedenGrubuBul(product.bedenler),
      urunKodu: product.urunKodu === '-' ? '' : product.urunKodu,
      sezon: SEZONLAR.includes(product.sezon) ? product.sezon : '',
      status: product.status || 'Aktif',
      stock: String(product.stock ?? ''),
    })
    setPreview(product.image)
    setDosya(null)
    setDuzenleModal(true)
  }

  const handleDuzenleKaydet = async () => {
    if (!dogrula(!!(dosya || preview))) return
    setKaydediyor(true)
    try {
      await urunService.guncelle(seciliUrun.id, form, dosya, seciliUrun.image)
      toast.success('Ürün güncellendi!')
      setDuzenleModal(false); resetForm()
      yenidenYukle()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setKaydediyor(false)
    }
  }

  const handleSilOnayla = async () => {
    setKaydediyor(true)
    try {
      await urunService.sil(seciliUrun.id)
      toast.success('Ürün silindi')
      setSilOnayModal(false); setSeciliUrun(null)
      yenidenYukle()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setKaydediyor(false)
    }
  }

  const resetForm = () => { setForm(bosForm); setPreview(null); setDosya(null); setSeciliUrun(null) }
  const handleClose = () => { setModalOpen(false); setDuzenleModal(false); setSilOnayModal(false); resetForm() }

  const handleWhatsappSenkron = async () => {
    setSenkronEdiliyor(true)
    try {
      const sonuc = await urunService.whatsappSenkronEt()
      if (sonuc.basarili) {
        toast.success(
          sonuc.gonderilenSayisi
            ? `Katalog WhatsApp'a başarıyla gönderildi! (${sonuc.gonderilenSayisi.toLocaleString('tr-TR')} ürün)`
            : "Katalog WhatsApp'a başarıyla gönderildi!"
        )
      } else {
        toast.error(sonuc.mesaj || 'Senkronizasyon başarısız oldu.')
      }
    } catch (e) {
      toast.error(e.message || 'Senkronizasyon sırasında bir hata oluştu.')
    } finally {
      setSenkronEdiliyor(false)
    }
  }

  const [senkronEdiliyor, setSenkronEdiliyor] = useState(false)

  const formProps = { form, setForm, preview, setPreview, setDosya, dragOver, setDragOver, handleFile, handleDrop, isDark, textPrimary, textSecondary, borderColor, kategoriSecenekleri }

  const kategoriRenk = (i) => {
    const paletler = ['#25D366', '#00C398', '#0AC0C8', '#F59E0B', '#8B5CF6', '#EC4899']
    return paletler[i % paletler.length]
  }

  const aktifFiltreSayisi = (sirala ? 1 : 0) + (durumFiltre ? 1 : 0)

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Ürün Bilgileri</h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            {gorunumModu === 'tablo'
              ? (yukleniyor ? 'Yükleniyor...' : `${toplam.toLocaleString('tr-TR')} ürün kayıtlı`)
              : (seciliKategori ? `${seciliKategori} — ${kategoriToplam.toLocaleString('tr-TR')} ürün` : 'Kategoriye göre gözat')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor }}>
            <button onClick={() => handleGorunumDegis('tablo')}
              className="p-2 transition-colors"
              style={{ backgroundColor: gorunumModu === 'tablo' ? '#090C14' : inputBg, color: gorunumModu === 'tablo' ? 'white' : textSecondary }}
              title="Liste görünümü">
              <LayoutList className="w-4 h-4" />
            </button>
            <button onClick={() => handleGorunumDegis('kategori')}
              className="p-2 transition-colors"
              style={{ backgroundColor: gorunumModu === 'kategori' ? '#090C14' : inputBg, color: gorunumModu === 'kategori' ? 'white' : textSecondary }}
              title="Kategori görünümü">
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button onClick={yenidenYukle}
            className="p-2 rounded-lg border transition-colors"
            style={{ borderColor, color: textSecondary }} title="Yenile">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Yeni Ürün Ekle
          </Button>
        </div>
      </div>

      {/* ============ TABLO GÖRÜNÜMÜ ============ */}
      {gorunumModu === 'tablo' && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textSecondary }} />
              <input type="text" placeholder="Ürün adı veya kodu ara..." value={aramaGirdi}
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

            <div className="relative">
              <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSecondary }} />
              <select value={sirala} onChange={(e) => { setSirala(e.target.value); setSayfa(1) }}
                className="pl-7 pr-3 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer"
                style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textPrimary }}>
                {SIRALAMA_SECENEKLERI.map((s) => (
                  <option key={s.deger} value={s.deger}>{s.etiket}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor }}>
              {[{ v: '', l: 'Tümü' }, { v: 'Aktif', l: 'Aktif' }, { v: 'Pasif', l: 'Pasif' }].map((d) => (
                <button key={d.v} onClick={() => { setDurumFiltre(d.v); setSayfa(1) }}
                  className="px-3 py-2 text-sm font-medium transition-colors"
                  style={durumFiltre === d.v
                    ? { backgroundColor: '#090C14', color: 'white' }
                    : { backgroundColor: inputBg, color: textSecondary }}>
                  {d.l}
                </button>
              ))}
            </div>

            {aktifFiltreSayisi > 0 && (
              <button onClick={() => { setSirala(''); setDurumFiltre(''); setSayfa(1) }}
                className="text-xs font-medium px-2" style={{ color: textSecondary }}>
                Filtreleri temizle
              </button>
            )}
          </div>

          {hata ? (
            <Card>
              <div className="flex flex-col items-center gap-3 py-10">
                <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
                <p className="text-sm font-medium" style={{ color: textPrimary }}>Veriler yüklenemedi</p>
                <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{hata}</p>
                <Button onClick={() => verileriGetir(sayfa, arama, sirala, durumFiltre)}>
                  <RefreshCw className="w-4 h-4" /> Tekrar Dene
                </Button>
              </div>
            </Card>
          ) : yukleniyor ? (
            <Card>
              <div className="flex flex-col items-center gap-3 py-16">
                <Spinner size="lg" />
                <p className="text-sm" style={{ color: textSecondary }}>Ürünler yükleniyor...</p>
              </div>
            </Card>
          ) : urunler.length === 0 ? (
            <EmptyState title="Ürün bulunamadı"
              description={arama || aktifFiltreSayisi > 0 ? 'Bu kritere uygun ürün yok.' : 'Henüz ürün eklenmemiş.'} />
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
                    <tr>
                      {['Ürün', 'Ürün Kodu', 'Kategori', 'Renk', 'Bedenler', 'Sezon', 'Stok', 'Fiyat', 'Durum', 'İşlem'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                          style={{ color: textSecondary }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {urunler.map((product) => (
                      <tr key={product.id} className="border-b transition-colors" style={{ borderColor: divider }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => { e.currentTarget.style.opacity = '0.3' }} />
                            <p className="font-medium whitespace-nowrap" style={{ color: textPrimary }}>{product.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono px-2 py-1 rounded"
                            style={{ backgroundColor: codeBg, color: textSecondary }}>{product.urunKodu}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                            style={{ backgroundColor: tagBg, color: textSecondary }}>{product.category}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: textSecondary }}>{product.renk}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap max-w-32">
                            {product.bedenler.length === 0 ? (
                              <span className="text-xs" style={{ color: textSecondary }}>-</span>
                            ) : product.bedenler.map((beden) => (
                              <span key={beden} className="text-xs px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: tagBg, color: textSecondary }}>{beden}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                            style={{ backgroundColor: tagBg, color: textSecondary }}>{product.sezon}</span>
                        </td>
                        <td className="px-4 py-3" style={{ color: textSecondary }}>{product.stock}</td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: textPrimary }}>{product.price}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full font-medium"
                            style={product.status === 'Aktif'
                              ? { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' }
                              : { backgroundColor: tagBg, color: textSecondary }}>{product.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleDuzenleAc(product)}
                              className="p-1.5 rounded-lg border transition-colors"
                              style={{ borderColor, color: textSecondary }}>
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { setSeciliUrun(product); setSilOnayModal(true) }}
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
                <div className="flex items-center justify-between px-4 py-3 border-t flex-wrap gap-3" style={{ borderColor: divider }}>
                  <p className="text-xs" style={{ color: textSecondary }}>
                    Sayfa {sayfa} / {toplamSayfa.toLocaleString('tr-TR')} — toplam {toplam.toLocaleString('tr-TR')} ürün
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
                        <span key={`ara-${i}`} className="w-8 h-8 flex items-center justify-center" style={{ color: textSecondary }}>
                          <MoreHorizontal className="w-4 h-4" />
                        </span>
                      ) : (
                        <button key={n} onClick={() => setSayfa(n)} disabled={yukleniyor}
                          className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                          style={n === sayfa
                            ? { backgroundColor: '#090C14', color: 'white' }
                            : { color: textSecondary, border: `1px solid ${borderColor}` }}>
                          {n}
                        </button>
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
        </>
      )}

      {/* ============ KATEGORİ GÖRÜNÜMÜ — LİSTE ============ */}
      {gorunumModu === 'kategori' && !seciliKategori && (
        <>
          {kategoriIstatistikHata ? (
            <Card>
              <div className="flex flex-col items-center gap-3 py-10">
                <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
                <p className="text-sm font-medium" style={{ color: textPrimary }}>Kategoriler yüklenemedi</p>
                <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{kategoriIstatistikHata}</p>
                <Button onClick={kategoriIstatistikGetir}>
                  <RefreshCw className="w-4 h-4" /> Tekrar Dene
                </Button>
              </div>
            </Card>
          ) : kategoriIstatistikYukleniyor ? (
            <Card>
              <div className="flex flex-col items-center gap-3 py-16">
                <Spinner size="lg" />
                <p className="text-sm" style={{ color: textSecondary }}>Kategoriler yükleniyor...</p>
              </div>
            </Card>
          ) : kategoriIstatistik.length === 0 ? (
            <EmptyState title="Kategori bulunamadı" description="Henüz kategorilendirilmiş ürün yok." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {kategoriIstatistik.map((k, i) => (
                <div key={k.kategori} onClick={() => kategoriyaGir(k.kategori)}
                  className="cursor-pointer transition-all hover:shadow-md">
                  <Card>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${kategoriRenk(i)}1A` }}>
                        <Folder className="w-5 h-5" style={{ color: kategoriRenk(i) }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate" style={{ color: textPrimary }}>{k.kategori}</p>
                        <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                          {k.adet.toLocaleString('tr-TR')} ürün
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ============ KATEGORİ GÖRÜNÜMÜ — SEÇİLİ KATEGORİ ÜRÜNLERİ ============ */}
      {gorunumModu === 'kategori' && seciliKategori && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button onClick={kategoriListesineDon}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors"
              style={{ borderColor, color: textSecondary }}>
              <ArrowLeft className="w-4 h-4" /> Kategorilere Dön
            </button>
            <Button variant="secondary" onClick={handleWhatsappSenkron} loading={senkronEdiliyor} disabled={senkronEdiliyor}>
              <Send className="w-4 h-4" /> {senkronEdiliyor ? 'Senkronize Ediliyor...' : "WhatsApp'a Senkronize Et"}
            </Button>
          </div>

          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textSecondary }} />
            <input type="text" placeholder={`${seciliKategori} içinde ara...`} value={kategoriArama}
              onChange={(e) => { setKategoriArama(e.target.value); setKategoriSayfa(1) }}
              className="w-full pl-9 pr-9 py-2 text-sm rounded-lg outline-none"
              style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textPrimary }} />
            {kategoriArama && (
              <button onClick={() => { setKategoriArama(''); setKategoriSayfa(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded" style={{ color: textSecondary }}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {kategoriUrunHata ? (
            <Card>
              <div className="flex flex-col items-center gap-3 py-10">
                <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
                <p className="text-sm font-medium" style={{ color: textPrimary }}>Ürünler yüklenemedi</p>
                <p className="text-xs text-center max-w-sm" style={{ color: textSecondary }}>{kategoriUrunHata}</p>
                <Button onClick={() => kategoriUrunleriGetir(seciliKategori, kategoriSayfa, kategoriArama)}>
                  <RefreshCw className="w-4 h-4" /> Tekrar Dene
                </Button>
              </div>
            </Card>
          ) : kategoriUrunYukleniyor ? (
            <Card>
              <div className="flex flex-col items-center gap-3 py-16">
                <Spinner size="lg" />
                <p className="text-sm" style={{ color: textSecondary }}>Ürünler yükleniyor...</p>
              </div>
            </Card>
          ) : kategoriUrunler.length === 0 ? (
            <EmptyState title="Ürün bulunamadı"
              description={kategoriArama ? 'Bu aramaya uygun ürün yok.' : 'Bu kategoride henüz ürün yok.'} />
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
                {kategoriUrunler.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 px-4 py-3" style={{ borderColor: divider }}>
                    <img src={product.image} alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.currentTarget.style.opacity = '0.3' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: textPrimary }}>{product.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                        {product.urunKodu} · {product.renk} · {product.sezon}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold" style={{ color: textPrimary }}>{product.price}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-1"
                        style={product.status === 'Aktif'
                          ? { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' }
                          : { backgroundColor: tagBg, color: textSecondary }}>{product.status}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleDuzenleAc(product)}
                        className="p-1.5 rounded-lg border transition-colors" style={{ borderColor, color: textSecondary }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { setSeciliUrun(product); setSilOnayModal(true) }}
                        className="p-1.5 rounded-lg border transition-colors"
                        style={{ borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#FECACA', color: '#EF4444' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {kategoriTopSayfa > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t flex-wrap gap-3" style={{ borderColor: divider }}>
                  <p className="text-xs" style={{ color: textSecondary }}>
                    Sayfa {kategoriSayfa} / {kategoriTopSayfa} — toplam {kategoriToplam.toLocaleString('tr-TR')} ürün
                  </p>
                  <div className="flex items-center gap-1 flex-wrap">
                    <button onClick={() => setKategoriSayfa((s) => Math.max(1, s - 1))}
                      disabled={kategoriSayfa === 1 || kategoriUrunYukleniyor}
                      className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor, color: textSecondary }}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {sayfaNumaralari(kategoriSayfa, kategoriTopSayfa).map((n, i) =>
                      n === '...' ? (
                        <span key={`ka-${i}`} className="w-8 h-8 flex items-center justify-center" style={{ color: textSecondary }}>
                          <MoreHorizontal className="w-4 h-4" />
                        </span>
                      ) : (
                        <button key={n} onClick={() => setKategoriSayfa(n)} disabled={kategoriUrunYukleniyor}
                          className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                          style={n === kategoriSayfa
                            ? { backgroundColor: '#090C14', color: 'white' }
                            : { color: textSecondary, border: `1px solid ${borderColor}` }}>
                          {n}
                        </button>
                      )
                    )}
                    <button onClick={() => setKategoriSayfa((s) => Math.min(kategoriTopSayfa, s + 1))}
                      disabled={kategoriSayfa === kategoriTopSayfa || kategoriUrunYukleniyor}
                      className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor, color: textSecondary }}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </>
      )}

      <Modal isOpen={modalOpen} onClose={handleClose} title="Yeni Ürün Ekle">
        <div className="flex flex-col gap-4">
          <FormIcerigi {...formProps} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} className="flex-1">İptal</Button>
            <Button onClick={handleEkle} loading={kaydediyor} className="flex-1">
              {kaydediyor ? 'Yükleniyor...' : 'Ürünü Ekle'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={duzenleModal} onClose={handleClose} title="Ürünü Düzenle">
        <div className="flex flex-col gap-4">
          <FormIcerigi {...formProps} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} className="flex-1">İptal</Button>
            <Button onClick={handleDuzenleKaydet} loading={kaydediyor} className="flex-1">
              {kaydediyor ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={silOnayModal} onClose={handleClose} title="Ürünü Sil">
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: textSecondary }}>
            <span className="font-semibold" style={{ color: textPrimary }}>{seciliUrun?.name}</span> adlı ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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