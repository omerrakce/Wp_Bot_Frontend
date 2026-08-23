import { api, tokenKaydet, tokenSil, tokenAl } from './api'

const kullaniciNormalize = (u = {}) => ({
  id: u.id,
  email: u.email ?? '',
  role: u.role ?? 'tenant',
  tenantId: u.tenant_id ?? u.tenantId ?? null,
  name: u.name || (u.email ? u.email.split('@')[0] : 'Kullanıcı'),
  company: u.company || 'HumerSoft Technology',
  avatar: (u.name || u.email || 'K')
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join(''),
})

export const authService = {
  async login(email, sifre) {
    const govde = new URLSearchParams()
    govde.append('username', email)
    govde.append('password', sifre)

    const veri = await api.post('/api/auth/login', govde, { yetkisiz: true })
    if (!veri.access_token) throw new Error('Sunucu geçerli bir oturum döndürmedi.')

    const user = kullaniciNormalize(veri.user ?? {})
    if (user.role !== 'superadmin') {
      throw new Error('Bu panel yalnızca süper admin hesaplarına açıktır.')
    }

    tokenKaydet(veri.access_token)
    return user
  },

  async ben() {
    const veri = await api.get('/api/auth/me')
    return kullaniciNormalize(veri.user ?? veri)
  },

  cikis() { tokenSil() },
  tokenVarMi() { return !!tokenAl() },

  async davetDogrula(token) {
    try {
      const veri = await api.get(`/api/auth/verify-invite-token?token=${encodeURIComponent(token)}`, { yetkisiz: true })
      return { gecerli: true, email: veri.email ?? null }
    } catch {
      return { gecerli: false, email: null }
    }
  },

  async sifreBelirle(token, sifre) {
    await api.post('/api/auth/set-password', { token, password: sifre }, { yetkisiz: true })
  },

  async sifremiUnuttum(email) {
    await api.post('/api/auth/forgot-password', { email }, { yetkisiz: true })
  },

  async sifreSifirla(token, sifre) {
    await api.post('/api/auth/reset-password', { token, password: sifre }, { yetkisiz: true })
  },
    async sifreDegistir(mevcutSifre, yeniSifre) {
    await api.post('/api/auth/change-password', {
      current_password: mevcutSifre,
      new_password: yeniSifre,
    })
  },

}