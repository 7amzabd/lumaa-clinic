import { m, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { formatDate, formatTime } from '../../lib/format'
import type { BookingValues } from '../../lib/validation'
import { getServiceName } from '../../lib/whatsapp'
import { Button, LinkButton } from '../ui/Button'
import { IconWhatsapp } from '../ui/Icons'

interface BookingSuccessProps {
  values: BookingValues
  whatsappLink: string
  onReset: () => void
}

/** رسالة التأكيد بعد الإرسال: علامة صح مرسومة، ملخص الحجز، ورابط احتياطي لواتساب */
export function BookingSuccess({ values, whatsappLink, onReset }: BookingSuccessProps) {
  const { t, lang } = useLang()
  const reduceMotion = useReducedMotion()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { success, fields } = site.booking

  // ننقل التركيز إلى العنوان حتى يقرأه قارئ الشاشة مباشرة
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const summary = [
    { label: fields.service.label, value: getServiceName(values.service, lang) },
    { label: fields.date.label, value: formatDate(values.date, lang) },
    { label: fields.time.label, value: formatTime(values.time, lang) },
  ]

  return (
    <div className="mt-10 flex flex-col items-center text-center" role="status">
      {/* علامة صح ترسم نفسها */}
      <svg viewBox="0 0 64 64" className="size-20 text-success" aria-hidden="true">
        <m.circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <m.path
          d="M20 33l8 8 16-17"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.55, duration: 0.5, ease: 'easeOut' }}
        />
      </svg>

      <h3 ref={headingRef} tabIndex={-1} className="heading-card mt-6 text-balance focus:outline-none">
        {t(success.title).replace('{name}', values.name.trim())}
      </h3>
      <p className="mt-3 max-w-md text-ink-soft">{t(success.text)}</p>

      {/* ملخص الحجز */}
      <dl className="mt-8 w-full max-w-md divide-y divide-line rounded-card border border-line text-sm">
        {summary.map((row) => (
          <div key={row.label.en} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <dt className="text-ink-soft">{t(row.label)}</dt>
            <dd className="text-end font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
        <LinkButton href={whatsappLink} target="_blank" rel="noopener noreferrer" variant="outline" className="w-full sm:w-auto">
          <IconWhatsapp className="size-5" />
          {t(success.fallback)}
        </LinkButton>
        <Button variant="ghost" onClick={onReset} className="w-full sm:w-auto">
          {t(success.newBooking)}
        </Button>
      </div>
    </div>
  )
}
