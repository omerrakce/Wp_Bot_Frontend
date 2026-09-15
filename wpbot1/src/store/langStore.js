import { create } from 'zustand'

const useLangStore = create((set) => ({
  lang: 'tr', // Varsayılan başlangıç dili
  toggleLang: () => set((state) => ({ 
    lang: state.lang === 'tr' ? 'en' : 'tr' 
  })),
}))

export default useLangStore;