import { site } from '../content/site'
import type { BookingErrorKey } from '../content/types'
import { parseLocalDate, todayIso } from './format'

/** قيم نموذج الحجز */
export interface BookingValues {
  name: string
  phone: string
  service: string
  date: string
  time: string
  notes: string
}

/** لكل حقل فيه خطأ: اسم رسالة الخطأ (والنص نفسه في site.ts) */
export type BookingErrors = Partial<Record<keyof BookingValues, BookingErrorKey>>

/**
 * رقم جوال سعودي: 05xxxxxxxx أو ‎+9665xxxxxxxx أو 9665xxxxxxxx
 * لعيادة في بلد آخر غيّر هذا النمط (ونص الخطأ phoneInvalid في site.ts).
 */
export const PHONE_PATTERN = /^(?:\+?966|0)5\d{8}$/

/** يحوّل الأرقام العربية (٠١٢) إلى إنجليزية (012)، لأن كثيرًا من الزوار يكتبون بها */
export function toEnglishDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
}

/** يزيل المسافات والشرطات من رقم الجوال */
export function normalizePhone(value: string) {
  return toEnglishDigits(value).replace(/[\s()-]/g, '')
}

/** هل مضى هذا الوقت ("16:00") اليوم؟ */
export function isTimePast(time: string, now = new Date()) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes <= now.getHours() * 60 + now.getMinutes()
}

/** يتحقق من كل الحقول ويرجع الأخطاء (كائن فارغ = لا أخطاء) */
export function validateBooking(values: BookingValues): BookingErrors {
  const errors: BookingErrors = {}
  const today = todayIso()

  const name = values.name.trim()
  if (!name) errors.name = 'nameRequired'
  else if (name.length < 2) errors.name = 'nameShort'

  const phone = normalizePhone(values.phone)
  if (!phone) errors.phone = 'phoneRequired'
  else if (!PHONE_PATTERN.test(phone)) errors.phone = 'phoneInvalid'

  if (!values.service) errors.service = 'serviceRequired'

  if (!values.date) errors.date = 'dateRequired'
  else if (values.date < today) errors.date = 'datePast' // مقارنة نصية تصلح لصيغة YYYY-MM-DD
  else if (site.booking.closedDays.includes(parseLocalDate(values.date).getDay())) errors.date = 'dateClosed'

  if (!values.time) errors.time = 'timeRequired'
  else if (values.date === today && isTimePast(values.time)) errors.time = 'timePast'

  return errors
}
