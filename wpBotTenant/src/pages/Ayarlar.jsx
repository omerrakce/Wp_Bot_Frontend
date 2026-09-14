import { useState } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import PhoneInput, { sadeceRakam } from '../components/common/PhoneInput'
import { User, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export default function Ayarlar() {
  const { user, cikisYap } = useAuthStore()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const [profilLoading, setProfilLoading] = useState(false)
  const [sifreLoading, setSifreLoading] = useState(false)
  const [profil, setProfil] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '2125550101',
  })
  const [sifre, setSifre] = useState({
    mevcutSifre: '',
    yeniSifre: '',
    yeniSifreTekrar: '',
  })

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const navigate = useNavigate()

  const handleProfilKaydet = () => {
    if (sadeceRakam(profil.phone).length !== 10) {
      toast.error('Telefon numarası 10 haneli olmalı')
      return
    }
    setProfilLoading(true)
    setTimeout(() => {
      setProfilLoading(false)
      toast.success('Profil bilgileri güncellendi!')
    }, 1500)
  }

    const handleSifreKaydet = async () => {
    if (!sifre.mevcutSifre || !sifre.yeniSifre || !sifre.yeniSifreTekrar) {
      toast.error('Tüm alanları doldurun')
      return
    }
    if (sifre.yeniSifre.length < 8) {
      toast.error('Yeni şifre en az 8 karakter olmalı')
      return
    }
    if (sifre.yeniSifre !== sifre.yeniSifreTekrar) {
      toast.error('Yeni şifreler eşleşmiyor')
      return
    }
    setSifreLoading(true)
    try {
      await authService.sifreDegistir(sifre.mevcutSifre, sifre.yeniSifre)
      toast.success('Şifreniz değişti, lütfen tekrar giriş yapın')
      cikisYap()
      navigate('/login', { replace: true })
    } catch (e) {
      toast.error(e.message || 'Şifre güncellenemedi. Mevcut şifrenizi kontrol edin.')
      setSifreLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Ayarlar</h1>
        <p className="text-sm mt-1" style={{ color: textSecondary }}>Hesap bilgilerinizi yönetin</p>
      </div>

      {/* Profil */}
      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: textPrimary }}>
          <User className="w-4 h-4" style={{ color: textSecondary }} />
          Profil Bilgileri
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#090C14' }}>
            {user?.avatar || 'U'}
          </div>
          <div>
            <p className="font-semibold" style={{ color: textPrimary }}>{user?.name}</p>
            <p className="text-sm" style={{ color: textSecondary }}>{user?.role}</p>
            <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block font-medium"
              style={{ backgroundColor: isDark ? 'rgba(37,211,102,0.15)' : '#E0F7F7', color: '#25D366' }}>
              {user?.plan} Plan
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Ad Soyad" value={profil.name}
            onChange={(e) => setProfil((p) => ({ ...p, name: e.target.value }))} />
          <Input label="E-posta" type="email" value={profil.email}
            onChange={(e) => setProfil((p) => ({ ...p, email: e.target.value }))} />
          <PhoneInput label="Telefon" value={profil.phone}
            onChange={(v) => setProfil((p) => ({ ...p, phone: v }))} />
        </div>
        <div className="mt-4">
          <Button onClick={handleProfilKaydet} loading={profilLoading}>
            {profilLoading ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
          </Button>
        </div>
      </Card>

      {/* Şifre */}
      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: textPrimary }}>
          <Lock className="w-4 h-4" style={{ color: textSecondary }} />
          Şifre Değiştir
        </h2>
        <div className="flex flex-col gap-4">
          <Input label="Mevcut Şifre" type="password" placeholder="••••••"
            value={sifre.mevcutSifre} onChange={(e) => setSifre((s) => ({ ...s, mevcutSifre: e.target.value }))} />
          <Input label="Yeni Şifre" type="password" placeholder="••••••"
            value={sifre.yeniSifre} onChange={(e) => setSifre((s) => ({ ...s, yeniSifre: e.target.value }))} />
          <Input label="Yeni Şifre Tekrar" type="password" placeholder="••••••"
            value={sifre.yeniSifreTekrar} onChange={(e) => setSifre((s) => ({ ...s, yeniSifreTekrar: e.target.value }))} />
        </div>
        <div className="mt-4">
          <Button onClick={handleSifreKaydet} loading={sifreLoading}>
            {sifreLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </Button>
        </div>
      </Card>

    </div>
  )
}