import type { SectionIntro } from '../../content/types'
import { useLang } from '../../i18n/useLang'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  /** معرّف العنوان، ويُربط بالقسم عبر aria-labelledby */
  id: string
  content: SectionIntro
  className?: string
  /** true = يمكن نقل التركيز إلى العنوان برمجيًا (نستخدمه في قسم الحجز) */
  focusableTitle?: boolean
}

/** عنوان موحّد لكل الأقسام: سطر صغير ذهبي + عنوان + وصف */
export function SectionHeading({ id, content, className = '', focusableTitle = false }: SectionHeadingProps) {
  const { t } = useLang()

  return (
    <Reveal className={`max-w-2xl ${className}`}>
      <p className="eyebrow">{t(content.eyebrow)}</p>
      <h2
        id={id}
        tabIndex={focusableTitle ? -1 : undefined}
        className="heading-section mt-4 focus:outline-none"
      >
        {t(content.title)}
      </h2>
      {content.intro && <p className="mt-5 text-lg text-ink-soft">{t(content.intro)}</p>}
    </Reveal>
  )
}
