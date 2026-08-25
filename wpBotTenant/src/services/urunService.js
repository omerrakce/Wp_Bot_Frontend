import { api } from './api'

const DUMMY_URETICI = '123e4567-e89b-12d3-a456-426614174000'
const VARSAYILAN_GORSEL = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'

const tlFormat = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
})

export const fiyatFormatla = (sayi) => {
  const n = Number(sayi)
  return Number.isNaN(n) ? '-' : tlFormat.format(n)
}

export const fiyatSayiya = (metin) => {
  const temiz = String(metin).replace(/\./g, '').replace(',', '.')
  const n = parseFloat(temiz)
  return Number.isNaN(n) ? 0 : n
}

const uuidMi = (deger) => /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(String(deger))

// API → UI
const apidenGelen = (u) => ({
  id: u.id,
  name: u.name || 'İsimsiz Ürün',
  image: u.image || VARSAYILAN_GORSEL,
  price: fiyatFormatla(u.price),
  priceRaw: u.price ?? 0,
  category: u.category || '-',
  renk: u.renk || '-',
  uretici: (u.uretici && !uuidMi(u.uretici)) ? u.uretici : '-',
  bedenler: Array.isArray(u.bedenler) ? u.bedenler : [],
  urunKodu: u.urunKodu || '-',
  sezon: u.sezon || '-',
  status: u.status || 'Aktif',
  stock: u.stock ?? 0,
})

// UI → API
const apiyeGiden = (form, gorselUrl) => ({
  name: form.name.trim(),
  image: gorselUrl || '',
  price: fiyatSayiya(form.price),
  category: form.category,
  renk: form.renk.trim(),
  uretici: DUMMY_URETICI,
  bedenler: form.bedenler,
  urunKodu: form.urunKodu.trim(),
  sezon: form.sezon || '',
  status: form.status,
  stock: Number(form.stock) || 0,
})

export const urunService = {
      async listele({ sayfa = 1, boyut = 20, arama = '', kategori = '' } = {}) {
    const params = new URLSearchParams({ page: sayfa, page_size: boyut })
    if (arama.trim()) params.set('search', arama.trim())
    if (kategori) params.set('category', kategori)

    const veri = await api.get(`/api/tenant/products?${params}`)

    if (Array.isArray(veri)) {
      return { urunler: veri.map(apidenGelen), toplam: veri.length, sayfa, boyut }
    }
    return {
      urunler: (veri.items ?? []).map(apidenGelen),
      toplam: veri.total ?? 0,
      sayfa: veri.page ?? sayfa,
      boyut: veri.page_size ?? boyut,
    }
  },

  async gorselYukle(dosya) {
    const fd = new FormData()
    fd.append('file', dosya)
    const veri = await api.post('/api/upload', fd)
    return veri.url
  },

  async olustur(form, dosya) {
    const gorselUrl = dosya ? await this.gorselYukle(dosya) : ''
    const veri = await api.post('/api/tenant/products', apiyeGiden(form, gorselUrl))
    return apidenGelen(veri)
  },

  async sil(id) {
    await api.delete(`/api/tenant/products/${id}`)
  },

    async guncelle(id, form, dosya, mevcutGorsel) {
    const gorselUrl = dosya ? await this.gorselYukle(dosya) : (mevcutGorsel || '')
    const veri = await api.put(`/api/tenant/products/${id}`, apiyeGiden(form, gorselUrl))
    return apidenGelen(veri)
  },

    async kategoriIstatistikleri() {
    const veri = await api.get('/api/tenant/products/category-stats')
    const liste = Array.isArray(veri) ? veri : (veri.items ?? [])
    return liste.map((k) => ({
      kategori: k.category ?? k.kategori ?? 'Kategorisiz',
      adet: k.count ?? k.adet ?? 0,
    }))
  },

  async whatsappSenkronEt() {
    const veri = await api.post('/api/tenant/whatsapp/sync-catalog')
    return {
      basarili: veri.success ?? veri.basarili ?? true,
      mesaj: veri.message ?? veri.mesaj ?? null,
      gonderilenSayisi: veri.synced_count ?? veri.gonderilen ?? null,
    }
  },

}

// Ürünleri kategoriye göre gruplar — { "Elbise": [...], "Etek": [...] }
export const gruplaKategoriye = (urunler) => {
  const gruplar = {}
  urunler.forEach((u) => {
    const kategori = u.category || 'Diğer'
    if (!gruplar[kategori]) gruplar[kategori] = []
    gruplar[kategori].push(u)
  })
  return gruplar
}