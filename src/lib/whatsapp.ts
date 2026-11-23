import { site } from '../content/site'
import type { Lang } from '../content/types'
import { CONSULTATION_ID } from '../state/BookingContext'
import { formatDate, formatTime } from './format'
import { normalizePhone, type BookingValues } from './validation'

/**
 * يبني رابط واتساب للرقم المكتوب في site.ts
 * ويضيف نص الرسالة الجاهزة إذا أُرسل.
 */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.brand.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** اسم الخدمة من معرّفها (أو «استشارة مجانية») باللغة المطلوبة */
export function getServiceName(serviceId: string, lang: Lang) {
  if (serviceId === CONSULTATION_ID) return site.booking.consultationOption[lang]
  return site.services.items.find((service) => service.id === serviceId)?.name[lang] ?? serviceId
}

/** يكتب رسالة الحجز الجاهزة: سطر لكل معلومة */
export function buildBookingMessage(values: BookingValues, lang: Lang) {
  const labels = site.booking.whatsappMessage
  const lines = [
    labels.intro[lang],
    '',
    `${labels.name[lang]}: ${values.name.trim()}`,
    `${labels.phone[lang]}: ${normalizePhone(values.phone)}`,
    `${labels.service[lang]}: ${getServiceName(values.service, lang)}`,
    `${labels.date[lang]}: ${formatDate(values.date, lang)}`,
    `${labels.time[lang]}: ${formatTime(values.time, lang)}`,
  ]
  const notes = values.notes.trim()
  if (notes) lines.push(`${labels.notes[lang]}: ${notes}`)
  return lines.join('\n')
}
