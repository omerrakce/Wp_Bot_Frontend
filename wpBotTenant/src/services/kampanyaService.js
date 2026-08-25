import { api } from './api'

const yokMu = (e) => e.status === 404 || e.status === 405 || e.status === 0
const MOCK_KEY = 'wpbot_kampanyalar_mock'

const mockOku = () => {
  try { return JSON.parse(localStorage.getItem(MOCK_KEY) || '[]') } catch { return [] }
}
const mockYaz = (liste) => localStorage.setItem(MOCK_KEY, JSON.stringify(liste))

const dosyayaBase64 = (dosya) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(dosya)
})

const durumCevir = (k) => {
  if (k.durum === 'Aktif' || k.durum === 'Pasif') return k.durum
  if (k.status === 'active' || k.status === true) return 'Aktif'
  if (k.status === 'passive' || k.status === 'inactive' || k.status === false) return 'Pasif'
  return 'Aktif'
}

const kampanyaNormalize = (k = {}) => ({
  id: k.id,
  baslik: k.title ?? k.baslik ?? '',
  metin: k.text ?? k.metin ?? '',
  gorselUrl: k.image_url ?? k.gorselUrl ?? k.image ?? '',
  durum: durumCevir(k),
  olusturmaTarihi: k.created_at ?? k.olusturmaTarihi ?? null,
  gonderimSayisi: k.sent_count ?? k.gonderimSayisi ?? null,
  sonGonderimTarihi: k.last_broadcast_at ?? k.sonGonderimTarihi ?? null,
})

export const kampanyaService = {
  async listele() {
    try {
      const veri = await api.get('/api/campaigns')
      const liste = Array.isArray(veri) ? veri : (veri.items ?? [])
      return { kampanyalar: liste.map(kampanyaNormalize), canli: true }
    } catch (e) {
      if (!yokMu(e)) throw e
      return { kampanyalar: mockOku().map(kampanyaNormalize), canli: false }
    }
  },

  async olustur(form, dosya) {
    const fd = new FormData()
    fd.append('title', form.baslik.trim())
    fd.append('text', form.metin.trim())
    if (dosya) fd.append('image', dosya)

    try {
      const veri = await api.post('/api/campaigns', fd)
      return { veri: kampanyaNormalize(veri), canli: true }
    } catch (e) {
      if (!yokMu(e)) throw e
      const gorselUrl = dosya ? await dosyayaBase64(dosya) : ''
      const yeni = {
        id: `mock-${Date.now()}`,
        title: form.baslik.trim(),
        text: form.metin.trim(),
        image_url: gorselUrl,
        durum: 'Aktif',
        created_at: new Date().toISOString(),
        sent_count: 0,
        last_broadcast_at: null,
      }
      const liste = mockOku()
      liste.unshift(yeni)
      mockYaz(liste)
      return { veri: kampanyaNormalize(yeni), canli: false }
    }
  },

  async durumDegistir(id, yeniDurum) {
    try {
      const veri = await api.patch(`/api/campaigns/${id}`, { durum: yeniDurum })
      return { veri: kampanyaNormalize(veri), canli: true }
    } catch (e) {
      if (!yokMu(e)) throw e
      const liste = mockOku().map((k) => (k.id === id ? { ...k, durum: yeniDurum } : k))
      mockYaz(liste)
      return { veri: kampanyaNormalize(liste.find((k) => k.id === id)), canli: false }
    }
  },

  async sil(id) {
    try {
      await api.delete(`/api/campaigns/${id}`)
      return { canli: true }
    } catch (e) {
      if (!yokMu(e)) throw e
      mockYaz(mockOku().filter((k) => k.id !== id))
      return { canli: false }
    }
  },

  // Toplu gönderim ASLA sahte başarı döndürmez — uç yoksa hata fırlatır,
  // kullanıcı gerçek durumu görür.
  async broadcastGonder(id) {
    const veri = await api.post(`/api/campaigns/${id}/broadcast`)
    return {
      basarili: veri.success ?? veri.basarili ?? true,
      hedefSayisi: veri.target_count ?? veri.hedefSayisi ?? null,
      mesaj: veri.message ?? veri.mesaj ?? null,
    }
  },
}