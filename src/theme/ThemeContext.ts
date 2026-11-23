import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  /** الوضع الظاهر الآن (بعد احتساب إعداد الجهاز) */
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

/** مفتاح حفظ الوضع في المتصفح (مكرر في index.html، غيّرهما معًا) */
export const THEME_STORAGE_KEY = 'lumaa-theme'

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
