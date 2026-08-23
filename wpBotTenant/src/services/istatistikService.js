import { api } from './api'
import { urunService } from './urunService'
import { musteriService } from './musteriService'

const yokMu = (e) => e.status === 404 || e.status === 405 || e.status === 0

export const istatistikService = {
  async ozet() {
    // Özel istatistik ucunu dene
    try {
      const veri = await api.get('/api/tenant/stats')
      return {
        veri: {
          urunToplam: veri.urunToplam ?? 0,
          urunAktif: veri.urunAktif ?? 0,
          urunPasif: veri.urunPasif ?? 0,
          musteriToplam: veri.musteriToplam ?? 0,
          toplamBegeni: veri.toplamBegeni ?? 0,
          toplamBegenmeme: veri.toplamBegenmeme ?? 0,
          populerEtiketler: veri.populerEtiketler ?? [],
        },
        canli: true,
        urunCanli: true,
        musteriCanli: true,
      }
    } catch (e) {
      if (!yokMu(e)) throw e
    }

    // Uç yok — mevcut servislerden hesapla
    const [urunSonuc, musteriSonuc] = await Promise.all([
      urunService.listele({ sayfa: 1, boyut: 1 }).catch(() => null),
      musteriService.listele({ sayfa: 1, boyut: 100 }).catch(() => null),
    ])

    const musteriler = musteriSonuc?.musteriler ?? []
    const etiketSayaci = {}
    musteriler.forEach((m) => {
      m.vektorEtiketleri.forEach((v) => {
        etiketSayaci[v.etiket] = (etiketSayaci[v.etiket] || 0) + 1
      })
    })

    return {
      veri: {
        urunToplam: urunSonuc?.toplam ?? 0,
        urunAktif: null,   // uç olmadan bilinmiyor
        urunPasif: null,
        musteriToplam: musteriSonuc?.toplam ?? 0,
        toplamBegeni: musteriler.reduce((a, m) => a + m.begeni, 0),
        toplamBegenmeme: musteriler.reduce((a, m) => a + m.begenmeme, 0),
        populerEtiketler: Object.entries(etiketSayaci)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([etiket, adet]) => ({ etiket, adet })),
      },
      canli: false,
      urunCanli: !!urunSonuc,
      musteriCanli: musteriSonuc?.canli ?? false,
    }
  },

  async sonUrunler(adet = 4) {
    try {
      const sonuc = await urunService.listele({ sayfa: 1, boyut: adet })
      return sonuc.urunler
    } catch {
      return []
    }
  },

  async sonMusteriler(adet = 4) {
    try {
      const sonuc = await musteriService.listele({ sayfa: 1, boyut: adet })
      return sonuc.musteriler
    } catch {
      return []
    }
  },
}