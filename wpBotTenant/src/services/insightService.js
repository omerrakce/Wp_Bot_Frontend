import { api } from './api'

const yokMu = (e) => e.status === 404 || e.status === 405 || e.status === 0

const ONCELIK_SIRA = { Kritik: 0, Yüksek: 1, Orta: 2, Düşük: 3 }

const oncelikBul = (adet) => {
  if (adet >= 100) return 'Kritik'
  if (adet >= 40) return 'Yüksek'
  if (adet >= 15) return 'Orta'
  return 'Düşük'
}

const noMatchNormalize = (n = {}) => ({
  id: n.id,
  aramaMetni: n.aramaMetni ?? n.query ?? n.aranan ?? 'Belirtilmemiş',
  adet: n.adet ?? n.count ?? 1,
  oncelik: n.oncelik ?? oncelikBul(n.adet ?? n.count ?? 1),
  gorselUrl: n.gorselUrl ?? n.image_url ?? null,
  sonGorulme: n.sonGorulme ?? n.last_seen ?? null,
})

export const insightService = {
  async stokAcigi({ periyot = 'ay' } = {}) {
    try {
      const veri = await api.get(`/api/tenant/insights/no-match?period=${periyot}`)
      const liste = Array.isArray(veri) ? veri : (veri.items ?? [])
      const normalize = liste.map(noMatchNormalize)
        .sort((a, b) => (ONCELIK_SIRA[a.oncelik] ?? 9) - (ONCELIK_SIRA[b.oncelik] ?? 9))
      return { kayitlar: normalize, canli: true }
    } catch (e) {
      if (yokMu(e)) return { kayitlar: [], canli: false }
      throw e
    }
  },

  async trendUrunler({ periyot = 'ay' } = {}) {
    try {
      const veri = await api.get(`/api/tenant/insights/trending?period=${periyot}`)
      const liste = Array.isArray(veri) ? veri : (veri.items ?? [])
      return {
        urunler: liste.map((u) => ({
          urunId: u.urunId ?? u.product_id,
          begeni: u.begeni ?? 0,
          gosterim: u.gosterim ?? u.match_count ?? 0,
        })),
        canli: true,
      }
    } catch (e) {
      if (yokMu(e)) return { urunler: [], canli: false }
      throw e
    }
  },
}