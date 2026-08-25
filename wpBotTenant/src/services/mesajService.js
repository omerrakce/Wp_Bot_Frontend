import { api } from './api'

const yokMu = (e) => e.status === 404 || e.status === 405 || e.status === 0

const mesajNormalize = (m = {}) => ({
  id: m.id,
  yon: m.direction ?? m.yon ?? 'in',            // 'in' | 'out'
  tip: m.type ?? m.tip ?? 'text',                // 'text' | 'image' | 'interactive'
  icerik: m.content ?? m.icerik ?? '',
  medyaUrl: m.media_url ?? m.medyaUrl ?? null,
  interaktif: m.interactive ?? m.interaktif ?? null,
  tarih: m.created_at ?? m.tarih ?? null,
})

export const mesajService = {
  async musteriMesajlari(musteriId) {
    try {
      const veri = await api.get(`/api/tenant/customers/${musteriId}/messages`)
      const liste = Array.isArray(veri) ? veri : (veri.items ?? [])
      return { mesajlar: liste.map(mesajNormalize), canli: true }
    } catch (e) {
      if (yokMu(e)) return { mesajlar: [], canli: false }
      throw e
    }
  },
}