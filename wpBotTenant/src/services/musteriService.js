import { api } from './api'
import { sadeceRakam } from '../components/common/PhoneInput'
import { mockMusteriler } from '../mocks/mockData'

const yokMu = (e) => e.status === 404 || e.status === 405 || e.status === 0

// API → UI
const apidenGelen = (m = {}) => ({
  id: m.id,
  kod: m.kod ?? (m.id ? `MŞT-${String(m.id).slice(0, 6)}` : '—'),
  telefon: sadeceRakam(m.telefon ?? ''),
  begeni: m.begeni ?? 0,
  begenmeme: m.begenmeme ?? 0,
  vektorEtiketleri: Array.isArray(m.vektorEtiketleri)
    ? m.vektorEtiketleri.map((v) => ({
        etiket: v.etiket ?? String(v),
        skor: typeof v.skor === 'number' ? v.skor : 0,
      }))
    : [],
  begenilenUrunler: Array.isArray(m.begenilenUrunler) ? m.begenilenUrunler : [],
  begenilmeyenUrunler: Array.isArray(m.begenilmeyenUrunler) ? m.begenilmeyenUrunler : [],
})

const OLAY_ETIKET = {
  image_received: { baslik: 'Görsel gönderdi', renk: '#3B82F6' },
  match_shown: { baslik: 'Ürün önerildi', renk: '#00B4B4' },
  product_liked: { baslik: 'Ürünü beğendi', renk: '#10B981' },
  product_disliked: { baslik: 'Ürünü beğenmedi', renk: '#EF4444' },
  cart_redirect: { baslik: 'Satın almaya yönlendi', renk: '#8B5CF6' },
  agent_connect: { baslik: 'Temsilciye bağlandı', renk: '#F59E0B' },
  similar_search: { baslik: 'Benzer ürün aradı', renk: '#3B82F6' },
  rating_given: { baslik: 'Değerlendirme yaptı', renk: '#00B4B4' },
  no_match: { baslik: 'Eşleşme bulunamadı', renk: '#9CA3AF' },
}

const olayNormalize = (o = {}) => {
  const etiket = OLAY_ETIKET[o.type] || { baslik: o.type || 'Etkinlik', renk: '#9CA3AF' }
  return {
    id: o.id,
    tip: o.type ?? 'bilinmiyor',
    baslik: etiket.baslik,
    renk: etiket.renk,
    urunId: o.product_id ?? o.urunId ?? null,
    detay: o.metadata ?? o.metadata_json ?? {},
    tarih: o.created_at ?? o.tarih ?? null,
  }
}

export const musteriService = {
  async listele({ sayfa = 1, boyut = 20, arama = '' } = {}) {
    const params = new URLSearchParams({ page: sayfa, page_size: boyut })
    if (arama.trim()) params.set('search', arama.trim())

    try {
      const veri = await api.get(`/api/tenant/customers?${params}`)

      if (Array.isArray(veri)) {
        return { musteriler: veri.map(apidenGelen), toplam: veri.length, canli: true }
      }
      return {
        musteriler: (veri.items ?? []).map(apidenGelen),
        toplam: veri.total ?? 0,
        canli: true,
      }
    } catch (e) {
      if (!yokMu(e)) throw e

      // Uç hazır değil — mock veriyle çalış
      const tumu = mockMusteriler.map(apidenGelen)
      const filtreli = arama.trim()
        ? tumu.filter((m) =>
            m.kod.toLowerCase().includes(arama.toLowerCase()) ||
            m.telefon.includes(sadeceRakam(arama)))
        : tumu
      const bas = (sayfa - 1) * boyut
      return {
        musteriler: filtreli.slice(bas, bas + boyut),
        toplam: filtreli.length,
        canli: false,
      }
    }
  },

  async detay(id) {
    try {
      const veri = await api.get(`/api/tenant/customers/${id}`)
      return { musteri: apidenGelen(veri), canli: true }
    } catch (e) {
      if (!yokMu(e)) throw e
      const bulunan = mockMusteriler.find((m) => String(m.id) === String(id))
      return { musteri: bulunan ? apidenGelen(bulunan) : null, canli: false }
    }
  },

    async zaman_cizelgesi(id) {
    try {
      const veri = await api.get(`/api/tenant/customers/${id}/timeline`)
      const liste = Array.isArray(veri) ? veri : (veri.items ?? [])
      return { olaylar: liste.map(olayNormalize), canli: true }
    } catch (e) {
      if (!yokMu(e)) throw e
      return { olaylar: [], canli: false }
    }
  },

    async olustur(form) {
    const govde = {
      telefon: sadeceRakam(form.telefon),
      begeni: Number(form.begeni) || 0,
      begenmeme: Number(form.begenmeme) || 0,
      vektorEtiketleri: form.vektorEtiketleri ?? [],
      begenilenUrunler: form.begenilenUrunler ?? [],
      begenilmeyenUrunler: form.begenilmeyenUrunler ?? [],
    }
    const veri = await api.post('/api/tenant/customers', govde)
    return apidenGelen(veri)
  },

  async guncelle(id, form) {
    const govde = {
      telefon: sadeceRakam(form.telefon),
      begeni: Number(form.begeni) || 0,
      begenmeme: Number(form.begenmeme) || 0,
      vektorEtiketleri: form.vektorEtiketleri ?? [],
      begenilenUrunler: form.begenilenUrunler ?? [],
      begenilmeyenUrunler: form.begenilmeyenUrunler ?? [],
    }
    const veri = await api.put(`/api/tenant/customers/${id}`, govde)
    return apidenGelen(veri)
  },

  async sil(id) {
    await api.delete(`/api/tenant/customers/${id}`)
  },
}