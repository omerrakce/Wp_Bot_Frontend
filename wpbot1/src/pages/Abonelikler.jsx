import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../services/adminService'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import {
  CreditCard, AlertTriangle, CheckCircle, Clock, TrendingUp,
  ChevronLeft, ChevronRight, Send, Search, X,
  AlertCircle, RefreshCw, MoreHorizontal,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore from '../store/themeStore'
import useLangStore from '../store/LangStore'
import { t } from '../i18n'

const SAYFA_BOYUTU = 20

const sayfaNumaralari = (mevcut, toplam) => {
  if (toplam <= 7) return Array.from({ length: toplam }, (_, i) => i + 1)
  if (mevcut <= 4) return [1, 2, 3, 4, 5, '...', toplam]
  if (mevcut >= toplam - 3) return [1, '...', toplam - 4, toplam - 3, toplam - 2, toplam - 1, toplam]
  return [1, '...', mevcut - 1, mevcut, mevcut + 1, '...', toplam]
}

export default function Abonelikler() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { lang } = useLangStore()
  const isDark = theme === 'dark'

  const [abonelikler, setAbonelikler] = useState([])
  const [faturalar, setFaturalar] = useState([])
  const [toplam, setToplam] = useState(0)
  const [sayfa, setSayfa] = useState(1)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  const [arama, setArama] = useState('')
  const [aramaGirdi, setAramaGirdi] = useState('')
  const [durumFiltre, setDurumFiltre] = useState('Tümü')

  const [hatirlatmaModal, setHatirlatmaModal] = useState(false)
  const [secili, setSecili] = useState(null)
  const [islemde, setIslemde] = useState(false)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const textTertiary = isDark ? '#6B7280' : '#9CA3AF'
  const divider = isDark ? '#374151' : '#F3F4F6'
  const theadBg = isDark ? '#111827' : '#F9FAFB'
  const rowHover = isDark ? '#1F2937' : '#F9FAFB'
  const inputBg = isDark ? '#111827' : 'white'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const tagBg = isDark ? '#374151' : '#F3F4F6'

  const DURUMLAR = [
    { key: 'Tümü', label: t(lang, 'tumu') },
    { key: 'Ödendi', label: t(lang, 'odendi') },
    { key: 'Beklemede', label: t(lang, 'beklemede') },
    { key: 'Gecikmiş', label: t(lang, 'gecikmis') },
  ]

  const durumMetni = (d) =>
    lang === 'tr' ? d :
    d === 'Ödendi' ? 'Paid' : d === 'Beklemede' ? 'Pending' : 'Overdue'

  const durumStili = (durum) =>
    durum === 'Ödendi' ? { backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' } :
    durum === 'Gecikmiş' ? { backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2', color: '#EF4444' } :
    { backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : '#FFFBEB', color: '#F59E0B' }

  const planStili = (plan) =>
    plan === 'Enterprise' ? { backgroundColor: isDark ? '#374151' : '#090C14', color: 'white' } :
    plan === 'Pro' ? { backgroundColor: isDark ? '#4B5563' : '#374151', color: 'white' } :
    { backgroundColor: tagBg, color: textSecondary }

  const verileriGetir = useCallback(async (hedefSayfa, aramaMetni) => {
    setYukleniyor(true)
    setHata(null)
    try {
      const [abn, ftr] = await Promise.all([
        adminService.abonelikleriGetir({ sayfa: hedefSayfa, boyut: SAYFA_BOYUTU, arama: aramaMetni }),
        adminService.faturalariGetir({ sayfa: 1, boyut: 10 }).catch(() => ({ faturalar: [] })),
      ])
      setAbonelikler(abn.abonelikler)
      setToplam(abn.toplam)
      setFaturalar(ftr.faturalar)
    } catch (e) {
      setHata(e.message)
      setAbonelikler([]); setToplam(0)
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
  const gosterilen = durumFiltre === 'Tümü'
    ? abonelikler
    : abonelikler.filter((a) => a.odemeDurumu === durumFiltre)

  const aylikGelir = abonelikler
    .filter((a) => a.odemeDurumu === 'Ödendi')
    .reduce((t, a) => t + a.tutar, 0)
  const beklemede = abonelikler.filter((a) => a.odemeDurumu === 'Beklemede')
  const gecikmis = abonelikler.filter((a) => a.odemeDurumu === 'Gecikmiş')

  const kartlar = [
    { baslik: t(lang, 'aylikGelir'), deger: `${aylikGelir.toLocaleString('tr-TR')} ₺`,
      alt: `${t(lang, 'yillikTahmin')}: ${(aylikGelir * 12).toLocaleString('tr-TR')} ₺`,
      icon: TrendingUp, renk: '#10B981' },
    { baslik: t(lang, 'odenen'), deger: abonelikler.filter((a) => a.odemeDurumu === 'Ödendi').length,
      alt: t(lang, 'tahsilEdildi'), icon: CheckCircle, renk: '#10B981' },
    { baslik: t(lang, 'beklemede'), deger: beklemede.length,
      alt: `${beklemede.reduce((t, a) => t + a.tutar, 0).toLocaleString('tr-TR')} ₺ ${t(lang, 'bekliyor')}`,
      icon: Clock, renk: '#F59E0B' },
    { baslik: t(lang, 'gecikmis'), deger: gecikmis.length,
      alt: `${gecikmis.reduce((t, a) => t + a.tutar, 0).toLocaleString('tr-TR')} ₺ ${t(lang, 'tahsilEdilemedi')}`,
      icon: AlertTriangle, renk: '#EF4444' },
  ]

  const handleOdemeIsaretle = async (abonelik) => {
    setIslemde(true)
    try {
      await adminService.odemeDurumuGuncelle(abonelik.tenantId, 'Ödendi')
      toast.success(t(lang, 'odemeIsaretlendi'))
      await verileriGetir(sayfa, arama)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIslemde(false)
    }
  }

  const handleHatirlatmaGonder = () => {
    setIslemde(true)
    setTimeout(() => {
      setIslemde(false); setHatirlatmaModal(false)
      toast.success(`${secili.company} → ${t(lang, 'hatirlatmaGonder')}`)
      setSecili(null)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>{t(lang, 'abonelikler')}</h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>{t(lang, 'odemeTakibi')}</p>
        </div>
        <button onClick={() => verileriGetir(sayfa, arama)} disabled={yukleniyor}
          className="p-2 rounded-lg border transition-colors disabled:opacity-40"
          style={{ borderColor, color: textSecondary }}>
          <RefreshCw className={`w-4 h-4 ${yukleniyor ? 'animate-spin' : ''}`} />
        </button>
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
            <p className="text-sm" style={{ color: textSecondary }}>{t(lang, 'yukleniyor')}</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Özet kartlar */}
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
                    <k.icon className="w-4 h-4" style={{ color: k.renk }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Arama + filtre */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-56 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textSecondary }} />
              <input type="text" placeholder={`${t(lang, 'firma')}...`} value={aramaGirdi}
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
            {DURUMLAR.map((d) => (
              <button key={d.key} onClick={() => setDurumFiltre(d.key)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={durumFiltre === d.key
                  ? { backgroundColor: '#090C14', color: 'white' }
                  : { backgroundColor: inputBg, color: textSecondary, border: `1px solid ${borderColor}` }}>
                {d.label}
                {d.key !== 'Tümü' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({abonelikler.filter((a) => a.odemeDurumu === d.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Abonelik tablosu */}
          {gosterilen.length === 0 ? (
            <EmptyState title="Abonelik bulunamadı"
              description={arama ? `"${arama}" aramasına uygun kayıt yok.` : 'Henüz abonelik kaydı yok.'} />
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
                    <tr>
                      {[t(lang, 'firma'), t(lang, 'plan'), t(lang, 'tutar'), t(lang, 'odemeYontemi'),
                        t(lang, 'sonOdeme'), t(lang, 'sonrakiOdeme'), t(lang, 'durum'), t(lang, 'islem')].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                          style={{ color: textSecondary }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gosterilen.map((a) => (
                      <tr key={a.tenantId} className="border-b transition-colors" style={{ borderColor: divider }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td className="px-4 py-3">
                          <p className="font-medium whitespace-nowrap cursor-pointer" style={{ color: textPrimary }}
                            onClick={() => navigate(`/firmalar/${a.tenantId}`)}>{a.company}</p>
                          <p className="text-xs mt-0.5" style={{ color: textTertiary }}>{a.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium" style={planStili(a.plan)}>
                            {a.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: textPrimary }}>
                          {a.tutar.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: textSecondary }}>
                          {a.odemeYontemi}
                        </td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: textSecondary }}>
                          {a.sonOdeme}
                        </td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: textSecondary }}>
                          {a.sonrakiOdeme}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                            style={durumStili(a.odemeDurumu)}>
                            {durumMetni(a.odemeDurumu)}
                            {a.gecikmeGun > 0 && ` · ${a.gecikmeGun}g`}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {a.odemeDurumu !== 'Ödendi' ? (
                              <>
                                <button onClick={() => handleOdemeIsaretle(a)} disabled={islemde}
                                  className="text-xs font-medium px-3 py-1.5 rounded-lg border whitespace-nowrap disabled:opacity-40"
                                  style={{ borderColor: isDark ? 'rgba(16,185,129,0.3)' : '#A7F3D0', color: '#10B981' }}>
                                  {t(lang, 'odendiIsaretle')}
                                </button>
                                <button onClick={() => { setSecili(a); setHatirlatmaModal(true) }}
                                  className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border whitespace-nowrap"
                                  style={{ borderColor, color: textSecondary }}>
                                  <Send className="w-3 h-3" /> {t(lang, 'hatirlat')}
                                </button>
                              </>
                            ) : (
                              <span className="text-xs" style={{ color: textTertiary }}>—</span>
                            )}
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
                    Sayfa {sayfa} / {toplamSayfa} — toplam {toplam.toLocaleString('tr-TR')}
                  </p>
                  <div className="flex items-center gap-1 flex-wrap">
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
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Fatura geçmişi */}
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: divider }}>
              <CreditCard className="w-4 h-4" style={{ color: textSecondary }} />
              <h2 className="font-semibold" style={{ color: textPrimary }}>{t(lang, 'faturaGecmisi')}</h2>
            </div>
            {faturalar.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: textSecondary }}>
                Henüz fatura kaydı yok.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b" style={{ backgroundColor: theadBg, borderColor: divider }}>
                    <tr>
                      {[t(lang, 'faturaNo'), t(lang, 'firma'), t(lang, 'tutar'), t(lang, 'tarih'), t(lang, 'durum')].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                          style={{ color: textSecondary }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {faturalar.map((f) => (
                      <tr key={f.id} className="border-b transition-colors" style={{ borderColor: divider }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td className="px-5 py-3">
                          <span className="text-xs font-mono px-2 py-1 rounded"
                            style={{ backgroundColor: tagBg, color: textSecondary }}>{f.id}</span>
                        </td>
                        <td className="px-5 py-3 font-medium whitespace-nowrap" style={{ color: textPrimary }}>
                          {f.company}
                        </td>
                        <td className="px-5 py-3 font-semibold whitespace-nowrap" style={{ color: textPrimary }}>
                          {f.tutar.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="px-5 py-3 text-xs whitespace-nowrap" style={{ color: textSecondary }}>{f.tarih}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium" style={durumStili(f.durum)}>
                            {durumMetni(f.durum)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Hatırlatma modalı */}
      <Modal isOpen={hatirlatmaModal} onClose={() => { setHatirlatmaModal(false); setSecili(null) }}
        title={t(lang, 'odemeHatirlatmasi')}>
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: textSecondary }}>
            <span className="font-semibold" style={{ color: textPrimary }}>{secili?.company}</span>
            {' → '}
            <span className="font-semibold" style={{ color: textPrimary }}>{secili?.email}</span>
          </p>
          <div className="p-3 rounded-lg text-xs"
            style={{ backgroundColor: isDark ? '#111827' : '#F9FAFB', color: textSecondary }}>
            <p className="font-medium mb-1" style={{ color: textPrimary }}>{t(lang, 'gonderilecekBilgi')}</p>
            <p>{t(lang, 'tutar')}: {secili?.tutar.toLocaleString('tr-TR')} ₺</p>
            <p>{t(lang, 'sonOdeme')}: {secili?.sonOdeme}</p>
            {secili?.gecikmeGun > 0 && (
              <p>{t(lang, 'gecikme')}: {secili.gecikmeGun} {t(lang, 'gun')}</p>
            )}
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={() => { setHatirlatmaModal(false); setSecili(null) }} className="flex-1">
              {t(lang, 'vazgec')}
            </Button>
            <Button onClick={handleHatirlatmaGonder} loading={islemde} className="flex-1">
              {islemde ? t(lang, 'gonderiliyor') : t(lang, 'hatirlatmaGonder')}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}