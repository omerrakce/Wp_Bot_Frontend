import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Firmalar from '../pages/Firmalar'
import FirmaDetay from '../pages/FirmaDetay'
import Raporlar from '../pages/Raporlar'
import Ayarlar from '../pages/Ayarlar'
import Abonelikler from '../pages/Abonelikler'
import SifreBelirle from '../pages/SifreBelirle'
import SifreSifirla from '../pages/SifreSifirla'
import SifremiUnuttum from '../pages/SifremiUnuttum'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/sifre-belirle" element={<SifreBelirle />} />
        <Route path="/sifre-sifirla" element={<SifreSifirla />} />
        <Route path="/reset-password" element={<Navigate to={`/sifre-sifirla${window.location.search}`} replace />} />
        <Route path="/sifremi-unuttum" element={<SifremiUnuttum />} />
        <Route path="/" element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="firmalar" element={<Firmalar />} />
          <Route path="firmalar/:id" element={<FirmaDetay />} />
          <Route path="raporlar" element={<Raporlar />} />
          <Route path="abonelikler" element={<Abonelikler />} />
          <Route path="ayarlar" element={<Ayarlar />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}