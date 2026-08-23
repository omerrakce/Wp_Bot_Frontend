import { tr } from './tr'
import { en } from './en'

export const translations = { tr, en }

export const t = (lang, key) => {
  return translations[lang]?.[key] || key
}