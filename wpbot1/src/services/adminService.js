import { api } from './api'
import { sadeceRakam } from '../components/common/PhoneInput'

const yokMu = (e) => e.status === 404 || e.status === 405 || e.status === 0

// API → UI
const firmaNormalize = (f = {}) => ({
  id: f.id,
  company: f.company ?? f.name ?? '',
  plan: f.plan ?? 'Starter',
  status: f.status ?? 'Aktif',
  telefon: sadeceRakam(f.telefon ?? ''),
  email: f.email ?? '',
  adres: f.adres || '',
  yetkili: f.yetkili || '',
  botNumara: sadeceRakam(f.botNumara ?? ''),

  urunToplam: f.urunToplam ?? 0,
  urunAktif: f.urunAktif ?? 0,
  urunPasif: f.urunPasif ?? 0,

  musteriToplam: f.musteriToplam ?? 0,
  sepeteYonlendirme: f.sepeteYonlendirme ?? 0,
  temsilciyeBaglanti: f.temsilciyeBaglanti ?? 0,
  benzeriArama: f.benzeriArama ?? 0,

  degerlendirmeSayisi: f.degerlendirmeSayisi ?? 0,
  memnunSayisi: f.memnunSayisi ?? 0,
  gorselGonderilen: f.gorselGonderilen ?? 0,
  gorselEslesen: f.gorselEslesen ?? 0,

  joinDate: f.joinDate ?? f.created_at ?? null,
  abonelik: f.abonelik ?? null,
  davet: f.davet ?? null,
})

const AY_KISA = { '01': 'Oca', '02': 'Şub', '03': 'Mar', '04': 'Nis', '05': 'May', '06': 'Haz',
  '07': 'Tem', '08': 'Ağu', '09': 'Eyl', '10': 'Eki', '11': 'Kas', '12': 'Ara' }

const raporNormalize = (r = {}) => ({
  ozet: {
    musteriToplam: r.ozet?.musteriToplam ?? 0,
    sepeteYonlendirme: r.ozet?.sepeteYonlendirme ?? 0,
    gorselGonderilen: r.ozet?.gorselGonderilen ?? 0,
    gorselEslesen: r.ozet?.gorselEslesen ?? 0,
    degerlendirmeSayisi: r.ozet?.degerlendirmeSayisi ?? 0,
    memnunSayisi: r.ozet?.memnunSayisi ?? 0,
  },
  aylikVeri: (r.aylikVeri ?? []).map((a) => ({
    ay: a.ay ?? AY_KISA[String(a.month ?? '').padStart(2, '0')] ?? '-',
    gorsel: a.gorsel ?? a.image_count ?? 0,
    sepet: a.sepet ?? a.cart_count ?? 0,
  })),
  planDagilim: (r.planDagilim ?? []).map((p) => ({
    plan: p.plan, count: p.count ?? 0,
  })),
  firmalar: (r.firmalar ?? []).map(firmaNormalize),
})

// UI → API
const firmaGovde = (form, status) => ({
  name: form.company.trim(),
  company: form.company.trim(),
  plan: form.plan,
  status: status ?? form.status ?? 'Aktif',
  telefon: sadeceRakam(form.telefon),
  email: form.email.trim(),
  adres: form.adres.trim(),
  yetkili: form.yetkili.trim(),
})

const tarihMetni = (t) => {
  if (!t) return '-'
  try {
    return new Date(t).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
  } catch { return '-' }
}

const abonelikNormalize = (a = {}) => ({
  tenantId: a.tenantId ?? a.tenant_id ?? a.id,
  company: a.company ?? a.name ?? '',
  email: a.email ?? '',
  plan: a.plan ?? 'Starter',
  tutar: a.tutar ?? 0,
  odemeDurumu: a.odemeDurumu ?? 'Beklemede',
  sonOdeme: tarihMetni(a.sonOdeme),
  sonrakiOdeme: tarihMetni(a.sonrakiOdeme),
  gecikmeGun: a.gecikmeGun ?? 0,
  odemeYontemi: a.odemeYontemi || '—',
})

const faturaNormalize = (f = {}) => ({
  id: f.id ?? f.fatura_no ?? '—',
  tenantId: f.tenantId ?? f.tenant_id ?? null,
  company: f.company ?? f.name ?? '',
  tutar: f.tutar ?? 0,
  tarih: tarihMetni(f.tarih ?? f.created_at),
  durum: f.durum ?? 'Beklemede',
})

export const adminService = {
  async firmalariGetir({ sayfa = 1, boyut = 20, arama = '' } = {}) {
    const params = new URLSearchParams({ page: sayfa, page_size: boyut })
    if (arama.trim()) params.set('search', arama.trim())

    const veri = await api.get(`/api/admin/tenants?${params}`)

    if (Array.isArray(veri)) {
      return { firmalar: veri.map(firmaNormalize), toplam: veri.length }
    }
    return {
      firmalar: (veri.items ?? []).map(firmaNormalize),
      toplam: veri.total ?? 0,
    }
  },

  async firmaDetay(id) {
    const veri = await api.get(`/api/admin/tenants/${id}`)
    return firmaNormalize(veri)
  },

   async firmaOlustur(form) {
    const veri = await api.post('/api/admin/tenants', firmaGovde(form))
    return {
      firma: firmaNormalize(veri),
      davetGonderildi: veri.davet_gonderildi ?? true,
      davetMesaji: veri.message ?? null,
    }
  },

    async davetYenidenGonder(id) {
    const veri = await api.post(`/api/admin/tenants/${id}/resend-invite`)
    return {
      davetGonderildi: veri.davet_gonderildi ?? true,
      davetMesaji: veri.message ?? null,
    }
  },

  async firmaGuncelle(id, form, status) {
    const veri = await api.put(`/api/admin/tenants/${id}`, firmaGovde(form, status))
    return firmaNormalize(veri)
  },

  async durumDegistir(id, yeniDurum) {
    const veri = await api.patch(`/api/admin/tenants/${id}/status`, { status: yeniDurum })
    return firmaNormalize(veri)
  },
    async platformIstatistik() {
    const veri = await api.get('/api/admin/stats')
    return {
      firmaToplam: veri.firmaToplam ?? veri.tenantToplam ?? 0,
      firmaAktif: veri.firmaAktif ?? veri.tenantAktif ?? 0,
      musteriToplam: veri.musteriToplam ?? 0,
      urunToplam: veri.urunToplam ?? 0,
      gorselGonderilen: veri.gorselGonderilen ?? 0,
      gorselEslesen: veri.gorselEslesen ?? 0,
      sepeteYonlendirme: veri.sepeteYonlendirme ?? 0,
      degerlendirmeSayisi: veri.degerlendirmeSayisi ?? 0,
      memnunSayisi: veri.memnunSayisi ?? 0,
    }
  },

     async raporlar({ periyot = 'ay' } = {}) {
    // Firma tablosu ve plan dağılımı her zaman güncel firma listesinden hesaplanır
    const firmaSonuc = await this.firmalariGetir({ sayfa: 1, boyut: 100 })
    const firmalar = firmaSonuc.firmalar
    const planDagilim = ['Enterprise', 'Pro', 'Starter'].map((plan) => ({
      plan, count: firmalar.filter((f) => f.plan === plan).length,
    }))

    try {
      const veri = await api.get(`/api/admin/reports?period=${periyot}`)
        const ozet = {
        musteriToplam: veri.musteriToplam ?? 0,
        sepeteYonlendirme: veri.sepeteYonlendirme ?? 0,
        gorselGonderilen: veri.gorselGonderilen ?? 0,
        gorselEslesen: veri.gorselEslesen ?? 0,
        onerilenUrunSayisi: veri.onerilenUrunSayisi ?? 0,
        degerlendirmeSayisi: veri.degerlendirmeSayisi ?? 0,
        memnunSayisi: veri.memnunSayisi ?? 0,
      }
      const aylikVeri = Array.isArray(veri.aylikVeri)
        ? veri.aylikVeri.map((a) => ({
            ay: a.ay ?? AY_KISA[String(a.month ?? '').padStart(2, '0')] ?? '-',
            gorsel: a.gorsel ?? a.image_count ?? 0,
            sepet: a.sepet ?? a.cart_count ?? 0,
          }))
        : []
      return { veri: { ozet, aylikVeri, planDagilim, firmalar }, canli: true }
    } catch (e) {
      if (!yokMu(e)) throw e

        const ozet = firmalar.reduce((acc, f) => ({
        musteriToplam: acc.musteriToplam + f.musteriToplam,
        sepeteYonlendirme: acc.sepeteYonlendirme + f.sepeteYonlendirme,
        gorselGonderilen: acc.gorselGonderilen + f.gorselGonderilen,
        gorselEslesen: acc.gorselEslesen + f.gorselEslesen,
        onerilenUrunSayisi: acc.onerilenUrunSayisi + (f.onerilenUrunSayisi ?? 0),
        degerlendirmeSayisi: acc.degerlendirmeSayisi + f.degerlendirmeSayisi,
        memnunSayisi: acc.memnunSayisi + f.memnunSayisi,
      }), { musteriToplam: 0, sepeteYonlendirme: 0, gorselGonderilen: 0, gorselEslesen: 0, onerilenUrunSayisi: 0, degerlendirmeSayisi: 0, memnunSayisi: 0 })

      return { veri: { ozet, aylikVeri: [], planDagilim, firmalar }, canli: false }
    }
  },

  async abonelikleriGetir({ sayfa = 1, boyut = 20, arama = '' } = {}) {
    const params = new URLSearchParams({ page: sayfa, page_size: boyut })
    if (arama.trim()) params.set('search', arama.trim())

    const veri = await api.get(`/api/admin/subscriptions?${params}`)
    const liste = Array.isArray(veri) ? veri : (veri.items ?? [])

    return {
      abonelikler: liste.map(abonelikNormalize),
      toplam: Array.isArray(veri) ? veri.length : (veri.total ?? 0),
    }
  },

  async odemeDurumuGuncelle(tenantId, yeniDurum) {
    const veri = await api.patch(`/api/admin/subscriptions/${tenantId}`, { odemeDurumu: yeniDurum })
    return abonelikNormalize(veri)
  },

  async faturalariGetir({ sayfa = 1, boyut = 20 } = {}) {
    const params = new URLSearchParams({ page: sayfa, page_size: boyut })
    const veri = await api.get(`/api/admin/invoices?${params}`)
    const liste = Array.isArray(veri) ? veri : (veri.items ?? [])

    return {
      faturalar: liste.map(faturaNormalize),
      toplam: Array.isArray(veri) ? veri.length : (veri.total ?? 0),
    }
  },
}