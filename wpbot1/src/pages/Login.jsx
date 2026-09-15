import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'
import useLangStore from '../store/langStore'
import { t } from '../i18n'
import { Sun, Moon, Languages, ShieldCheck } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [errors, setErrors] = useState({})

  const { girisYap, girisYapiliyor, isAuthenticated, hazir, oturumKontrol } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { lang, toggleLang } = useLangStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'
  const borderColor = isDark ? '#374151' : '#E5E7EB'

  useEffect(() => { if (!hazir) oturumKontrol() }, [hazir, oturumKontrol])
  useEffect(() => {
    if (hazir && isAuthenticated) navigate('/dashboard', { replace: true })
  }, [hazir, isAuthenticated, navigate])

    useEffect(() => {
    if (sessionStorage.getItem('wpbot_oturum_bitti')) {
      sessionStorage.removeItem('wpbot_oturum_bitti')
      toast('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.', { icon: '⏱️' })
    }
  }, [])

  const handleLogin = async () => {
    const yeniHatalar = {}
    if (!email.trim()) yeniHatalar.email = t(lang, 'hataTumAlanlar')
    if (!sifre) yeniHatalar.sifre = t(lang, 'hataTumAlanlar')
    if (Object.keys(yeniHatalar).length > 0) { setErrors(yeniHatalar); return }
    setErrors({})

    try {
      const user = await girisYap(email.trim(), sifre)
      toast.success(`${t(lang, 'hosgeldin')}, ${user.name}!`)
      navigate('/dashboard', { replace: true })
    } catch (e) {
      toast.error(e.message || t(lang, 'hataGirisBilgisi'))
    }
  }

  const enterIle = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-5" onKeyDown={enterIle}>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: textPrimary }}>{t(lang, 'girisYap')}</h2>
            <p className="text-sm mt-1" style={{ color: textSecondary }}>{t(lang, 'paneleErisim')}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleLang}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
              style={{ backgroundColor: subtleBg, borderColor, color: textSecondary }}>
              <Languages className="w-3.5 h-3.5" />
              {lang === 'tr' ? 'TR' : 'EN'}
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors"
              style={{ color: textSecondary }}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg"
          style={{ backgroundColor: subtleBg }}>
          <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#25D366' }} />
          <p className="text-xs" style={{ color: textSecondary }}>
            Bu panel yalnızca süper admin hesaplarına açıktır.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input label={t(lang, 'eposta')} type="email" placeholder="superadmin@humersoft.com"
            value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <Input label={t(lang, 'sifre')} type="password" placeholder="••••••"
            value={sifre} onChange={(e) => setSifre(e.target.value)} error={errors.sifre} />
        </div>

        <div className="flex justify-end -mt-2">
          <Link to="/sifremi-unuttum" className="text-xs font-medium"
            style={{ color: '#25D366' }}>
            Şifremi unuttum
          </Link>
        </div>

        <Button onClick={handleLogin} loading={girisYapiliyor} className="w-full py-2.5">
          {girisYapiliyor ? t(lang, 'girisYapiliyor') : t(lang, 'girisYap')}
        </Button>

        {/* Demo öncesi kaldırılacak */}
        <div className="rounded-lg p-3"
          style={{ backgroundColor: subtleBg, border: `1px solid ${borderColor}` }}>
          <p className="text-xs font-medium mb-1" style={{ color: textSecondary }}>{t(lang, 'testHesabi')}</p>
          <p className="text-xs" style={{ color: textSecondary }}>📧 superadmin@humersoft.com</p>
          <p className="text-xs" style={{ color: textSecondary }}>🔑 admin123</p>
        </div>

      </div>
    </AuthLayout>
  )
}