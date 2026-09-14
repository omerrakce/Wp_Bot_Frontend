import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { authService } from '../services/authService'
import useThemeStore from '../store/themeStore'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function SifreBelirle() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [durum, setDurum] = useState('kontrol')  // kontrol | gecerli | gecersiz
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [sifreTekrar, setSifreTekrar] = useState('')
  const [kaydediyor, setKaydediyor] = useState(false)
  const [hatalar, setHatalar] = useState({})

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'

  useEffect(() => {
    if (!token) { setDurum('gecersiz'); return }
    authService.davetDogrula(token).then((sonuc) => {
      setDurum(sonuc.gecerli ? 'gecerli' : 'gecersiz')
      if (sonuc.email) setEmail(sonuc.email)
    })
  }, [token])

  const handleKaydet = async () => {
    const yeniHatalar = {}
    if (sifre.length < 8) yeniHatalar.sifre = 'Şifre en az 8 karakter olmalı'
    if (sifre !== sifreTekrar) yeniHatalar.sifreTekrar = 'Şifreler eşleşmiyor'
    if (Object.keys(yeniHatalar).length > 0) { setHatalar(yeniHatalar); return }
    setHatalar({})

    setKaydediyor(true)
    try {
      await authService.sifreBelirle(token, sifre)
      toast.success('Şifreniz belirlendi! Şimdi giriş yapabilirsiniz.')
      navigate('/login', { replace: true })
    } catch (e) {
      toast.error(e.message || 'Bir hata oluştu, lütfen tekrar deneyin.')
    } finally {
      setKaydediyor(false)
    }
  }

  const enterIle = (e) => { if (e.key === 'Enter') handleKaydet() }

  if (durum === 'kontrol') {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 py-6">
          <Spinner size="lg" />
          <p className="text-sm" style={{ color: textSecondary }}>Davet bağlantısı kontrol ediliyor...</p>
        </div>
      </AuthLayout>
    )
  }

  if (durum === 'gecersiz') {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <XCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
          <h2 className="text-lg font-semibold" style={{ color: textPrimary }}>Bağlantı geçersiz</h2>
          <p className="text-sm" style={{ color: textSecondary }}>
            Bu davet bağlantısının süresi dolmuş veya daha önce kullanılmış olabilir.
          </p>
          <Link to="/login" className="text-sm font-medium mt-2" style={{ color: '#25D366' }}>
            Giriş sayfasına dön
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-5" onKeyDown={enterIle}>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} />
          <div>
            <h2 className="text-xl font-semibold" style={{ color: textPrimary }}>Şifrenizi Belirleyin</h2>
            <p className="text-sm mt-1" style={{ color: textSecondary }}>
              {email ? `${email} hesabı için` : 'Hesabınız için'} yeni bir şifre oluşturun
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input label="Yeni Şifre" type="password" placeholder="En az 8 karakter"
            value={sifre} onChange={(e) => setSifre(e.target.value)} error={hatalar.sifre} />
          <Input label="Yeni Şifre (Tekrar)" type="password" placeholder="••••••••"
            value={sifreTekrar} onChange={(e) => setSifreTekrar(e.target.value)} error={hatalar.sifreTekrar} />
        </div>

        <Button onClick={handleKaydet} loading={kaydediyor} className="w-full py-2.5">
          {kaydediyor ? 'Kaydediliyor...' : 'Şifreyi Belirle ve Giriş Yap'}
        </Button>
      </div>
    </AuthLayout>
  )
}