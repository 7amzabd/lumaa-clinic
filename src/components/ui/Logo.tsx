import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { IconSparkle } from './Icons'

/** الشعار نصًا: «لُمعة» أو "Lumaa" مع نجمة اللمعة الذهبية */
export function Logo({ className = '' }: { className?: string }) {
  const { t, lang } = useLang()

  return (
    <a
      href="#top"
      aria-label={t(site.ui.homeLink)}
      className={`group inline-flex items-center gap-1.5 rounded-full font-heading leading-none ${className}`}
    >
      <span className={lang === 'ar' ? 'text-[1.7rem] font-semibold' : 'text-[1.85rem] font-semibold tracking-[0.04em]'}>
        {t(site.brand.name)}
      </span>
      <IconSparkle className="size-3 -translate-y-2 text-gold transition-transform duration-700 ease-lux motion-safe:group-hover:rotate-90" />
    </a>
  )
}
