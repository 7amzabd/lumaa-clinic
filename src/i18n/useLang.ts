import { useContext } from 'react'
import { LanguageContext } from './LanguageContext'

/**
 * استخدمه داخل أي مكوّن:
 *   const { t, lang, dir, toggleLang } = useLang()
 *   <h2>{t(site.services.title)}</h2>
 */
export function useLang() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLang must be used inside <LanguageProvider>')
  return context
}
