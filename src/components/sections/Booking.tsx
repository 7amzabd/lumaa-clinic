import { AnimatePresence, m } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import type { BookingValues } from '../../lib/validation'
import { whatsappUrl } from '../../lib/whatsapp'
import { useBooking } from '../../state/useBooking'
import { BookingForm, type BookingDraft } from '../booking/BookingForm'
import { BookingSuccess } from '../booking/BookingSuccess'
import { BookingSummary } from '../booking/BookingSummary'
import { IconClock, IconMapPin, IconSparkle, IconWhatsapp } from '../ui/Icons'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

interface Submission {
  values: BookingValues
  whatsappLink: string
}

/** قسم الحجز: النموذج (أو رسالة التأكيد) + بطاقة ساعات العمل والعنوان */
export function Booking() {
  const { t } = useLang()
  const { setServiceId } = useBooking()
  const [submission, setSubmission] = useState<Submission | null>(null)
  // الموعد المختار حتى الآن (يرسله النموذج)، لبطاقة «ملخص حجزك»
  const [draft, setDraft] = useState<BookingDraft>({ date: '', time: '' })
  const { booking, brand } = site

  const reset = () => {
    setSubmission(null)
    setServiceId('')
  }

  return (
    <section id="booking" aria-labelledby="booking-title" className="py-20 sm:py-28">
      <div className="container-page grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:gap-8">
        <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:p-10">
          <SectionHeading id="booking-title" content={booking} focusableTitle />

          {/* التبديل بين النموذج ورسالة التأكيد بحركة تلاشٍ ناعمة */}
          <AnimatePresence mode="wait" initial={false}>
            {submission ? (
              <m.div key="success" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <BookingSuccess values={submission.values} whatsappLink={submission.whatsappLink} onReset={reset} />
              </m.div>
            ) : (
              <m.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <BookingForm
                  onDraftChange={setDraft}
                  onSubmitted={(values, whatsappLink) => setSubmission({ values, whatsappLink })}
                />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* بجانب النموذج: ملخص الحجز الحي، ثم معلومات العيادة. يبقى ظاهرًا أثناء التمرير على الشاشات الكبيرة */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          {!submission && <BookingSummary draft={draft} />}

          <Reveal delay={0.1} className="rounded-[2rem] bg-inverse p-7 text-on-inverse sm:p-8">
            <InfoRow icon={<IconClock />} label={t(booking.info.hoursLabel)}>
              <p>{t(booking.info.days)}</p>
              <p>{t(booking.info.hours)}</p>
              <p className="mt-1 text-sm text-on-inverse-soft">{t(booking.info.closed)}</p>
            </InfoRow>
            <hr className="my-6 border-on-inverse/10" />
            <InfoRow icon={<IconMapPin />} label={t(booking.info.addressLabel)}>
              <p>{t(booking.info.address)}</p>
            </InfoRow>
            <hr className="my-6 border-on-inverse/10" />
            <InfoRow icon={<IconWhatsapp />} label={t(booking.info.whatsappLabel)}>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                {brand.phoneDisplay}
              </a>
            </InfoRow>
          </Reveal>

          <Reveal delay={0.2} className="flex gap-3 rounded-card border border-gold/40 p-6">
            <IconSparkle className="mt-1.5 size-3.5 shrink-0 text-gold" />
            <p className="text-sm">{t(booking.info.note)}</p>
          </Reveal>
        </aside>
      </div>
    </section>
  )
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-on-inverse/15 text-lg text-gold">
        {icon}
      </span>
      <div>
        <h3 className="text-sm text-on-inverse-soft">{label}</h3>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  )
}
