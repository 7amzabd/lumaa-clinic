import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { formatDate, formatPrice, formatTime } from '../../lib/format'
import { CONSULTATION_ID } from '../../state/BookingContext'
import { useBooking } from '../../state/useBooking'
import { IconCalendar, IconClock, IconSparkle } from '../ui/Icons'
import { Photo } from '../ui/Photo'
import type { BookingDraft } from './BookingForm'

/**
 * بطاقة «ملخص حجزك» بجانب النموذج: تتحدث مباشرة مع كل اختيار
 * (الخدمة بصورتها وسعرها، ثم التاريخ والوقت)، فيطمئن الزائر قبل الإرسال.
 */
export function BookingSummary({ draft }: { draft: BookingDraft }) {
  const { t, lang } = useLang()
  const { serviceId } = useBooking()
  const { booking, services } = site
  const service = services.items.find((item) => item.id === serviceId)
  const isConsultation = serviceId === CONSULTATION_ID
  const isEmpty = !serviceId && !draft.date && !draft.time
  const notChosen = <span className="text-ink-soft">{t(booking.summary.notChosen)}</span>

  return (
    <section aria-labelledby="booking-summary-title" className="rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:p-7">
      <h3 id="booking-summary-title" className="text-sm font-medium text-gold-deep">
        {t(booking.summary.title)}
      </h3>

      {isEmpty ? (
        <p className="mt-3 text-sm text-ink-soft">{t(booking.summary.empty)}</p>
      ) : (
        <>
          {/* الخدمة: صورة مصغرة + الاسم + السعر */}
          <div className="mt-4 flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-sand text-gold-deep">
              {service ? (
                <Photo src={service.image} alt="" className="size-full object-cover" />
              ) : (
                <IconSparkle className="size-5" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium">
                {service ? t(service.name) : isConsultation ? t(booking.consultationOption) : notChosen}
              </p>
              {service && (
                <p className="mt-0.5 text-sm text-ink-soft">
                  {t(services.priceFromLabel)} {formatPrice(service.priceFrom, lang)}
                </p>
              )}
            </div>
          </div>

          {/* التاريخ والوقت */}
          <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-ink-soft">
                <IconCalendar className="size-4 text-gold-deep" />
                {t(booking.fields.date.label)}
              </dt>
              <dd className="text-end font-medium">{draft.date ? formatDate(draft.date, lang) : notChosen}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-ink-soft">
                <IconClock className="size-4 text-gold-deep" />
                {t(booking.fields.time.label)}
              </dt>
              <dd className="text-end font-medium">{draft.time ? formatTime(draft.time, lang) : notChosen}</dd>
            </div>
          </dl>
        </>
      )}
    </section>
  )
}
