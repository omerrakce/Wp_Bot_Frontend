# GÖREV: B2B SaaS Yönetici Paneli (Mock-First, Responsive Frontend Mimari)

## ROLÜN
Sen kıdemli bir Frontend Mimarı ve UI/UX Uzmanısın. Arka planda çalışacak yapay zeka destekli bir WhatsApp Stil Asistanı için B2B "Çoklu Kiracı" (Multi-Tenant) web yönetim panelini sıfırdan inşa edeceksin.

**ÖNEMLİ KURAL:** Şu anda ortada bir Backend veya API YOKTUR. Projeyi tamamen "UI-First" yaklaşımıyla, statik sahte (mock) veriler kullanarak geliştireceksin. Bütün veri çekme, giriş yapma veya fotoğraf yükleme işlemleri `setTimeout` kullanılarak 1-2 saniyelik sahte yükleme (loading) animasyonlarıyla simüle edilmelidir.

---

## 1. TEKNOLOJİ YIĞINI (TECH STACK)

| Araç | Versiyon | Not |
|---|---|---|
| Node.js | 20+ | LTS önerilir |
| Vite | latest | Build aracı |
| React | 19 | UI framework |
| JavaScript | ES6+ | TypeScript KULLANMA |
| Tailwind CSS | v4 (`@tailwindcss/vite`) | Stil |
| react-router-dom | v6+ | Yönlendirme |
| zustand | latest | State management |
| lucide-react | latest | İkonlar |
| react-hot-toast | latest | Toast bildirimleri |

**Kurulum Komutları:**
```bash
npm create vite@latest whatsapp-style-admin -- --template react
cd whatsapp-style-admin
npm install
npm install tailwindcss @tailwindcss/vite
npm install react-router-dom zustand lucide-react react-hot-toast
```

**vite.config.js:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**src/index.css (tüm içeriği sil, sadece bunu yaz):**
```css
@import "tailwindcss";
```

---

## 2. DETAYLI KLASÖR MİMARİSİ

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Spinner.jsx
│   │   └── EmptyState.jsx
│   └── layout/
│       ├── Sidebar.jsx
│       └── Navbar.jsx
├── layouts/
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
├── mocks/
│   └── mockData.js
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── CatalogUpload.jsx
├── routes/
│   ├── AppRoutes.jsx
│   └── PrivateRoute.jsx
└── store/
    ├── authStore.js
    └── tenantStore.js
```

**Klasör oluşturma komutu:**
```bash
mkdir -p src/components/common src/components/layout src/layouts src/mocks src/pages src/routes src/store
```

---

## 3. UI/UX, RESPONSIVE VE SAYFA TASARIMI GEREKSİNİMLERİ

### Tasarım Dili
- **Renk paleti:** Siyah, beyaz ve grinin tonları (monochrome) — minimalist kurumsal SaaS estetiği
- **Font:** Sistematik, okunabilir — Inter veya benzeri kurumsal font
- **Aksent renk:** Tek bir vurgu rengi (koyu gri veya çok az siyah ton farkı)

### Genel Responsive Kuralları
- **Mobile-First:** Tüm bileşenler önce `sm` (mobil) için yazılır, sonra `md` (tablet), `lg/xl` (masaüstü) ile genişletilir
- **Hamburger Menü:** Mobilde sidebar gizlenir, Navbar'daki hamburger butonu ile drawer/off-canvas açılır
- **Grid Yapısı:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### UX Detayları
- **Empty State:** Katalog boşken ikon + yönlendirici mesajlı `EmptyState` bileşeni
- **Toast Bildirimleri:** Başarılı/hatalı işlemlerde köşede çıkan `react-hot-toast` bildirimleri
- **Loading Simulasyonu:** Her async işlem için `setTimeout` + `Spinner` kombinasyonu

---

## 4. SAYFA TASARIM DETAYLARI

### Login (AuthLayout)
- Ekran ortasında gölgeli, temiz form
- Giriş butonuna basılınca 1.5 saniyelik Spinner
- Başarılı girişte: Toast bildirimi → Zustand store'a mock kullanıcı → `/dashboard` yönlendirme
- Mock kimlik bilgileri: `admin@test.com` / `123456`

### Dashboard / Analitik
- Üstte istatistik kartları (grid responsive)
- Altta şık, responsive sahte veri tablosu (`overflow-x-auto` ile mobilde yatay kaydırılabilir)
- Kart içerikleri: Toplam Ürün, Aktif Kiracı, Bu Ay Sorgu, Başarı Oranı gibi metrikler

### Katalog Yükleme ve Listeleme (Kritik Ekran)
- Üstte belirgin **"Yeni Ürün Ekle"** butonu
- Butona tıklanınca **responsive Modal** açılır (mobilde tam ekran, masaüstünde ortalanmış kutu)
- **Modal içeriği:**
  - Ürün Adı input
  - Fiyat input
  - **Drag & Drop alanı** — sürükle-bırak VEYA tıkla-seç ile fotoğraf yükle, tarayıcıda anında **önizleme (preview)** göster (gerçek JS fonksiyonlarıyla, mock değil)
- Yükleme butonu 1.5 saniyelik loading simülasyonu yapar, ardından Toast + ürün listeye eklenir

### Katalog Galeri Görünümü (Kritik Kurallar)
- Ürün kartları grid yapısında listelenir
- ❌ **Hover efekti KULLANMA** (üzerine gelme animasyonu yok)
- ✅ Görseller container'ı **tamamen kaplar** (`object-cover w-full h-full`)
- Kart altında: Ürün adı, fiyat, durum badge'i

---

## 5. STORE YAPISI

### authStore.js (Zustand)
```js
// Tutacağı veriler:
{
  user: null,          // { name, email, role }
  token: null,         // mock JWT string
  isAuthenticated: false,
  login: (credentials) => { ... },
  logout: () => { ... }
}
```

### tenantStore.js (Zustand)
```js
// Tutacağı veriler:
{
  companyId: null,     // mock company ID
  companyName: null,
  plan: null           // 'starter' | 'pro' | 'enterprise'
}
```

---

## 6. MOCK VERİ YAPISI (mockData.js)

```js
export const mockUser = { ... }
export const mockStats = [ ... ]       // Dashboard istatistik kartları
export const mockProducts = [ ... ]    // Katalog ürün listesi (5-8 ürün)
export const mockTenants = [ ... ]     // Kiracı listesi (tablo için)
export const mockRecentActivity = [ ... ]
```

---

## 7. YAZIM SIRASI (Dosyaları Bu Sırayla Yaz)

1. `mocks/mockData.js`
2. `store/authStore.js` + `store/tenantStore.js`
3. `components/common/` → Button, Input, Card, Modal, Spinner, EmptyState
4. `components/layout/` → Sidebar, Navbar
5. `layouts/` → AuthLayout, DashboardLayout
6. `pages/` → Login, Dashboard, CatalogUpload
7. `routes/` → AppRoutes, PrivateRoute
8. `main.jsx` güncellemesi

---

## 8. DRAG & DROP KARARI
Katalog yükleme sayfasındaki Drag & Drop alanı **gerçek JS fonksiyonlarıyla** yapılacak:
- Kullanıcı bilgisayarından fotoğraf seçtiğinde tarayıcıda **anında önizleme** görünür
- `FileReader` API veya `URL.createObjectURL()` kullanılır
- Desteklenen formatlar: JPG, PNG, WEBP (max 5MB kontrolü)
- Bu sayede ileride gerçek backend'e geçişte bu fonksiyonlar doğrudan kullanılabilir
