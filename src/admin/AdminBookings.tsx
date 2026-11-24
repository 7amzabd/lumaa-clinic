import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../components/ui/Button'
import { IconChevronDown } from '../components/ui/Icons'
import { site } from '../content/site'
import type { BookingPeriod, BookingStatus } from '../content/types'
import { CONSULTATION_ID } from '../state/BookingContext'
import { setBookingStatus, watchBookings, type BookingRecord } from '../firebase/admin'
import { useLang } from '../i18n/useLang'
import { inputClass } from '../lib/form'
import { todayIso } from '../lib/format'
import { BookingCard } from './BookingCard'
import { DEFAULT_FILTERS, filterExceptStatus, sortBookings, type BookingFilters } from './filterBookings'

const STATUSES: BookingStatus[] = ['new', 'confirmed', 'done', 'cancelled']
const PERIODS: BookingPeriod[] = ['upcoming', 'today', 'past', 'all']

/**
 * لوحة الحجوزات: أرقام سريعة في الأعلى، ثم التصفية، ثم قائمة الحجوزات.
 * القائمة تتحدث لحظيًا: أي حجز جديد من الموقع يظهر هنا دون تحديث الصفحة.
 */
export function AdminBookings() {
  const { t } = useLang()
  const { admin, services, booking } = site
  // null = لم تصل البيانات بعد
  const [bookings, setBookings] = useState<BookingRecord[] | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [filters, setFilters] = useState<BookingFilters>(DEFAULT_FILTERS)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [updateFailed, setUpdateFailed] = useState(false)

  useEffect(() => watchBookings(setBookings, () => setLoadFailed(true)), [])

  const changeStatus = async (id: string, status: BookingStatus) => {
    setBusyId(id)
    setUpdateFailed(false)
    try {
      await setBookingStatus(id, status)
    } catch {
      setUpdateFailed(true)
    }
    setBusyId(null)
  }

  if (loadFailed) {
    return (
      <p role="alert" className="mt-10 rounded-card border border-danger/30 p-6 text-danger">
        {t(admin.loadError)}
      </p>
    )
  }

  if (!bookings) {
    return (
      <div role="status" className="mt-10">
        <p className="sr-only">{t(admin.loading)}</p>
        <div aria-hidden="true" className="grid gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-36 rounded-card bg-sand motion-safe:animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const today = todayIso()
  const stats = [
    { label: admin.stats.today, value: bookings.filter((b) => b.date === today && b.status !== 'cancelled').length },
    { label: admin.stats.new, value: bookings.filter((b) => b.status === 'new').length },
    { label: admin.stats.upcoming, value: bookings.filter((b) => b.status === 'confirmed' && b.date >= today).length },
    { label: admin.stats.total, value: bookings.length },
  ]

  // نطبّق الخدمة والفترة والبحث أولًا، لنعرف عدد كل حالة، ثم نطبّق الحالة ونرتّب
  const beforeStatus = filterExceptStatus(bookings, filters, today)
  const visible = sortBookings(
    filters.status === 'all' ? beforeStatus : beforeStatus.filter((b) => b.status === filters.status),
    filters.period,
  )
  const countOf = (status: BookingStatus) => beforeStatus.filter((b) => b.status === status).length
  const filtersChanged =
    filters.status !== DEFAULT_FILTERS.status ||
    filters.service !== DEFAULT_FILTERS.service ||
    filters.period !== DEFAULT_FILTERS.period ||
    filters.search !== DEFAULT_FILTERS.search

  const statusOptions: { value: BookingFilters['status']; label: string; count: number }[] = [
    { value: 'all', label: t(admin.filters.allStatuses), count: beforeStatus.length },
    ...STATUSES.map((status) => ({ value: status, label: t(admin.statuses[status]), count: countOf(status) })),
  ]

  return (
    <>
      {/* أرقام سريعة */}
      <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label.en} className="flex flex-col-reverse rounded-card border border-line bg-surface p-5">
            <dt className="mt-1 text-sm text-ink-soft">{t(stat.label)}</dt>
            <dd className="font-heading text-4xl leading-tight lining-nums tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="heading-card mt-12">{t(admin.bookingsTitle)}</h2>

      {/* التصفية: بحث + خدمة + فترة */}
      <section aria-label={t(admin.filters.title)} className="mt-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm font-medium">
            {t(admin.filters.search)}
            <input
              type="search"
              value={filters.search}
              onChange={(event) => setFilters((previous) => ({ ...previous, search: event.target.value }))}
              placeholder={t(admin.filters.searchPlaceholder)}
              className={`${inputClass} mt-2 h-12 font-normal`}
            />
          </label>
          <SelectField
            label={t(admin.filters.service)}
            value={filters.service}
            onChange={(service) => setFilters((previous) => ({ ...previous, service }))}
          >
            <option value="">{t(admin.filters.allServices)}</option>
            <option value={CONSULTATION_ID}>{t(booking.consultationOption)}</option>
            {services.items.map((service) => (
              <option key={service.id} value={service.id}>
                {t(service.name)}
              </option>
            ))}
          </SelectField>
          <SelectField
            label={t(admin.filters.period)}
            value={filters.period}
            onChange={(period) => setFilters((previous) => ({ ...previous, period: period as BookingPeriod }))}
          >
            {PERIODS.map((period) => (
              <option key={period} value={period}>
                {t(admin.filters.periods[period])}
              </option>
            ))}
          </SelectField>
        </div>

        {/* أزرار الحالة، وبجانب كل حالة عدد حجوزاتها */}
        <div role="group" aria-label={t(admin.filters.status)} className="mt-4 flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filters.status === option.value}
              onClick={() => setFilters((previous) => ({ ...previous, status: option.value }))}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm transition-colors duration-300 hover:border-gold aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-on-primary"
            >
              {option.label}
              <span className="lining-nums tabular-nums opacity-75">{option.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* يُقرأ لقارئ الشاشة عند تغيّر القائمة */}
      <p role="status" className="mt-6 text-sm text-ink-soft">
        {t(admin.resultsCount).replace('{count}', String(visible.length))}
      </p>

      {updateFailed && (
        <p role="alert" className="mt-4 rounded-field border border-danger/30 px-4 py-3 text-sm text-danger">
          {t(admin.updateError)}
        </p>
      )}

      {visible.length > 0 ? (
        <ul className="mt-4 grid gap-3">
          {visible.map((item) => (
            <BookingCard key={item.id} booking={item} busy={busyId === item.id} onStatusChange={changeStatus} />
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-card border border-dashed border-line p-10 text-center">
          {bookings.length === 0 ? (
            <>
              <p className="heading-card">{t(admin.empty.title)}</p>
              <p className="mt-2 text-sm text-ink-soft">{t(admin.empty.text)}</p>
            </>
          ) : (
            <>
              <p className="text-ink-soft">{t(admin.emptyFiltered)}</p>
              {filtersChanged && (
                <Button variant="outline" className="mt-5" onClick={() => setFilters({ ...DEFAULT_FILTERS, period: 'all' })}>
                  {t(admin.filters.clear)}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}

/** قائمة اختيار بنفس شكل حقول الموقع */
function SelectField({ label, value, onChange, children }: SelectFieldProps) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <span className="relative mt-2 block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} h-12 cursor-pointer appearance-none pe-11 font-normal`}
        >
          {children}
        </select>
        <IconChevronDown className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
      </span>
    </label>
  )
}
