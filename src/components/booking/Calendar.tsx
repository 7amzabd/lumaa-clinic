import { AnimatePresence, m } from 'motion/react'
import { useMemo, useState, type KeyboardEvent } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { parseLocalDate, todayIso } from '../../lib/format'
import { IconChevronLeft, IconChevronRight } from '../ui/Icons'

interface CalendarProps {
  /** التاريخ المختار بصيغة YYYY-MM-DD أو '' */
  value: string
  onChange: (iso: string) => void
  /** معرّف الشبكة (لربط العنوان ورسالة الخطأ) */
  id: string
  describedBy?: string
  invalid?: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')
const toIso = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/**
 * تقويم شهري مرسوم بدل حقل التاريخ العادي: الأيام الماضية وأيام الإغلاق معطّلة،
 * ويعمل بلوحة المفاتيح (الأسهم بين الأيام، PageUp/PageDown بين الشهور، Home/End لأول وآخر يوم).
 */
export function Calendar({ value, onChange, id, describedBy, invalid }: CalendarProps) {
  const { t, lang, dir } = useLang()
  const today = todayIso()
  const todayDate = parseLocalDate(today)
  const selected = value ? parseLocalDate(value) : null

  // الشهر المعروض: شهر التاريخ المختار، وإلا الشهر الحالي
  const [view, setView] = useState(() => {
    const base = selected ?? todayDate
    return { year: base.getFullYear(), month: base.getMonth() }
  })
  // اليوم الذي يحمل التركيز بلوحة المفاتيح (roving tabindex)
  const [focused, setFocused] = useState(value || today)
  const [slide, setSlide] = useState(1)

  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(site.locale[lang], { month: 'long', year: 'numeric' }), [lang])
  const dayFormatter = useMemo(() => new Intl.DateTimeFormat(site.locale[lang], { weekday: 'short' }), [lang])
  const fullFormatter = useMemo(
    () => new Intl.DateTimeFormat(site.locale[lang], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    [lang],
  )

  // أسماء أيام الأسبوع بدءًا من الأحد (نستخدم أسبوعًا مرجعيًا يبدأ بالأحد)
  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, i) => dayFormatter.format(new Date(2023, 0, 1 + i))), [dayFormatter])

  const firstOfMonth = new Date(view.year, view.month, 1)
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const leading = firstOfMonth.getDay() // خانات فارغة قبل أول يوم
  const cells: (Date | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.year, view.month, i + 1)),
  ]

  const isClosed = (date: Date) => site.booking.closedDays.includes(date.getDay())
  const isPast = (date: Date) => toIso(date) < today
  const isDisabled = (date: Date) => isPast(date) || isClosed(date)
  const canGoBack = view.year > todayDate.getFullYear() || (view.year === todayDate.getFullYear() && view.month > todayDate.getMonth())

  const changeMonth = (delta: number) => {
    setSlide(delta)
    setView((current) => {
      const next = new Date(current.year, current.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  /** ينقل التركيز إلى يوم آخر، ويغيّر الشهر المعروض إذا لزم */
  const moveFocus = (date: Date) => {
    if (toIso(date) < today) return
    const iso = toIso(date)
    if (date.getMonth() !== view.month || date.getFullYear() !== view.year) {
      setSlide(date > firstOfMonth ? 1 : -1)
      setView({ year: date.getFullYear(), month: date.getMonth() })
    }
    setFocused(iso)
    // بعد إعادة الرسم ننقل التركيز إلى الزر الجديد
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`#${id} [data-date="${iso}"]`)?.focus())
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const step = (days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    let next: Date | null = null
    if (event.key === forward) next = step(1)
    else if (event.key === backward) next = step(-1)
    else if (event.key === 'ArrowDown') next = step(7)
    else if (event.key === 'ArrowUp') next = step(-7)
    else if (event.key === 'Home') next = new Date(date.getFullYear(), date.getMonth(), 1)
    else if (event.key === 'End') next = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    else if (event.key === 'PageDown') next = new Date(date.getFullYear(), date.getMonth() + 1, Math.min(date.getDate(), 28))
    else if (event.key === 'PageUp') next = new Date(date.getFullYear(), date.getMonth() - 1, Math.min(date.getDate(), 28))
    if (!next) return
    event.preventDefault()
    moveFocus(next)
  }

  // أي يوم يحمل tabindex=0: المختار إن كان في هذا الشهر، وإلا اليوم المركّز، وإلا أول يوم متاح
  const focusedInView = cells.find((c) => c && toIso(c) === focused && !isDisabled(c))
  const firstAvailable = cells.find((c) => c && !isDisabled(c))
  const tabStop = focusedInView ? toIso(focusedInView) : firstAvailable ? toIso(firstAvailable) : ''

  const Prev = dir === 'rtl' ? IconChevronRight : IconChevronLeft
  const Next = dir === 'rtl' ? IconChevronLeft : IconChevronRight

  return (
    <div
      id={id}
      role="group"
      aria-labelledby={`${id}-label`}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={`overflow-hidden rounded-field border bg-surface p-4 transition-colors duration-300 ${invalid ? 'border-danger' : 'border-line'}`}
    >
      {/* رأس التقويم: اسم الشهر وأزرار التنقل */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={!canGoBack}
          aria-label={t(site.ui.previousMonth)}
          className="grid size-9 place-items-center rounded-full border border-line transition-colors hover:border-gold disabled:opacity-30"
        >
          <Prev className="size-4" />
        </button>
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={`${view.year}-${view.month}`}
            className="font-medium"
            aria-live="polite"
            initial={{ opacity: 0, y: 6 * slide }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 * slide }}
            transition={{ duration: 0.25 }}
          >
            {monthFormatter.format(firstOfMonth)}
          </m.p>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label={t(site.ui.nextMonth)}
          className="grid size-9 place-items-center rounded-full border border-line transition-colors hover:border-gold"
        >
          <Next className="size-4" />
        </button>
      </div>

      {/* أسماء الأيام */}
      <div className="mt-4 grid grid-cols-7 text-center text-xs text-ink-soft" aria-hidden="true">
        {weekdays.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>

      {/* شبكة الأيام */}
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={`${view.year}-${view.month}`}
          className="mt-1 grid grid-cols-7 gap-y-1"
          initial={{ opacity: 0, x: 16 * slide * (dir === 'rtl' ? -1 : 1) }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 * slide * (dir === 'rtl' ? -1 : 1) }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {cells.map((date, index) => {
            if (!date) return <span key={`empty-${index}`} />
            const iso = toIso(date)
            const disabled = isDisabled(date)
            const closed = isClosed(date) && !isPast(date)
            const isSelected = value === iso
            const isToday = iso === today
            return (
              <button
                key={iso}
                type="button"
                data-date={iso}
                tabIndex={iso === tabStop ? 0 : -1}
                disabled={disabled}
                aria-pressed={isSelected}
                aria-label={`${fullFormatter.format(date)}${closed ? ` (${t(site.ui.closedDay)})` : ''}`}
                onClick={() => {
                  onChange(iso)
                  setFocused(iso)
                }}
                onKeyDown={(event) => onKeyDown(event, date)}
                className={`relative mx-auto grid size-10 place-items-center rounded-full text-sm tabular-nums transition-[background-color,color,transform] duration-300 ease-lux ${
                  isSelected
                    ? 'bg-primary font-medium text-on-primary'
                    : disabled
                      ? closed
                        ? 'text-ink-soft/50 line-through'
                        : 'text-ink-soft/40'
                      : 'hover:bg-sand motion-safe:hover:scale-110'
                }`}
              >
                {date.getDate()}
                {isToday && !isSelected && (
                  <span aria-hidden="true" className="absolute bottom-1 size-1 rounded-full bg-gold" />
                )}
              </button>
            )
          })}
        </m.div>
      </AnimatePresence>
    </div>
  )
}
