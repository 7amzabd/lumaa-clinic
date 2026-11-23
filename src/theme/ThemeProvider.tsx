import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { THEME_STORAGE_KEY, ThemeContext, type Theme } from './ThemeContext'

const query = '(prefers-color-scheme: dark)'

/** الوضع الظاهر: المثبّت يدويًا على <html> إن وُجد، وإلا إعداد الجهاز */
function currentTheme(): Theme {
  const fixed = document.documentElement.dataset.theme
  if (fixed === 'light' || fixed === 'dark') return fixed
  return window.matchMedia(query).matches ? 'dark' : 'light'
}

// لون شريط المتصفح في الجوال لكل وضع (نفس قيم --canvas في theme.css)
const BAR_COLORS: Record<Theme, string> = { light: '#f8f1ec', dark: '#1b1310' }

/**
 * الوضع الفاتح/الداكن: تلقائي حسب الجهاز، وزر الشريط العلوي يثبّته ويحفظه.
 * السكربت الصغير في index.html يطبّق الوضع المحفوظ قبل تحميل React حتى لا يومض.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  // إذا لم يثبّت الزائر وضعًا، نتابع تغيّر إعداد جهازه
  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => {
      if (!document.documentElement.dataset.theme) setTheme(media.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      meta.content = BAR_COLORS[theme]
    })
  }, [theme])

  const toggleTheme = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    setTheme(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // التخزين قد يكون ممنوعًا (التصفح الخاص)، والموقع يعمل بدونه
    }
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
