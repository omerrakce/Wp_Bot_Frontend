import { api } from './api'

const yokMu = (e) => e.status === 404 || e.status === 405 || e.status === 0
const MOCK_KEY = 'wpbot_faq_settings'

const faqNormalize = (d = {}) => ({
  faqKargo: d.faq_shipping ?? '',
  faqIade: d.faq_return ?? '',
  faqBeden: d.faq_sizing ?? '',
})

export const botSettingsService = {
  async getir() {
    try {
      const veri = await api.get('/api/tenant/bot-settings')
      return { veri: faqNormalize(veri), canli: true }
    } catch (e) {
      if (!yokMu(e)) throw e
      const kayitli = localStorage.getItem(MOCK_KEY)
      const baslangic = kayitli ? JSON.parse(kayitli) : {}
      return { veri: faqNormalize(baslangic), canli: false }
    }
  },

  async kaydet(form) {
    const govde = {
      faq_shipping: form.faqKargo.trim(),
      faq_return: form.faqIade.trim(),
      faq_sizing: form.faqBeden.trim(),
    }
    try {
      const veri = await api.put('/api/tenant/bot-settings', govde)
      localStorage.removeItem(MOCK_KEY)
      return { veri: faqNormalize(veri), canli: true }
    } catch (e) {
      if (!yokMu(e)) throw e
      localStorage.setItem(MOCK_KEY, JSON.stringify(govde))
      return { veri: faqNormalize(govde), canli: false }
    }
  },
}