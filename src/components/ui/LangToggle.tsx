import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'

/** زر تبديل اللغة: يعرض اسم اللغة الأخرى (EN / عربي) */
export function LangToggle() {
  const { t, lang, toggleLang } = useLang()

  return (
    <button
      type="button"
      onClick={toggleLang}
      title={t(site.ui.switchLanguage)}
      className="inline-flex h-10 min-w-11 items-center justify-center rounded-full border border-ink/15 px-3 text-sm font-medium transition-colors duration-300 hover:border-gold hover:text-gold-deep"
    >
      <span lang={lang === 'ar' ? 'en' : 'ar'}>{t(site.ui.languageToggle)}</span>
      <span className="sr-only">{t(site.ui.switchLanguage)}</span>
    </button>
  )
}
