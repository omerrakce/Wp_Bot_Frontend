import { api } from './api'
import { sadeceRakam } from '../components/common/PhoneInput'

// Backend hazır olmadığında bu değerler kullanılır
const MOCK_AYARLAR = {
  firmaAdi: 'ModaShop A.Ş.',
  botTelefon: '2125550101',
  sepetLinki: 'https://modashop.com/sepet',
  katalogLinki: 'https://modashop.com/katalog',
  tezgahtarAktif: true,
}

const MOCK_TEZGAHTARLAR = [
  { id: 'mock-1', ad: 'Mehmet Demir', telefon: '5321112233', gorsel: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { id: 'mock-2', ad: 'Zeynep Aydın', telefon: '5334445566', gorsel: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { id: 'mock-3', ad: 'Can Öztürk', telefon: '5347778899', gorsel: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
]

// Uç henüz yok — 404/405 gelirse mock'a düşeriz
const yokMu = (e) => e.status === 404 || e.status === 405 || e.status === 0

const ayarNormalize = (a = {}) => ({
  firmaAdi: a.firmaAdi ?? '',
  botTelefon: sadeceRakam(a.botTelefon ?? ''),
  sepetLinki: a.sepetLinki ?? '',
  katalogLinki: a.katalogLinki ?? '',
  tezgahtarAktif: a.tezgahtarAktif ?? false,
})

const tezgahtarNormalize = (t = {}) => ({
  id: t.id,
  ad: t.ad ?? '',
  telefon: sadeceRakam(t.telefon ?? ''),
  gorsel: t.gorsel || '',
})

export const firmaService = {
  // ---- Ayarlar ----
  async ayarlariGetir() {
    try {
      const veri = await api.get('/api/tenant/settings')
      return { veri: ayarNormalize(veri), canli: true }
    } catch (e) {
      if (yokMu(e)) return { veri: { ...MOCK_AYARLAR }, canli: false }
      throw e
    }
  },

  async ayarlariKaydet(ayarlar) {
    const govde = {
      firmaAdi: ayarlar.firmaAdi.trim(),
      botTelefon: sadeceRakam(ayarlar.botTelefon),
      sepetLinki: ayarlar.sepetLinki.trim(),
      katalogLinki: ayarlar.katalogLinki.trim(),
      tezgahtarAktif: ayarlar.tezgahtarAktif,
    }
    try {
      const veri = await api.put('/api/tenant/settings', govde)
      return { veri: ayarNormalize(veri), canli: true }
    } catch (e) {
      if (yokMu(e)) return { veri: ayarNormalize(govde), canli: false }
      throw e
    }
  },

  // ---- Tezgahtarlar ----
  async tezgahtarlariGetir() {
    try {
      const veri = await api.get('/api/tenant/staff')
      const liste = Array.isArray(veri) ? veri : (veri.items ?? [])
      return { veri: liste.map(tezgahtarNormalize), canli: true }
    } catch (e) {
      if (yokMu(e)) return { veri: [...MOCK_TEZGAHTARLAR], canli: false }
      throw e
    }
  },

  async gorselYukle(dosya) {
    const fd = new FormData()
    fd.append('file', dosya)
    const veri = await api.post('/api/upload', fd)
    return veri.url
  },

  async tezgahtarEkle(form, dosya) {
    const gorselUrl = dosya ? await this.gorselYukle(dosya) : (form.gorsel || '')
    const govde = { ad: form.ad.trim(), telefon: sadeceRakam(form.telefon), gorsel: gorselUrl }
    try {
      const veri = await api.post('/api/tenant/staff', govde)
      return { veri: tezgahtarNormalize(veri), canli: true }
    } catch (e) {
      if (yokMu(e)) return { veri: { id: `mock-${Date.now()}`, ...govde }, canli: false }
      throw e
    }
  },

  async tezgahtarGuncelle(id, form, dosya) {
    const gorselUrl = dosya ? await this.gorselYukle(dosya) : (form.gorsel || '')
    const govde = { ad: form.ad.trim(), telefon: sadeceRakam(form.telefon), gorsel: gorselUrl }
    try {
      const veri = await api.put(`/api/tenant/staff/${id}`, govde)
      return { veri: tezgahtarNormalize(veri), canli: true }
    } catch (e) {
      if (yokMu(e)) return { veri: { id, ...govde }, canli: false }
      throw e
    }
  },

  async tezgahtarSil(id) {
    try {
      await api.delete(`/api/tenant/staff/${id}`)
      return { canli: true }
    } catch (e) {
      if (yokMu(e)) return { canli: false }
      throw e
    }
  },
}