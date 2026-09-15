import { useState } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import PhoneInput, { sadeceRakam } from '../components/common/PhoneInput'
import { User, Lock, Server } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'
import useLangStore from '../store/langStore'
import { mockTenants } from '../mocks/mockData'
import { t } from '../i18n'
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export default function Ayarlar() {
  const { user, cikisYap } = useAuthStore()
  const { theme } = useThemeStore()
  const { lang } = useLangStore()
  const isDark = theme === 'dark'

  const [profilLoading, setProfilLoading] = useState(false)
  const [sifreLoading, setSifreLoading] = useState(false)
  const [profil, setProfil] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '5321112233',
  })
  const [sifre, setSifre] = useState({ mevcutSifre: '', yeniSifre: '', yeniSifreTekrar: '' })
  const navigate = useNavigate()

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const divider = isDark ? '#374151' : '#F3F4F6'

  const aktifFirma = mockTenants.filter((f) => f.status === 'Aktif').length
  const aylikGelir = mockTenants
    .filter((f) => f.status === 'Aktif' && f.abonelik.odemeDurumu === 'Ödendi')
    .reduce((a, f) => a + f.abonelik.tutar, 0)

  const handleProfilKaydet = () => {
    if (sadeceRakam(profil.phone).length !== 10) {
      toast.error(t(lang, 'hataTelefon'))
      return
    }
    setProfilLoading(true)
    setTimeout(() => {
      setProfilLoading(false)
      toast.success(t(lang, 'profilGuncellendi'))
    }, 1200)
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
        <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>{t(lang, 'ayarlar')}</h1>
        <p className="text-sm mt-1" style={{ color: textSecondary }}>{t(lang, 'hesapAyarlari')}</p>
      </div>

      {/* Profil */}
      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: textPrimary }}>
          <User className="w-4 h-4" style={{ color: textSecondary }} /> {t(lang, 'profilBilgileri')}
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#090C14' }}>
            {user?.avatar || 'U'}
          </div>
          <div>
            <p className="font-semibold" style={{ color: textPrimary }}>{user?.name}</p>
            <p className="text-sm" style={{ color: textSecondary }}>{user?.role}</p>
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>{user?.company}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Input label={t(lang, 'adSoyad')} value={profil.name}
            onChange={(e) => setProfil((p) => ({ ...p, name: e.target.value }))} />
          <Input label={t(lang, 'eposta')} type="email" value={profil.email}
            onChange={(e) => setProfil((p) => ({ ...p, email: e.target.value }))} />
          <PhoneInput label={t(lang, 'telefon')} value={profil.phone}
            onChange={(v) => setProfil((p) => ({ ...p, phone: v }))} />
        </div>
        <div className="mt-4">
          <Button onClick={handleProfilKaydet} loading={profilLoading}>
            {profilLoading ? t(lang, 'kaydediliyor') : t(lang, 'bilgileriGuncelle')}
          </Button>
        </div>
      </Card>

      {/* Şifre */}
      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: textPrimary }}>
          <Lock className="w-4 h-4" style={{ color: textSecondary }} /> {t(lang, 'sifreDegistir')}
        </h2>
        <div className="flex flex-col gap-4">
          <Input label={t(lang, 'mevcutSifre')} type="password" placeholder="••••••"
            value={sifre.mevcutSifre} onChange={(e) => setSifre((s) => ({ ...s, mevcutSifre: e.target.value }))} />
          <Input label={t(lang, 'yeniSifre')} type="password" placeholder="••••••"
            value={sifre.yeniSifre} onChange={(e) => setSifre((s) => ({ ...s, yeniSifre: e.target.value }))} />
          <Input label={t(lang, 'yeniSifreTekrar')} type="password" placeholder="••••••"
            value={sifre.yeniSifreTekrar} onChange={(e) => setSifre((s) => ({ ...s, yeniSifreTekrar: e.target.value }))} />
        </div>
        <div className="mt-4">
          <Button onClick={handleSifreKaydet} loading={sifreLoading}>
            {sifreLoading ? t(lang, 'guncelleniyor') : t(lang, 'sifreyiGuncelle')}
          </Button>
        </div>
      </Card>

      {/* Sistem bilgisi */}
      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: textPrimary }}>
          <Server className="w-4 h-4" style={{ color: textSecondary }} /> {t(lang, 'sistemBilgisi')}
        </h2>
        <div className="flex flex-col divide-y" style={{ borderColor: divider }}>
          {[
            { label: t(lang, 'platform'), value: 'HumerSoft WPBot' },
            { label: t(lang, 'versiyon'), value: 'v1.0.0' },
            { label: t(lang, 'ortam'), value: 'Development / Mock Mode' },
            { label: t(lang, 'toplamFirma'), value: mockTenants.length },
            { label: t(lang, 'aktifFirma'), value: aktifFirma },
            { label: t(lang, 'aylikGelir'), value: `${aylikGelir.toLocaleString()} ₺` },
            { label: t(lang, 'apiDurumu'), value: t(lang, 'apiBagliDegil') },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3" style={{ borderColor: divider }}>
              <span className="text-sm" style={{ color: textSecondary }}>{item.label}</span>
              <span className="text-sm font-medium" style={{ color: textPrimary }}>{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}