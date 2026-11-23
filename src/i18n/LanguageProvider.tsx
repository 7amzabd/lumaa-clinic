import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { site } from '../content/site'
import type { Lang, Localized } from '../content/types'
import { LANG_STORAGE_KEY, LanguageContext } from './LanguageContext'

/**
 * مزوّد اللغة: يحفظ اللغة الحالية، ويغيّر اتجاه الصفحة (rtl / ltr)
 * وعنوانها، ويحفظ اختيار الزائر في المتصفح.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  // السكربت الصغير في index.html يضع اللغة المحفوظة على <html> قبل تحميل React،
  // لذلك نقرأها من هناك ليبدأ الموقع باللغة الصحيحة بدون وميض.
  const [lang, setLang] = useState<Lang>(() =>
    document.documentElement.lang === 'en' ? 'en' : 'ar',
  )
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const html = document.documentElement
    html.lang = lang
    html.dir = dir
    document.title = site.meta.title[lang]
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang)
    } catch {
      // بعض المتصفحات تمنع التخزين (مثل التصفح الخاص)، والموقع يعمل بدونه
    }
  }, [lang, dir])

  const toggleLang = useCallback(() => setLang((current) => (current === 'ar' ? 'en' : 'ar')), [])
  const t = useCallback(<T,>(value: Localized<T>): T => value[lang], [lang])

  const value = useMemo(() => ({ lang, dir, t, toggleLang }) as const, [lang, dir, t, toggleLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
