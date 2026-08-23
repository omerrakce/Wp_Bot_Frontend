export const mockTenantUser = {
  id: 1,
  name: 'Ayşe Kaya',
  email: 'ayse@modashop.com',
  role: 'Firma Yöneticisi',
  avatar: 'AK',
  company: 'ModaShop A.Ş.',
  plan: 'Pro',
  tenantId: 'tenant-001',
}

export const mockStats = [
  { id: 1, title: 'AI Eşleştirme', value: '3.842', change: '+18%', trend: 'up', desc: 'Bu ay yapılan toplam eşleştirme' },
  { id: 2, title: 'Sıcak Talep', value: '412', change: '+24%', trend: 'up', desc: 'Temsilciye aktarılan müşteri' },
  { id: 3, title: 'Eşleştirme Başarısı', value: '%94', change: '+2%', trend: 'up', desc: 'Müşteri memnuniyeti oranı' },
  { id: 4, title: 'Katalog Ürünleri', value: '342', change: '+12%', trend: 'up', desc: 'Aktif ürün sayısı' },
]

export const mockPopulerUrunler = [
  { id: 1, name: 'Siyah Deri Ceket', eslesme: 284, lead: 67, oran: 94, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
  { id: 2, name: 'Deri Çanta', eslesme: 201, lead: 54, oran: 89, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
  { id: 3, name: 'Kaşmir Kazak', eslesme: 178, lead: 41, oran: 91, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop' },
  { id: 4, name: 'Beyaz Sneaker', eslesme: 156, lead: 38, oran: 86, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
  { id: 5, name: 'Güneş Gözlüğü', eslesme: 134, lead: 29, oran: 88, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
]

export const mockSorguGrafik = [
  { gun: 'Pzt', eslesme: 320, lead: 42 },
  { gun: 'Sal', eslesme: 480, lead: 61 },
  { gun: 'Çar', eslesme: 410, lead: 53 },
  { gun: 'Per', eslesme: 560, lead: 74 },
  { gun: 'Cum', eslesme: 720, lead: 98 },
  { gun: 'Cmt', eslesme: 390, lead: 48 },
  { gun: 'Paz', eslesme: 280, lead: 36 },
]

export const mockSorguGecmisi = [
  { id: 1, musteri: 'Müşteri #1042', tip: 'Görsel Arama', eslesme: 'Siyah Deri Ceket', sonuc: 'Sıcak Talep', zaman: '3 dk önce' },
  { id: 2, musteri: 'Müşteri #1041', tip: 'Günlük Kapsül', eslesme: 'Kaşmir Kazak', sonuc: 'Sıcak Talep', zaman: '8 dk önce' },
  { id: 3, musteri: 'Müşteri #1040', tip: 'Görsel Arama', eslesme: 'Deri Çanta', sonuc: 'Gezindi', zaman: '15 dk önce' },
  { id: 4, musteri: 'Müşteri #1039', tip: 'Görsel Arama', eslesme: 'Beyaz Sneaker', sonuc: 'Sıcak Talep', zaman: '22 dk önce' },
  { id: 5, musteri: 'Müşteri #1038', tip: 'Günlük Kapsül', eslesme: 'Güneş Gözlüğü', sonuc: 'Gezindi', zaman: '31 dk önce' },
  { id: 6, musteri: 'Müşteri #1037', tip: 'Görsel Arama', eslesme: 'Siyah Deri Ceket', sonuc: 'Sıcak Talep', zaman: '45 dk önce' },
  { id: 7, musteri: 'Müşteri #1036', tip: 'Günlük Kapsül', eslesme: 'Kaşmir Kazak', sonuc: 'Gezindi', zaman: '1 saat önce' },
  { id: 8, musteri: 'Müşteri #1035', tip: 'Görsel Arama', eslesme: 'Deri Çanta', sonuc: 'Sıcak Talep', zaman: '1 saat önce' },
]

export const mockRecentActivity = [
  { id: 1, action: 'Sıcak talep oluştu', detail: 'Müşteri #1042 — Siyah Deri Ceket', time: '3 dk önce' },
  { id: 2, action: 'Görsel arama yapıldı', detail: 'Müşteri #1041 benzer ürün aradı', time: '8 dk önce' },
  { id: 3, action: 'Günlük kapsül gönderildi', detail: '1.204 müşteriye öneri iletildi', time: '1 saat önce' },
  { id: 4, action: 'Katalog güncellendi', detail: '3 yeni ürün eklendi', time: '3 saat önce' },
]

export const mockTrendAramalar = [
  { id: 1, arama: 'Siyah deri ceket', sayi: 284, degisim: '+32%', trend: 'up' },
  { id: 2, arama: 'Bej trençkot', sayi: 201, degisim: '+18%', trend: 'up' },
  { id: 3, arama: 'Beyaz sneaker', sayi: 178, degisim: '+12%', trend: 'up' },
  { id: 4, arama: 'Oversize hoodie', sayi: 156, degisim: '+45%', trend: 'up' },
  { id: 5, arama: 'Deri çanta', sayi: 134, degisim: '+8%', trend: 'up' },
  { id: 6, arama: 'Keten pantolon', sayi: 98, degisim: '-5%', trend: 'down' },
  { id: 7, arama: 'Blazer ceket', sayi: 87, degisim: '+22%', trend: 'up' },
  { id: 8, arama: 'Mini etek', sayi: 76, degisim: '+61%', trend: 'up' },
]

export const mockTrendRenkler = [
  { renk: 'Siyah', hex: '#1a1a1a', sayi: 412, yuzde: 34 },
  { renk: 'Bej / Krem', hex: '#c8a882', sayi: 287, yuzde: 24 },
  { renk: 'Beyaz', hex: '#f5f5f5', sayi: 198, yuzde: 16 },
  { renk: 'Haki', hex: '#8b7355', sayi: 143, yuzde: 12 },
  { renk: 'Lacivert', hex: '#1a237e', sayi: 98, yuzde: 8 },
  { renk: 'Diğer', hex: '#e0e0e0', sayi: 72, yuzde: 6 },
]

export const mockStokAcigi = [
  { id: 1, arama: 'Bej trençkot', aramaAdedi: 201, durum: 'Kritik', kategori: 'Dış Giyim' },
  { id: 2, arama: 'Oversize hoodie', aramaAdedi: 156, durum: 'Kritik', kategori: 'Günlük' },
  { id: 3, arama: 'Mini etek', aramaAdedi: 76, durum: 'Yüksek', kategori: 'Alt Giyim' },
  { id: 4, arama: 'Blazer ceket', aramaAdedi: 87, durum: 'Yüksek', kategori: 'Formal' },
  { id: 5, arama: 'Keten gömlek', aramaAdedi: 54, durum: 'Orta', kategori: 'Üst Giyim' },
  { id: 6, arama: 'Platform bot', aramaAdedi: 43, durum: 'Orta', kategori: 'Ayakkabı' },
]

export const mockYukselenKategoriler = [
  { kategori: 'Dış Giyim', artis: '+45%', renk: '#ECFDF5', textRenk: '#065F46' },
  { kategori: 'Spor & Casual', artis: '+38%', renk: '#EFF6FF', textRenk: '#1D4ED8' },
  { kategori: 'Aksesuar', artis: '+29%', renk: '#FEF3C7', textRenk: '#92400E' },
  { kategori: 'Formal', artis: '+21%', renk: '#F5F3FF', textRenk: '#5B21B6' },
  { kategori: 'Alt Giyim', artis: '+18%', renk: '#FFF1F2', textRenk: '#BE123C' },
]

export const mockMusteriler = [
  {
    id: 1,
    kod: 'MŞT-1042',
    telefon: '5321112233',
    ilkTemas: '15 Ocak 2024',
    sonAktivite: '3 dk önce',
    toplamSorgu: 48,
    sicakTalepSayisi: 12,
    begeni: 34,
    begenmeme: 9,
    profilGucu: 92,
    zevkProfili: {
      renkler: ['Siyah', 'Lacivert', 'Haki'],
      kategoriler: ['Dış Giyim', 'Formal', 'Aksesuar'],
      fiyatAraligi: '1.500 ₺ — 5.000 ₺',
      tarz: 'Minimalist & Klasik',
    },
    vektorEtiketleri: [
      { etiket: 'Deri doku', skor: 94 },
      { etiket: 'Koyu ton', skor: 89 },
      { etiket: 'Oversize kesim', skor: 71 },
      { etiket: 'Metal detay', skor: 63 },
    ],
    begenilenUrunler: [1, 4],
    begenilmeyenUrunler: [3],
    sonAramalar: [
      { urun: 'Siyah deri ceket', tarih: '3 dk önce', sonuc: 'Sıcak Talep' },
      { urun: 'Lacivert blazer', tarih: '2 gün önce', sonuc: 'Gezindi' },
      { urun: 'Deri çanta', tarih: '5 gün önce', sonuc: 'Sıcak Talep' },
    ],
    onerilenUrunler: [1, 4, 6],
  },
  {
    id: 2,
    kod: 'MŞT-1041',
    telefon: '5334445566',
    ilkTemas: '3 Şubat 2024',
    sonAktivite: '8 dk önce',
    toplamSorgu: 31,
    sicakTalepSayisi: 8,
    begeni: 22,
    begenmeme: 4,
    profilGucu: 78,
    zevkProfili: {
      renkler: ['Bej', 'Krem', 'Beyaz'],
      kategoriler: ['Günlük', 'Spor & Casual'],
      fiyatAraligi: '500 ₺ — 2.000 ₺',
      tarz: 'Casual & Rahat',
    },
    vektorEtiketleri: [
      { etiket: 'Yumuşak doku', skor: 91 },
      { etiket: 'Nötr ton', skor: 85 },
      { etiket: 'Rahat kesim', skor: 80 },
      { etiket: 'Örgü yüzey', skor: 58 },
    ],
    begenilenUrunler: [2, 6],
    begenilmeyenUrunler: [1],
    sonAramalar: [
      { urun: 'Kaşmir kazak', tarih: '8 dk önce', sonuc: 'Sıcak Talep' },
      { urun: 'Beyaz sneaker', tarih: '3 gün önce', sonuc: 'Sıcak Talep' },
      { urun: 'Oversize hoodie', tarih: '1 hafta önce', sonuc: 'Gezindi' },
    ],
    onerilenUrunler: [2, 6],
  },
  {
    id: 3,
    kod: 'MŞT-1040',
    telefon: '5347778899',
    ilkTemas: '20 Mart 2024',
    sonAktivite: '15 dk önce',
    toplamSorgu: 19,
    sicakTalepSayisi: 3,
    begeni: 11,
    begenmeme: 8,
    profilGucu: 46,
    zevkProfili: {
      renkler: ['Kırmızı', 'Sarı', 'Mor'],
      kategoriler: ['Aksesuar', 'Alt Giyim'],
      fiyatAraligi: '200 ₺ — 1.000 ₺',
      tarz: 'Renkli & Trend',
    },
    vektorEtiketleri: [
      { etiket: 'Canlı renk', skor: 88 },
      { etiket: 'Desenli yüzey', skor: 74 },
      { etiket: 'Kısa kesim', skor: 61 },
      { etiket: 'Parlak doku', skor: 52 },
    ],
    begenilenUrunler: [5],
    begenilmeyenUrunler: [1, 3],
    sonAramalar: [
      { urun: 'Deri çanta', tarih: '15 dk önce', sonuc: 'Gezindi' },
      { urun: 'Güneş gözlüğü', tarih: '4 gün önce', sonuc: 'Sıcak Talep' },
      { urun: 'Mini etek', tarih: '2 hafta önce', sonuc: 'Gezindi' },
    ],
    onerilenUrunler: [5],
  },
  {
    id: 4,
    kod: 'MŞT-1039',
    telefon: '5355556677',
    ilkTemas: '8 Nisan 2024',
    sonAktivite: '22 dk önce',
    toplamSorgu: 27,
    sicakTalepSayisi: 9,
    begeni: 19,
    begenmeme: 3,
    profilGucu: 84,
    zevkProfili: {
      renkler: ['Beyaz', 'Açık Mavi', 'Gri'],
      kategoriler: ['Spor & Casual', 'Ayakkabı'],
      fiyatAraligi: '800 ₺ — 2.500 ₺',
      tarz: 'Sportif & Modern',
    },
    vektorEtiketleri: [
      { etiket: 'Spor siluet', skor: 93 },
      { etiket: 'Açık ton', skor: 82 },
      { etiket: 'Teknik kumaş', skor: 76 },
      { etiket: 'Minimal logo', skor: 64 },
    ],
    begenilenUrunler: [2, 3],
    begenilmeyenUrunler: [4],
    sonAramalar: [
      { urun: 'Beyaz sneaker', tarih: '22 dk önce', sonuc: 'Sıcak Talep' },
      { urun: 'Spor çanta', tarih: '5 gün önce', sonuc: 'Sıcak Talep' },
      { urun: 'Kot pantolon', tarih: '1 hafta önce', sonuc: 'Sıcak Talep' },
    ],
    onerilenUrunler: [2, 3],
  },
  {
    id: 5,
    kod: 'MŞT-1038',
    telefon: '5368889900',
    ilkTemas: '12 Mayıs 2024',
    sonAktivite: '31 dk önce',
    toplamSorgu: 14,
    sicakTalepSayisi: 2,
    begeni: 6,
    begenmeme: 5,
    profilGucu: 31,
    zevkProfili: {
      renkler: ['Kahverengi', 'Haki', 'Bej'],
      kategoriler: ['Dış Giyim', 'Günlük'],
      fiyatAraligi: '300 ₺ — 1.500 ₺',
      tarz: 'Doğal & Vintage',
    },
    vektorEtiketleri: [
      { etiket: 'Toprak ton', skor: 79 },
      { etiket: 'Doğal kumaş', skor: 68 },
      { etiket: 'Vintage yıkama', skor: 55 },
      { etiket: 'Sade kesim', skor: 48 },
    ],
    begenilenUrunler: [5],
    begenilmeyenUrunler: [2],
    sonAramalar: [
      { urun: 'Güneş gözlüğü', tarih: '31 dk önce', sonuc: 'Gezindi' },
      { urun: 'Bej trençkot', tarih: '1 hafta önce', sonuc: 'Gezindi' },
      { urun: 'Keten pantolon', tarih: '2 hafta önce', sonuc: 'Sıcak Talep' },
    ],
    onerilenUrunler: [5],
  },
]

export const mockFirmaBilgileri = {
  firmaAdi: 'ModaShop A.Ş.',
  botTelefon: '+90 212 555 01 01',
  sepetLinki: 'https://modashop.com/sepet',
  katalogLinki: 'https://modashop.com/katalog',
  tezgahtarAktif: true,
}

export const mockTezgahtarlar = [
  { id: 1, ad: 'Mehmet Demir', telefon: '+90 532 111 22 33', gorsel: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { id: 2, ad: 'Zeynep Aydın', telefon: '+90 533 444 55 66', gorsel: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { id: 3, ad: 'Can Öztürk', telefon: '+90 534 777 88 99', gorsel: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
]

export const KATEGORILER = [
  'Elbise', 'Bluz & Gömlek', 'Triko & Kazak', 'Etek', 'Pantolon',
  'Ceket & Blazer', 'Dış Giyim', 'Takım', 'Tulum', 'Tunik',
  'Şort', 'Sweatshirt', 'Abiye', 'Plaj Giyim',
]

export const SEZONLAR = [
  '2025 İlkbahar',
  '2025 Yaz',
  '2025 Sonbahar',
  '2025 Kış',
  '2025-2026 Sonbahar-Kış',
  '2026 İlkbahar',
  '2026 Yaz',
  '2026 Sonbahar',
  '2026 Kış',
  '2026 İlkbahar-Yaz',
  '2026-2027 Sonbahar-Kış',
  'Bayramlık / Özel Koleksiyon',
  'Basic / Süreklilik',
  'Sezonsuz',
]

// Renk alanı serbest metin — bunlar sadece hızlı seçim önerisi
export const RENK_ONERILERI = [
  'Siyah', 'Beyaz', 'Ekru', 'Bej', 'Krem', 'Gri', 'Antrasit',
  'Lacivert', 'Mavi', 'Bebe Mavi', 'Kırmızı', 'Bordo', 'Vişne',
  'Pembe', 'Pudra', 'Fuşya', 'Mor', 'Lila', 'Yeşil', 'Haki',
  'Zümrüt', 'Sarı', 'Hardal', 'Turuncu', 'Kiremit', 'Kahverengi',
  'Camel', 'Vizon', 'Gold', 'Gümüş', 'Leopar Desen', 'Çiçek Desen',
]



export const mockProducts = [
  { id: 1, name: 'Saten Midi Elbise', price: '1.899 ₺', category: 'Elbise', status: 'Aktif', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop', renk: 'Bordo', uretici: 'Vera Moda', bedenler: ['XS', 'S', 'M', 'L'], urunKodu: 'ELB-1001', sezon: '2025-2026 Sonbahar-Kış' },
  { id: 2, name: 'Kaşmir Karışımlı Kazak', price: '1.450 ₺', category: 'Triko & Kazak', status: 'Aktif', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', renk: 'Krem', uretici: 'KaşmirHouse', bedenler: ['S', 'M', 'L'], urunKodu: 'TRK-1002', sezon: '2025 Kış' },
  { id: 3, name: 'Yüksek Bel Palazzo Pantolon', price: '999 ₺', category: 'Pantolon', status: 'Aktif', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', renk: 'Siyah', uretici: 'DenimCo', bedenler: ['36', '38', '40', '42'], urunKodu: 'PNT-1003', sezon: 'Basic / Süreklilik' },
  { id: 4, name: 'Oversize Blazer Ceket', price: '2.290 ₺', category: 'Ceket & Blazer', status: 'Aktif', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop', renk: 'Camel', uretici: 'Atelier Moda', bedenler: ['S', 'M', 'L', 'XL'], urunKodu: 'CKT-1004', sezon: '2025 Sonbahar' },
  { id: 5, name: 'İpek Gömlek', price: '1.190 ₺', category: 'Bluz & Gömlek', status: 'Aktif', image: 'https://images.unsplash.com/photo-1564257577-2d3c9c1a5d4a?w=400&h=400&fit=crop', renk: 'Ekru', uretici: 'Silk & Co', bedenler: ['XS', 'S', 'M', 'L'], urunKodu: 'BLZ-1005', sezon: '2026 İlkbahar' },
  { id: 6, name: 'Pileli Midi Etek', price: '849 ₺', category: 'Etek', status: 'Aktif', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=400&h=400&fit=crop', renk: 'Haki', uretici: 'Vera Moda', bedenler: ['36', '38', '40'], urunKodu: 'ETK-1006', sezon: '2025 Sonbahar' },
  { id: 7, name: 'Uzun Trençkot', price: '3.490 ₺', category: 'Dış Giyim', status: 'Aktif', image: 'https://images.unsplash.com/photo-1591047139756-eec9f0d8e8f5?w=400&h=400&fit=crop', renk: 'Bej', uretici: 'Atelier Moda', bedenler: ['S', 'M', 'L'], urunKodu: 'DSG-1007', sezon: '2026 İlkbahar' },
  { id: 8, name: 'Tül Detaylı Abiye', price: '4.750 ₺', category: 'Abiye', status: 'Aktif', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=400&fit=crop', renk: 'Zümrüt', uretici: 'Elegance', bedenler: ['XS', 'S', 'M'], urunKodu: 'ABY-1008', sezon: 'Bayramlık / Özel Koleksiyon' },
  { id: 9, name: 'Basic Bisiklet Yaka Tişört', price: '349 ₺', category: 'Bluz & Gömlek', status: 'Aktif', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', renk: 'Beyaz', uretici: 'BasicLine', bedenler: ['XS', 'S', 'M', 'L', 'XL'], urunKodu: 'BLZ-1009', sezon: 'Basic / Süreklilik' },
  { id: 10, name: 'Keten Karışımlı Tulum', price: '1.590 ₺', category: 'Tulum', status: 'Aktif', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop', renk: 'Vizon', uretici: 'Linen Studio', bedenler: ['S', 'M', 'L'], urunKodu: 'TLM-1010', sezon: '2026 Yaz' },
  { id: 11, name: 'Kruvaze Yaka Bluz', price: '790 ₺', category: 'Bluz & Gömlek', status: 'Pasif', image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&h=400&fit=crop', renk: 'Pudra', uretici: 'Silk & Co', bedenler: ['S', 'M', 'L'], urunKodu: 'BLZ-1011', sezon: '2025 İlkbahar' },
  { id: 12, name: 'Kalem Etek', price: '699 ₺', category: 'Etek', status: 'Aktif', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop', renk: 'Antrasit', uretici: 'Office Wear', bedenler: ['36', '38', '40', '42'], urunKodu: 'ETK-1012', sezon: 'Basic / Süreklilik' },
  { id: 13, name: 'Boğazlı Triko Elbise', price: '1.290 ₺', category: 'Elbise', status: 'Aktif', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop', renk: 'Vişne', uretici: 'KaşmirHouse', bedenler: ['S', 'M', 'L'], urunKodu: 'ELB-1013', sezon: '2025 Kış' },
  { id: 14, name: 'Şifon Uzun Elbise', price: '1.690 ₺', category: 'Elbise', status: 'Aktif', image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&h=400&fit=crop', renk: 'Çiçek Desen', uretici: 'Vera Moda', bedenler: ['XS', 'S', 'M', 'L'], urunKodu: 'ELB-1014', sezon: '2026 Yaz' },
  { id: 15, name: 'Oversize Sweatshirt', price: '599 ₺', category: 'Sweatshirt', status: 'Aktif', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', renk: 'Gri', uretici: 'BasicLine', bedenler: ['S', 'M', 'L', 'XL'], urunKodu: 'SWT-1015', sezon: '2025-2026 Sonbahar-Kış' },
  { id: 16, name: 'Kot Ceket', price: '1.190 ₺', category: 'Ceket & Blazer', status: 'Aktif', image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=400&h=400&fit=crop', renk: 'Mavi', uretici: 'DenimCo', bedenler: ['S', 'M', 'L'], urunKodu: 'CKT-1016', sezon: '2026 İlkbahar' },
  { id: 17, name: 'Blazer Takım', price: '3.290 ₺', category: 'Takım', status: 'Aktif', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop', renk: 'Lacivert', uretici: 'Office Wear', bedenler: ['36', '38', '40', '42'], urunKodu: 'TKM-1017', sezon: '2025 Sonbahar' },
  { id: 18, name: 'Kaşe Kaban', price: '4.190 ₺', category: 'Dış Giyim', status: 'Aktif', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop', renk: 'Camel', uretici: 'Atelier Moda', bedenler: ['S', 'M', 'L', 'XL'], urunKodu: 'DSG-1018', sezon: '2026-2027 Sonbahar-Kış' },
  { id: 19, name: 'Salaş Tunik', price: '899 ₺', category: 'Tunik', status: 'Pasif', image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400&h=400&fit=crop', renk: 'Hardal', uretici: 'Linen Studio', bedenler: ['S', 'M', 'L', 'XL'], urunKodu: 'TNK-1019', sezon: '2025 Sonbahar' },
  { id: 20, name: 'Yüksek Bel Şort', price: '549 ₺', category: 'Şort', status: 'Aktif', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop', renk: 'Beyaz', uretici: 'DenimCo', bedenler: ['36', '38', '40'], urunKodu: 'SRT-1020', sezon: '2026 Yaz' },
  { id: 21, name: 'Kaftan Plaj Elbisesi', price: '1.090 ₺', category: 'Plaj Giyim', status: 'Aktif', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop', renk: 'Turkuaz', uretici: 'Beach Line', bedenler: ['Standart'], urunKodu: 'PLJ-1021', sezon: '2026 Yaz' },
  { id: 22, name: 'Fitilli Triko Hırka', price: '1.150 ₺', category: 'Triko & Kazak', status: 'Aktif', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop', renk: 'Lila', uretici: 'KaşmirHouse', bedenler: ['S', 'M', 'L'], urunKodu: 'TRK-1022', sezon: '2026 İlkbahar' },
]

export const BEDEN_GRUPLARI = {
  'Harf Beden': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'Numara (Ayakkabı)': ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  'Numara (Pantolon)': ['28', '30', '32', '34', '36', '38', '40'],
  'Tek Beden': ['Standart'],
}