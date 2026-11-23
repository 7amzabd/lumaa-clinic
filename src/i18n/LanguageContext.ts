import { createContext } from 'react'
import type { Lang, Localized } from '../content/types'

export interface LanguageContextValue {
  lang: Lang
  dir: 'rtl' | 'ltr'
  /** يختار النص المناسب للغة الحالية: t(site.hero.eyebrow) */
  t: <T>(value: Localized<T>) => T
  toggleLang: () => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

/** مفتاح حفظ اللغة في المتصفح (مكرر في index.html، غيّرهما معًا) */
export const LANG_STORAGE_KEY = 'lumaa-lang'
