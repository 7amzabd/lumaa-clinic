import { createContext } from 'react'

/** القيمة الخاصة بخيار «استشارة مجانية» في قائمة الخدمات */
export const CONSULTATION_ID = 'consultation'

export interface BookingContextValue {
  /** الخدمة المختارة حاليًا في نموذج الحجز ('' = لم تُختر) */
  serviceId: string
  setServiceId: (id: string) => void
  /** ينتقل إلى نموذج الحجز، ويختار الخدمة إذا أُرسل معرّفها */
  goToBooking: (serviceId?: string) => void
  /** يزيد كلما اختيرت خدمة من خارج النموذج، لتشغيل وميض خفيف حول حقل الخدمة */
  highlightKey: number
}

export const BookingContext = createContext<BookingContextValue | null>(null)
