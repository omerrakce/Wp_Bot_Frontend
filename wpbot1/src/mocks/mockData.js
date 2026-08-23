export const mockUser = {
  id: 1,
  name: 'Ömer Yılmaz',
  email: 'admin@humersoft.com',
  role: 'Super Admin',
  avatar: 'ÖY',
  company: 'HumerSoft Technology',
}

export const PLAN_FIYATLARI = { Starter: 990, Pro: 2490, Enterprise: 5990 }

export const mockTenants = [
  {
    id: 1, company: 'ModaShop A.Ş.', plan: 'Pro', status: 'Aktif',
    telefon: '2125550101', email: 'info@modashop.com', adres: 'Levent, İstanbul',
    yetkili: 'Ayşe Kaya', botNumara: '5321112233',
    urunToplam: 342, urunAktif: 318, urunPasif: 24,
    musteriToplam: 1204, sepeteYonlendirme: 486,
    degerlendirmeSayisi: 312, memnunSayisi: 287,
    gorselGonderilen: 15420, gorselEslesen: 12840,
    abonelik: { tutar: 2490, odemeDurumu: 'Ödendi', sonOdeme: '05 Ağustos 2026', sonrakiOdeme: '05 Eylül 2026', gecikmeGun: 0, odemeYontemi: 'Kredi Kartı •••• 4242' },
    davet: { durum: 'Aktif', tarih: '15 Ocak 2024' },
  },
  {
    id: 2, company: 'TrendStore Ltd.', plan: 'Starter', status: 'Aktif',
    telefon: '2165550202', email: 'hello@trendstore.com', adres: 'Kadıköy, İstanbul',
    yetkili: 'Deniz Arslan', botNumara: '5334445566',
    urunToplam: 98, urunAktif: 91, urunPasif: 7,
    musteriToplam: 348, sepeteYonlendirme: 112,
    degerlendirmeSayisi: 86, memnunSayisi: 71,
    gorselGonderilen: 4180, gorselEslesen: 3210,
    abonelik: { tutar: 990, odemeDurumu: 'Ödendi', sonOdeme: '12 Ağustos 2026', sonrakiOdeme: '12 Eylül 2026', gecikmeGun: 0, odemeYontemi: 'Havale / EFT' },
    davet: { durum: 'Aktif', tarih: '03 Şubat 2024' },
  },
  {
    id: 3, company: 'StyleHub', plan: 'Enterprise', status: 'Aktif',
    telefon: '3125550303', email: 'tech@stylehub.com', adres: 'Çankaya, Ankara',
    yetkili: 'Emre Yıldız', botNumara: '5347778899',
    urunToplam: 1240, urunAktif: 1186, urunPasif: 54,
    musteriToplam: 4870, sepeteYonlendirme: 2140,
    degerlendirmeSayisi: 1320, memnunSayisi: 1258,
    gorselGonderilen: 61200, gorselEslesen: 54200,
    abonelik: { tutar: 5990, odemeDurumu: 'Ödendi', sonOdeme: '01 Ağustos 2026', sonrakiOdeme: '01 Eylül 2026', gecikmeGun: 0, odemeYontemi: 'Kurumsal Fatura' },
    davet: { durum: 'Aktif', tarih: '20 Kasım 2023' },
  },
  {
    id: 4, company: 'FashionPoint', plan: 'Pro', status: 'Pasif',
    telefon: '2325550404', email: 'destek@fashionpoint.com', adres: 'Konak, İzmir',
    yetkili: 'Selin Kurt', botNumara: '5355556677',
    urunToplam: 210, urunAktif: 164, urunPasif: 46,
    musteriToplam: 792, sepeteYonlendirme: 238,
    degerlendirmeSayisi: 174, memnunSayisi: 121,
    gorselGonderilen: 11300, gorselEslesen: 8900,
    abonelik: { tutar: 2490, odemeDurumu: 'Gecikmiş', sonOdeme: '05 Temmuz 2026', sonrakiOdeme: '05 Ağustos 2026', gecikmeGun: 13, odemeYontemi: 'Kredi Kartı •••• 8891' },
    davet: { durum: 'Aktif', tarih: '08 Mart 2024' },
  },
  {
    id: 5, company: 'LuxBoutique', plan: 'Enterprise', status: 'Aktif',
    telefon: '2125550505', email: 'info@luxboutique.com', adres: 'Nişantaşı, İstanbul',
    yetkili: 'Burak Şen', botNumara: '5368889900',
    urunToplam: 890, urunAktif: 862, urunPasif: 28,
    musteriToplam: 2980, sepeteYonlendirme: 1345,
    degerlendirmeSayisi: 910, memnunSayisi: 861,
    gorselGonderilen: 37800, gorselEslesen: 32100,
    abonelik: { tutar: 5990, odemeDurumu: 'Beklemede', sonOdeme: '18 Temmuz 2026', sonrakiOdeme: '18 Ağustos 2026', gecikmeGun: 0, odemeYontemi: 'Kurumsal Fatura' },
    davet: { durum: 'Aktif', tarih: '12 Ekim 2023' },
  },
]

export const mockFaturaGecmisi = [
  { id: 'FTR-2026-0142', firmaId: 3, firma: 'StyleHub', tutar: 5990, tarih: '01 Ağustos 2026', durum: 'Ödendi' },
  { id: 'FTR-2026-0141', firmaId: 1, firma: 'ModaShop A.Ş.', tutar: 2490, tarih: '05 Ağustos 2026', durum: 'Ödendi' },
  { id: 'FTR-2026-0140', firmaId: 2, firma: 'TrendStore Ltd.', tutar: 990, tarih: '12 Ağustos 2026', durum: 'Ödendi' },
  { id: 'FTR-2026-0139', firmaId: 5, firma: 'LuxBoutique', tutar: 5990, tarih: '18 Temmuz 2026', durum: 'Beklemede' },
  { id: 'FTR-2026-0138', firmaId: 4, firma: 'FashionPoint', tutar: 2490, tarih: '05 Temmuz 2026', durum: 'Gecikmiş' },
  { id: 'FTR-2026-0137', firmaId: 3, firma: 'StyleHub', tutar: 5990, tarih: '01 Temmuz 2026', durum: 'Ödendi' },
  { id: 'FTR-2026-0136', firmaId: 1, firma: 'ModaShop A.Ş.', tutar: 2490, tarih: '05 Temmuz 2026', durum: 'Ödendi' },
  { id: 'FTR-2026-0135', firmaId: 2, firma: 'TrendStore Ltd.', tutar: 990, tarih: '12 Temmuz 2026', durum: 'Ödendi' },
]

export const mockRecentActivity = [
  { id: 1, action: 'Yeni firma daveti gönderildi', company: 'FashionPoint', time: '2 dk önce' },
  { id: 2, action: 'Ödeme alındı', company: 'TrendStore Ltd. — 990 ₺', time: '15 dk önce' },
  { id: 3, action: 'Plan yükseltildi', company: 'StyleHub — Enterprise', time: '1 saat önce' },
  { id: 4, action: 'Ödeme gecikmesi', company: 'FashionPoint — 13 gün', time: '3 saat önce' },
  { id: 5, action: 'Memnuniyet oranı düştü', company: 'FashionPoint — %70', time: 'Dün 18:00' },
]

export const mockFirmaDetay = {
  1: {
    joinDate: 'Ocak 2024',
    planHistory: [{ plan: 'Starter', date: 'Ocak 2024' }, { plan: 'Pro', date: 'Mart 2024' }],
    aylikVeri: [
      { ay: 'Oca', gorsel: 1820, sepet: 62 }, { ay: 'Şub', gorsel: 2140, sepet: 71 },
      { ay: 'Mar', gorsel: 1960, sepet: 68 }, { ay: 'Nis', gorsel: 2380, sepet: 84 },
      { ay: 'May', gorsel: 2210, sepet: 92 }, { ay: 'Haz', gorsel: 2330, sepet: 109 },
    ],
    recentActivity: [
      { action: 'Sepete yönlendirme', detail: 'MŞT-1042 — Saten Midi Elbise', time: '2 dk önce' },
      { action: 'Katalog güncellendi', detail: '3 yeni ürün eklendi', time: '1 saat önce' },
      { action: 'Olumlu değerlendirme', detail: 'Sohbet sonu memnuniyet oyu', time: '3 saat önce' },
      { action: 'Bot aktif edildi', detail: 'WhatsApp hattı bağlandı', time: 'Dün 14:22' },
    ],
  },
  2: {
    joinDate: 'Şubat 2024',
    planHistory: [{ plan: 'Starter', date: 'Şubat 2024' }],
    aylikVeri: [
      { ay: 'Oca', gorsel: 0, sepet: 0 }, { ay: 'Şub', gorsel: 420, sepet: 11 },
      { ay: 'Mar', gorsel: 610, sepet: 16 }, { ay: 'Nis', gorsel: 780, sepet: 22 },
      { ay: 'May', gorsel: 690, sepet: 28 }, { ay: 'Haz', gorsel: 710, sepet: 35 },
    ],
    recentActivity: [
      { action: 'Katalog güncellendi', detail: '5 ürün eklendi', time: '15 dk önce' },
      { action: 'Giriş yapıldı', detail: 'Firma yöneticisi', time: '2 saat önce' },
    ],
  },
  3: {
    joinDate: 'Kasım 2023',
    planHistory: [
      { plan: 'Starter', date: 'Kasım 2023' },
      { plan: 'Pro', date: 'Ocak 2024' },
      { plan: 'Enterprise', date: 'Nisan 2024' },
    ],
    aylikVeri: [
      { ay: 'Oca', gorsel: 6800, sepet: 280 }, { ay: 'Şub', gorsel: 7900, sepet: 320 },
      { ay: 'Mar', gorsel: 8400, sepet: 341 }, { ay: 'Nis', gorsel: 9600, sepet: 378 },
      { ay: 'May', gorsel: 10200, sepet: 396 }, { ay: 'Haz', gorsel: 11300, sepet: 425 },
    ],
    recentActivity: [
      { action: 'Toplu ürün yüklendi', detail: '240 ürün kataloğa eklendi', time: '30 dk önce' },
      { action: 'Sepete yönlendirme rekoru', detail: 'Günlük 84 yönlendirme', time: '2 saat önce' },
      { action: 'Plan yenilendi', detail: 'Enterprise', time: 'Dün 09:15' },
    ],
  },
  4: {
    joinDate: 'Mart 2024',
    planHistory: [{ plan: 'Starter', date: 'Mart 2024' }, { plan: 'Pro', date: 'Mayıs 2024' }],
    aylikVeri: [
      { ay: 'Oca', gorsel: 0, sepet: 0 }, { ay: 'Şub', gorsel: 0, sepet: 0 },
      { ay: 'Mar', gorsel: 1900, sepet: 48 }, { ay: 'Nis', gorsel: 2400, sepet: 61 },
      { ay: 'May', gorsel: 2100, sepet: 54 }, { ay: 'Haz', gorsel: 1400, sepet: 32 },
    ],
    recentActivity: [
      { action: 'Hesap pasife alındı', detail: 'Ödeme başarısız', time: '3 gün önce' },
      { action: 'Olumsuz değerlendirme artışı', detail: 'Memnuniyet %70 altına düştü', time: '5 gün önce' },
    ],
  },
  5: {
    joinDate: 'Ekim 2023',
    planHistory: [{ plan: 'Pro', date: 'Ekim 2023' }, { plan: 'Enterprise', date: 'Ocak 2024' }],
    aylikVeri: [
      { ay: 'Oca', gorsel: 4200, sepet: 178 }, { ay: 'Şub', gorsel: 4900, sepet: 201 },
      { ay: 'Mar', gorsel: 5400, sepet: 224 }, { ay: 'Nis', gorsel: 6100, sepet: 238 },
      { ay: 'May', gorsel: 6400, sepet: 246 }, { ay: 'Haz', gorsel: 6900, sepet: 258 },
    ],
    recentActivity: [
      { action: 'Yeni koleksiyon yüklendi', detail: '180 ürün eklendi', time: '1 saat önce' },
      { action: 'Sepete yönlendirme rekoru', detail: 'Aylık 1.345 yönlendirme', time: 'Dün 18:00' },
    ],
  },
}