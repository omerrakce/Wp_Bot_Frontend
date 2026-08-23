import { create } from 'zustand'
import { authService } from '../services/authService'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  hazir: false,
  girisYapiliyor: false,

  async girisYap(email, sifre) {
    set({ girisYapiliyor: true })
    try {
      const user = await authService.login(email, sifre)
      set({ user, isAuthenticated: true, girisYapiliyor: false, hazir: true })
      return user
    } catch (e) {
      set({ girisYapiliyor: false })
      throw e
    }
  },

  async oturumKontrol() {
    if (!authService.tokenVarMi()) {
      set({ user: null, isAuthenticated: false, hazir: true })
      return
    }
    try {
      const user = await authService.ben()
      if (user.role !== 'superadmin') {
        authService.cikis()
        set({ user: null, isAuthenticated: false, hazir: true })
        return
      }
      set({ user, isAuthenticated: true, hazir: true })
    } catch {
      authService.cikis()
      set({ user: null, isAuthenticated: false, hazir: true })
    }
  },

  cikisYap() {
    authService.cikis()
    set({ user: null, isAuthenticated: false })
  },
}))

export default useAuthStore