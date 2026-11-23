import { m, useReducedMotion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { useLang } from '../../i18n/useLang'
import { IconSparkle } from './Icons'

interface ShineTextProps {
  children: ReactNode
  /** false = انتظر (مثلًا حتى تنتهي شاشة التحميل) */
  play?: boolean
  /** تأخير بداية اللمعة بالثواني */
  delay?: number
}

/**
 * اللحظة المميزة في الموقع: لمعان ذهبي يمر على الكلمة مرة واحدة عند التحميل،
 * ثم تظهر نجمة صغيرة في نهايتها. (الشكل نفسه في الصنف text-shine داخل global.css)
 */
export function ShineText({ children, play = true, delay = 1.05 }: ShineTextProps) {
  const { dir } = useLang()
  const reduceMotion = useReducedMotion()

  // نحفظ اتجاه اللغة لحظة التحميل فقط، حتى لا تتكرر اللمعة عند تبديل اللغة
  const [initialDir] = useState(dir)
  // اللمعة تمر باتجاه القراءة: من اليمين لليسار في العربي، والعكس في الإنجليزي
  const from = initialDir === 'rtl' ? '0% 50%' : '100% 50%'
  const to = initialDir === 'rtl' ? '100% 50%' : '0% 50%'

  return (
    <span className="relative inline-block whitespace-nowrap">
      <m.span
        className="text-shine inline-block"
        initial={reduceMotion ? false : { backgroundPosition: from }}
        animate={play ? { backgroundPosition: to } : undefined}
        transition={{ delay, duration: 1.6, ease: [0.45, 0, 0.2, 1] }}
      >
        {children}
      </m.span>

      {/* نجمة صغيرة تتلألأ بعد مرور اللمعة، ثم تبقى في مكانها */}
      <m.span
        aria-hidden="true"
        className="absolute -top-[0.12em] -end-[0.42em] text-gold"
        initial={reduceMotion ? false : { scale: 0, rotate: -60, opacity: 0 }}
        animate={play ? { scale: [0, 1.15, 0.62], rotate: [-60, 25, 0], opacity: [0, 1, 1] } : undefined}
        transition={{ delay: delay + 1.2, duration: 1.1, ease: 'easeOut' }}
      >
        <IconSparkle className="size-[0.42em]" />
      </m.span>
    </span>
  )
}
