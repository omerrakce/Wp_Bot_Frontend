import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Katalog from '../pages/Katalog'
import Musteriler from '../pages/Musteriler'
import MusteriDetay from '../pages/MusteriDetay'
import FirmaBilgileri from '../pages/FirmaBilgileri'
import Ayarlar from '../pages/Ayarlar'
import BotAyarlari from '../pages/BotAyarlari'
import Trendler from '../pages/Trendler'
import SifreBelirle from '../pages/SifreBelirle'
import SifreSifirla from '../pages/SifreSifirla'
import SifremiUnuttum from '../pages/SifremiUnuttum'
import Kampanyalar from '../pages/Kampanyalar'

// Şimdilik devre dışı — ileride geri açılacak
// import Sorgular from '../pages/Sorgular'
// import BotAyarlari from '../pages/BotAyarlari'
// import PlanYukselt from '../pages/PlanYukselt'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/sifre-belirle" element={<SifreBelirle />} />
        <Route path="/sifre-sifirla" element={<SifreSifirla />} />
        <Route path="/sifremi-unuttum" element={<SifremiUnuttum />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="katalog" element={<Katalog />} />
          <Route path="musteriler" element={<Musteriler />} />
          <Route path="musteriler/:id" element={<MusteriDetay />} />
          <Route path="firma" element={<FirmaBilgileri />} />
          <Route path="ayarlar" element={<Ayarlar />} />
          <Route path="bot" element={<BotAyarlari />} />
          <Route path="trendler" element={<Trendler />} />
          <Route path="kampanyalar" element={<Kampanyalar />} />

          {/* Şimdilik devre dışı
          <Route path="sorgular" element={<Sorgular />} />
          <Route path="trendler" element={<Trendler />} />
          <Route path="bot" element={<BotAyarlari />} />
          <Route path="plan" element={<PlanYukselt />} />
          */}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}