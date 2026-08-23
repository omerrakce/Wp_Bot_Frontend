import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { authService } from '../services/authService'
import useThemeStore from '../store/themeStore'
import { XCircle } from 'lucide-react'

export default function SifreSifirla() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [sifre, setSifre] = useState('')
  const [sifreTekrar, setSifreTekrar] = useState('')
  const [kaydediyor, setKaydediyor] = useState(false)
  const [hatalar, setHatalar] = useState({})

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'

  if (!token) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <XCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
          <h2 className="text-lg font-semibold" style={{ color: textPrimary }}>Bağlantı geçersiz</h2>
          <p className="text-sm" style={{ color: textSecondary }}>
            Şifre sıfırlama bağlantısı eksik veya hatalı.
          </p>
          <Link to="/sifremi-unuttum" className="text-sm font-medium mt-2" style={{ color: '#00B4B4' }}>
            Yeni bağlantı iste
          </Link>
        </div>
      </AuthLayout>
    )
  }

  const handleKaydet = async () => {
    const yeniHatalar = {}
    if (sifre.length < 8) yeniHatalar.sifre = 'Şifre en az 8 karakter olmalı'
    if (sifre !== sifreTekrar) yeniHatalar.sifreTekrar = 'Şifreler eşleşmiyor'
    if (Object.keys(yeniHatalar).length > 0) { setHatalar(yeniHatalar); return }
    setHatalar({})

    setKaydediyor(true)
    try {
      await authService.sifreSifirla(token, sifre)
      toast.success('Şifreniz güncellendi! Yeni şifrenizle giriş yapabilirsiniz.')
      navigate('/login', { replace: true })
    } catch (e) {
      toast.error(e.message || 'Bağlantının süresi dolmuş olabilir, yeniden talep edin.')
    } finally {
      setKaydediyor(false)
    }
  }

  const enterIle = (e) => { if (e.key === 'Enter') handleKaydet() }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-5" onKeyDown={enterIle}>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: textPrimary }}>Yeni Şifre Belirleyin</h2>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            Hesabınız için yeni bir şifre oluşturun
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input label="Yeni Şifre" type="password" placeholder="En az 8 karakter"
            value={sifre} onChange={(e) => setSifre(e.target.value)} error={hatalar.sifre} />
          <Input label="Yeni Şifre (Tekrar)" type="password" placeholder="••••••••"
            value={sifreTekrar} onChange={(e) => setSifreTekrar(e.target.value)} error={hatalar.sifreTekrar} />
        </div>

        <Button onClick={handleKaydet} loading={kaydediyor} className="w-full py-2.5">
          {kaydediyor ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
        </Button>
      </div>
    </AuthLayout>
  )
}