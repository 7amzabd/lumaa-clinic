import { useState, type ChangeEvent, type FormEvent } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { describedBy, inputClass } from '../../lib/form'
import { formatPrice, formatTime, todayIso } from '../../lib/format'
import { isTimePast, validateBooking, type BookingValues } from '../../lib/validation'
import { buildBookingMessage, whatsappUrl } from '../../lib/whatsapp'
import { CONSULTATION_ID } from '../../state/BookingContext'
import { useBooking } from '../../state/useBooking'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { IconChevronDown, IconWhatsapp } from '../ui/Icons'
import { Calendar } from './Calendar'

// ترتيب الحقول: لنقل التركيز إلى أول حقل فيه خطأ
const FIELD_ORDER = ['name', 'phone', 'service', 'date', 'time'] as const

type TextFields = Omit<BookingValues, 'service'>

interface BookingFormProps {
  onSubmitted: (values: BookingValues, whatsappLink: string) => void
}

/**
 * نموذج الحجز: يتحقق من الحقول، ثم يفتح واتساب برسالة جاهزة فيها كل التفاصيل.
 * الخدمة محفوظة في BookingProvider، لأن بطاقات الخدمات تختارها من خارج النموذج.
 */
export function BookingForm({ onSubmitted }: BookingFormProps) {
  const { t, lang } = useLang()
  const { serviceId, setServiceId, highlightKey } = useBooking()
  const { booking, services } = site
  const { fields: labels } = booking

  const [fields, setFields] = useState<TextFields>({ name: '', phone: '', date: '', time: '', notes: '' })
  // نُظهر الأخطاء فقط بعد أول محاولة إرسال، ثم تتحدث مباشرة أثناء الكتابة
  const [attempted, setAttempted] = useState(false)

  const today = todayIso()
  const values: BookingValues = { ...fields, service: serviceId }
  const errors = attempted ? validateBooking(values) : {}
  const hasErrors = Object.keys(errors).length > 0

  /** نص رسالة الخطأ لحقل معيّن (أو undefined إذا لا يوجد خطأ) */
  const errorFor = (key: keyof BookingValues) => {
    const code = errors[key]
    return code ? t(booking.errors[code]) : undefined
  }

  const update =
    (key: keyof TextFields) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((previous) => ({ ...previous, [key]: event.target.value }))

  const focusField = (key: (typeof FIELD_ORDER)[number]) => {
    if (key === 'time') {
      document.querySelector<HTMLInputElement>('input[name="booking-time"]:not(:disabled)')?.focus()
    } else if (key === 'date') {
      document.querySelector<HTMLButtonElement>('#booking-date [tabindex="0"]')?.focus()
    } else {
      document.getElementById(`booking-${key}`)?.focus()
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAttempted(true)

    const found = validateBooking(values)
    const firstInvalid = FIELD_ORDER.find((key) => found[key])
    if (firstInvalid) {
      focusField(firstInvalid)
      return
    }

    // كل شيء صحيح: نفتح واتساب برسالة جاهزة، ثم نعرض رسالة التأكيد
    const link = whatsappUrl(buildBookingMessage(values, lang))
    window.open(link, '_blank', 'noopener,noreferrer')
    onSubmitted(values, link)
  }

  const nameError = errorFor('name')
  const phoneError = errorFor('phone')
  const serviceError = errorFor('service')
  const dateError = errorFor('date')
  const timeError = errorFor('time')
  const phoneHint = labels.phone.hint && t(labels.phone.hint)
  const dateHint = labels.date.hint && t(labels.date.hint)

  return (
    <form noValidate onSubmit={handleSubmit} className="mt-10 grid gap-x-5 gap-y-6 sm:grid-cols-2">
      {/* الاسم */}
      <FormField id="booking-name" label={t(labels.name.label)} error={nameError}>
        <input
          id="booking-name"
          type="text"
          autoComplete="name"
          value={fields.name}
          onChange={update('name')}
          placeholder={labels.name.placeholder && t(labels.name.placeholder)}
          aria-invalid={nameError ? true : undefined}
          aria-describedby={describedBy('booking-name', nameError)}
          className={`${inputClass} h-13`}
        />
      </FormField>

      {/* رقم الجوال: اتجاهه من اليسار لليمين دائمًا لأنه أرقام */}
      <FormField id="booking-phone" label={t(labels.phone.label)} error={phoneError} hint={phoneHint}>
        <input
          id="booking-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          value={fields.phone}
          onChange={update('phone')}
          placeholder={labels.phone.placeholder && t(labels.phone.placeholder)}
          aria-invalid={phoneError ? true : undefined}
          aria-describedby={describedBy('booking-phone', phoneError, phoneHint)}
          className={`${inputClass} h-13 rtl:text-right`}
        />
      </FormField>

      {/* الخدمة: key يعيد تشغيل الوميض الذهبي كلما اختيرت خدمة من بطاقة */}
      <FormField id="booking-service" label={t(labels.service.label)} error={serviceError} className="sm:col-span-2">
        <div
          key={highlightKey}
          className={`relative rounded-field ${highlightKey > 0 ? 'motion-safe:animate-ring-pulse' : ''}`}
        >
          <select
            id="booking-service"
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
            aria-invalid={serviceError ? true : undefined}
            aria-describedby={describedBy('booking-service', serviceError)}
            className={`${inputClass} h-13 cursor-pointer appearance-none pe-11`}
          >
            <option value="" disabled>
              {labels.service.placeholder && t(labels.service.placeholder)}
            </option>
            <option value={CONSULTATION_ID}>{t(booking.consultationOption)}</option>
            {services.items.map((service) => (
              <option key={service.id} value={service.id}>
                {t(service.name)} · {formatPrice(service.priceFrom, lang)}
              </option>
            ))}
          </select>
          <IconChevronDown className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
        </div>
      </FormField>

      {/* التاريخ: تقويم مرسوم، الأيام الماضية وأيام الإغلاق معطّلة فيه */}
      <div className="sm:col-span-2">
        <p id="booking-date-label" className="text-sm font-medium">
          {t(labels.date.label)}
        </p>
        <div className="mt-2">
          <Calendar
            id="booking-date"
            value={fields.date}
            onChange={(iso) => setFields((previous) => ({ ...previous, date: iso }))}
            invalid={Boolean(dateError)}
            describedBy={describedBy('booking-date', dateError, dateHint)}
          />
        </div>
        {dateError ? (
          <p id="booking-date-error" className="mt-2 text-sm text-danger">
            {dateError}
          </p>
        ) : (
          dateHint && (
            <p id="booking-date-hint" className="mt-2 text-xs text-ink-soft">
              {dateHint}
            </p>
          )
        )}
      </div>

      {/* الوقت: أزرار اختيار (radio) تعمل بالأسهم في لوحة المفاتيح */}
      <fieldset className="sm:col-span-2" aria-describedby={timeError ? 'booking-time-error' : undefined}>
        <legend className="text-sm font-medium">{t(labels.time.label)}</legend>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {booking.timeSlots.map((slot) => {
            const past = fields.date === today && isTimePast(slot)
            return (
              <label key={slot} className="relative">
                <input
                  type="radio"
                  name="booking-time"
                  value={slot}
                  checked={fields.time === slot}
                  disabled={past}
                  onChange={update('time')}
                  className="peer sr-only"
                />
                <span className="flex h-12 cursor-pointer items-center justify-center rounded-field border border-line bg-surface text-sm transition-colors duration-300 hover:border-gold peer-checked:border-primary peer-checked:bg-primary peer-checked:text-on-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus peer-disabled:cursor-not-allowed peer-disabled:opacity-40 peer-disabled:line-through">
                  {formatTime(slot, lang)}
                </span>
              </label>
            )
          })}
        </div>
        {timeError && (
          <p id="booking-time-error" className="mt-2 text-sm text-danger">
            {timeError}
          </p>
        )}
      </fieldset>

      {/* ملاحظات اختيارية */}
      <FormField id="booking-notes" label={t(labels.notes.label)} optional={t(booking.optional)} className="sm:col-span-2">
        <textarea
          id="booking-notes"
          rows={3}
          maxLength={300}
          value={fields.notes}
          onChange={update('notes')}
          placeholder={labels.notes.placeholder && t(labels.notes.placeholder)}
          className={`${inputClass} min-h-28 resize-y py-3`}
        />
      </FormField>

      <div className="sm:col-span-2">
        {attempted && hasErrors && (
          <p role="alert" className="mb-4 rounded-field border border-danger/30 px-4 py-3 text-sm text-danger">
            {t(booking.errorSummary)}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <IconWhatsapp className="size-5" />
          {t(booking.submit)}
        </Button>
      </div>
    </form>
  )
}
