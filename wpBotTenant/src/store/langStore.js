import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useLangStore = create(
  persist(
    (set) => ({
      lang: 'tr',
      toggleLang: () => set((state) => ({
        lang: state.lang === 'tr' ? 'en' : 'tr'
      })),
    }),
    { name: 'lang-storage' }
  )
)

export default useLangStore