import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { Button, LinkButton } from '../components/ui/Button'
import { IconWhatsapp } from '../components/ui/Icons'
import { site } from '../content/site'
import type { BookingStatus } from '../content/types'
import type { BookingRecord } from '../firebase/admin'
import { useLang } from '../i18n/useLang'
import { formatDate, formatDateTime, formatTime } from '../lib/format'
import { getServiceName } from '../lib/whatsapp'
import { toWhatsappNumber } from './filterBookings'

// لون شارة كل حالة (النص داخل الشارة يشرحها، فاللون ليس الوسيلة الوحيدة)
const STATUS_STYLE: Record<BookingStatus, string> = {
  new: 'border-gold-deep/50 text-gold-deep',
  confirmed: 'border-success/50 text-success',
  done: 'border-line text-ink-soft',
  cancelled: 'border-danger/40 text-danger',
}

interface BookingCardProps {
  booking: BookingRecord
  /** true أثناء حفظ تغيير الحالة: نعطّل الأزرار حتى ينتهي */
  busy: boolean
  onStatusChange: (id: string, status: BookingStatus) => void
}

/** بطاقة حجز واحد: بيانات العميلة والموعد، ثم أزرار تغيير الحالة ومراسلتها */
export function BookingCard({ booking, busy, onStatusChange }: BookingCardProps) {
  const { t, lang } = useLang()
  const { admin, booking: bookingText } = site
  const titleId = `booking-${booking.id}`
  const setStatus = (status: BookingStatus) => onStatusChange(booking.id, status)

  // رسالة جاهزة للعميلة بلغتها التي حجزت بها
  const reply = admin.whatsappReply[booking.lang]
    .replace('{name}', booking.name)
    .replace('{date}', formatDate(booking.date, booking.lang))
    .replace('{time}', formatTime(booking.time, booking.lang))
  const whatsappLink = `https://wa.me/${toWhatsappNumber(booking.phone)}?text=${encodeURIComponent(reply)}`

  return (
    <m.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-card border border-line bg-surface p-5 sm:p-6"
    >
      <article aria-labelledby={titleId}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 id={titleId} className="heading-card break-words">
              {booking.name}
            </h3>
            <p className="mt-1 text-sm text-gold-deep">{getServiceName(booking.service, lang)}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLE[booking.status]}`}>
            {t(admin.statuses[booking.status])}
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm lg:grid-cols-4">
          <Detail label={t(bookingText.fields.date.label)}>{formatDate(booking.date, lang)}</Detail>
          <Detail label={t(bookingText.fields.time.label)}>{formatTime(booking.time, lang)}</Detail>
          <Detail label={t(bookingText.fields.phone.label)}>
            <a href={`tel:${booking.phone}`} dir="ltr" className="underline-offset-4 hover:text-gold-deep hover:underline">
              {booking.phone}
            </a>
          </Detail>
          <Detail label={t(admin.received)}>{booking.createdAt ? formatDateTime(booking.createdAt, lang) : '—'}</Detail>
        </dl>

        {booking.notes && (
          <p className="mt-5 rounded-field bg-sand px-4 py-3 text-sm break-words">
            <span className="font-medium">{t(bookingText.fields.notes.label)}: </span>
            {booking.notes}
          </p>
        )}

        {/* الأزرار المتاحة تتغير حسب حالة الحجز */}
        <div className="mt-5 flex flex-wrap gap-2">
          {booking.status === 'new' && (
            <Button disabled={busy} onClick={() => setStatus('confirmed')}>
              {t(admin.actions.confirm)}
            </Button>
          )}
          {booking.status === 'confirmed' && (
            <Button disabled={busy} onClick={() => setStatus('done')}>
              {t(admin.actions.done)}
            </Button>
          )}
          {(booking.status === 'new' || booking.status === 'confirmed') && (
            <Button variant="outline" disabled={busy} onClick={() => setStatus('cancelled')}>
              {t(admin.actions.cancel)}
            </Button>
          )}
          {(booking.status === 'done' || booking.status === 'cancelled') && (
            <Button variant="outline" disabled={busy} onClick={() => setStatus('new')}>
              {t(admin.actions.restore)}
            </Button>
          )}
          <LinkButton href={whatsappLink} target="_blank" rel="noopener noreferrer" variant="outline">
            <IconWhatsapp className="size-5" />
            {t(admin.actions.whatsapp)}
          </LinkButton>
        </div>
      </article>
    </m.li>
  )
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className="mt-0.5 font-medium">{children}</dd>
    </div>
  )
}
