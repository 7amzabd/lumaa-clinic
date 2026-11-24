import type { BookingPeriod, BookingStatus } from '../content/types'
import type { BookingRecord } from '../firebase/admin'
import { toEnglishDigits } from '../lib/validation'

/** اختيارات التصفية في أعلى قائمة الحجوزات */
export interface BookingFilters {
  status: BookingStatus | 'all'
  /** معرّف الخدمة، أو '' لكل الخدمات */
  service: string
  period: BookingPeriod
  search: string
}

export const DEFAULT_FILTERS: BookingFilters = { status: 'all', service: '', period: 'upcoming', search: '' }

/** يطبّق كل التصفيات ما عدا الحالة (نحتاجه لحساب عدد كل حالة على أزرارها) */
export function filterExceptStatus(bookings: BookingRecord[], filters: BookingFilters, today: string) {
  const search = toEnglishDigits(filters.search).trim().toLowerCase()

  return bookings.filter((booking) => {
    if (filters.service && booking.service !== filters.service) return false
    // مقارنة نصية تصلح لصيغة YYYY-MM-DD
    if (filters.period === 'upcoming' && booking.date < today) return false
    if (filters.period === 'today' && booking.date !== today) return false
    if (filters.period === 'past' && booking.date >= today) return false
    if (search && !booking.name.toLowerCase().includes(search) && !booking.phone.includes(search)) return false
    return true
  })
}

/** يرتّب القائمة: القادمة من الأقرب، السابقة من الأحدث، و«كل التواريخ» حسب وقت الاستلام */
export function sortBookings(bookings: BookingRecord[], period: BookingPeriod) {
  if (period === 'all') return bookings // تصل من Firestore مرتبة: الأحدث استلامًا أولًا
  const direction = period === 'past' ? -1 : 1
  return [...bookings].sort(
    (a, b) => direction * `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
  )
}

/** 0512345678 ← 966512345678 (الصيغة الدولية التي يحتاجها رابط واتساب) */
export function toWhatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `966${digits.slice(1)}` : digits
}
