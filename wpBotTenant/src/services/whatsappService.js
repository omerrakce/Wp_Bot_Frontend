import { api } from './api'

const yokMu = (e) => e.status === 404 || e.status === 405 || e.status === 0

const durumNormalize = (d = {}) => ({
  bagli: d.bagli ?? d.connected ?? false,
  durum: d.durum ?? d.status ?? 'baglanmadi',  // baglanmadi | onay_bekliyor | aktif | hata
  telefon: d.telefon ?? d.display_phone_number ?? '',
  phoneNumberId: d.phoneNumberId ?? d.wa_phone_number_id ?? null,
  wabaId: d.wabaId ?? d.wa_waba_id ?? null,
  isletmeAdi: d.isletmeAdi ?? d.verified_name ?? '',
  kaliteDurumu: d.kaliteDurumu ?? d.quality_rating ?? null,
  baglantiTarihi: d.baglantiTarihi ?? d.connected_at ?? null,
  hataMesaji: d.hataMesaji ?? d.error ?? null,
})

const MOCK_KEY = 'wpbot_wa_mock'
const AYAR_KEY = 'wpbot_bot_settings'

export const whatsappService = {
 async durumGetir() {
    try {
      const veri = await api.get('/api/tenant/whatsapp/status')
      localStorage.removeItem(MOCK_KEY)   // gerçek uç geldi, mock'a gerek yok
      return { veri: durumNormalize(veri), canli: true }
    } catch (e) {
      if (yokMu(e)) {
        const kayitli = localStorage.getItem(MOCK_KEY)
        if (kayitli) {
          try {
            return { veri: durumNormalize(JSON.parse(kayitli)), canli: false }
          } catch { /* bozuk kayıt, yoksay */ }
        }
        return { veri: durumNormalize({ bagli: false, durum: 'baglanmadi' }), canli: false }
      }
      throw e
    }
  },

   // Mock akış: Meta ekranı simüle edildikten sonra backend'e bildirilir
  async baglantiTamamla(telefon) {
        const govde = {
      // Gerçek Embedded Signup geldiğinde buraya Meta'dan dönen kod gelecek
      code: `mock-code-${Date.now()}`,
      mock: true,
      telefon: String(telefon),
    }
    try {
      const veri = await api.post('/api/tenant/whatsapp/connect', govde)
      localStorage.removeItem(MOCK_KEY)
      return { veri: durumNormalize(veri), canli: true }
    } catch (e) {
      if (!yokMu(e)) throw e

      // Uç henüz yok — yerelde tut
      const yerel = durumNormalize({
        bagli: true, durum: 'aktif', telefon,
        phoneNumberId: 'mock-' + Date.now(),
        wabaId: 'mock-waba-' + Date.now(),
        isletmeAdi: 'Test İşletmesi',
        kaliteDurumu: 'GREEN',
        baglantiTarihi: new Date().toISOString(),
      })
      localStorage.setItem(MOCK_KEY, JSON.stringify(yerel))
      return { veri: yerel, canli: false }
    }
  },

  async baglantiKes() {
    localStorage.removeItem(MOCK_KEY)
    try {
      await api.delete('/api/tenant/whatsapp/disconnect')
      return { canli: true }
    } catch (e) {
      if (yokMu(e)) return { canli: false }
      throw e
    }
  },

    // ---- Bot Ayarları ----
  ayarNormalize(a = {}) {
    return {
      karsilamaMesaji: a.karsilamaMesaji ?? '',
      calismaSaatleri: {
        aktif: a.calismaSaatleri?.aktif ?? false,
        baslangic: a.calismaSaatleri?.baslangic ?? '09:00',
        bitis: a.calismaSaatleri?.bitis ?? '18:00',
      },
      mesaiDisiMesaji: a.mesaiDisiMesaji ?? '',
      gorselAramaAktif: a.gorselAramaAktif ?? true,
      gunlukKapsulAktif: a.gunlukKapsulAktif ?? true,
      sonucAdedi: a.sonucAdedi ?? 3,
    }
  },

  async ayarlariGetir() {
    try {
      const veri = await api.get('/api/tenant/whatsapp/settings')
      return { veri: this.ayarNormalize(veri), canli: true }
    } catch (e) {
      if (yokMu(e)) {
        const kayitli = localStorage.getItem(AYAR_KEY)
        const baslangic = kayitli ? JSON.parse(kayitli) : {
          karsilamaMesaji: 'Merhaba! Aradığınız ürünün fotoğrafını gönderin, size en yakın modelleri bulalım.',
          mesaiDisiMesaji: 'Şu an çalışma saatlerimiz dışındayız. En kısa sürede size dönüş yapacağız.',
        }
        return { veri: this.ayarNormalize(baslangic), canli: false }
      }
      throw e
    }
  },

  async ayarlariKaydet(ayarlar) {
    const govde = this.ayarNormalize(ayarlar)
    try {
      const veri = await api.put('/api/tenant/whatsapp/settings', govde)
      localStorage.removeItem(AYAR_KEY)
      return { veri: this.ayarNormalize(veri), canli: true }
    } catch (e) {
      if (yokMu(e)) {
        localStorage.setItem(AYAR_KEY, JSON.stringify(govde))
        return { veri: govde, canli: false }
      }
      throw e
    }
  },
}