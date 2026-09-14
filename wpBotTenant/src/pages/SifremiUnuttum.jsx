import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { authService } from '../services/authService'
import useThemeStore from '../store/themeStore'
import { ArrowLeft, MailCheck } from 'lucide-react'

export default function SifremiUnuttum() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [email, setEmail] = useState('')
  const [gonderiliyor, setGonderiliyor] = useState(false)
  const [gonderildi, setGonderildi] = useState(false)
  const [hata, setHata] = useState('')

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const subtleBg = isDark ? '#111827' : '#F9FAFB'
  const borderColor = isDark ? '#374151' : '#E5E7EB'

  const handleGonder = async () => {
    if (!email.trim() || !email.includes('@')) {
      setHata('Geçerli bir e-posta adresi girin')
      return
    }
    setHata('')
    setGonderiliyor(true)
    try {
      await authService.sifremiUnuttum(email.trim())
    } catch {
      // Bilinçli olarak hatayı yutuyoruz — e-posta var/yok bilgisini sızdırmamak için
      // her durumda aynı başarı mesajı gösteriliyor
    } finally {
      setGonderiliyor(false)
      setGonderildi(true)
    }
  }

  const enterIle = (e) => { if (e.key === 'Enter') handleGonder() }

  if (gonderildi) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <MailCheck className="w-10 h-10" style={{ color: '#25D366' }} />
          <h2 className="text-lg font-semibold" style={{ color: textPrimary }}>E-postanızı kontrol edin</h2>
          <p className="text-sm" style={{ color: textSecondary }}>
            Bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.
            Bağlantı 1 saat boyunca geçerlidir.
          </p>
          <Link to="/login" className="text-sm font-medium mt-2 flex items-center gap-1" style={{ color: '#25D366' }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Giriş sayfasına dön
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-5" onKeyDown={enterIle}>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: textPrimary }}>Şifremi Unuttum</h2>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            Hesabınıza kayıtlı e-posta adresini girin, sıfırlama bağlantısı gönderelim
          </p>
        </div>

        <Input label="E-posta" type="email" placeholder="ornek@firma.com"
          value={email} onChange={(e) => setEmail(e.target.value)} error={hata} />

        <Button onClick={handleGonder} loading={gonderiliyor} className="w-full py-2.5">
          {gonderiliyor ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
        </Button>

        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: subtleBg, border: `1px solid ${borderColor}` }}>
          <Link to="/login" className="text-xs font-medium flex items-center justify-center gap-1" style={{ color: textSecondary }}>
            <ArrowLeft className="w-3 h-3" /> Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}