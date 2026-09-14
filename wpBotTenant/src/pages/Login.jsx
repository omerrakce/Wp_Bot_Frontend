import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'
import { Sun, Moon } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [errors, setErrors] = useState({})

  const { girisYap, girisYapiliyor, isAuthenticated, hazir, oturumKontrol } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'
  const borderColor = isDark ? '#374151' : '#E5E7EB'

  // Zaten girişliyse panele gönder
  useEffect(() => {
    if (!hazir) oturumKontrol()
  }, [hazir, oturumKontrol])

  useEffect(() => {
    if (hazir && isAuthenticated) navigate('/dashboard', { replace: true })
  }, [hazir, isAuthenticated, navigate])

  const handleLogin = async () => {
    const yeniHatalar = {}
    if (!email.trim()) yeniHatalar.email = 'E-posta zorunludur'
    if (!sifre) yeniHatalar.sifre = 'Şifre zorunludur'
    if (Object.keys(yeniHatalar).length > 0) {
      setErrors(yeniHatalar)
      return
    }
    setErrors({})

    try {
      const user = await girisYap(email.trim(), sifre)
      toast.success(`Hoş geldiniz, ${user.name}!`)
      navigate('/dashboard', { replace: true })
    } catch (e) {
      toast.error(e.message || 'E-posta veya şifre hatalı')
    }
  }

  const enterIle = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-5" onKeyDown={enterIle}>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: textPrimary }}>Giriş Yap</h2>
            <p className="text-sm mt-1" style={{ color: textSecondary }}>Firma panelinize erişin</p>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors"
            style={{ color: textSecondary }}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Input label="E-posta" type="email" placeholder="admin@firma.com"
            value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <Input label="Şifre" type="password" placeholder="••••••"
            value={sifre} onChange={(e) => setSifre(e.target.value)} error={errors.sifre} />
        </div>

        <div className="flex justify-end -mt-2">
          <Link to="/sifremi-unuttum" className="text-xs font-medium"
            style={{ color: '#25D366' }}>
            Şifremi unuttum
          </Link>
        </div>

        <Button onClick={handleLogin} loading={girisYapiliyor} className="w-full py-2.5">
          {girisYapiliyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </Button>

        {/* Demo öncesi kaldırılacak */}
        <div className="rounded-lg p-3"
          style={{ backgroundColor: subtleBg, border: `1px solid ${borderColor}` }}>
          <p className="text-xs font-medium mb-1" style={{ color: textSecondary }}>Test hesabı:</p>
          <p className="text-xs" style={{ color: textSecondary }}>📧 admin@firma.com</p>
          <p className="text-xs" style={{ color: textSecondary }}>🔑 sifre123</p>
        </div>

      </div>
    </AuthLayout>
  )
}