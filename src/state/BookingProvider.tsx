import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { BookingContext } from './BookingContext'

/**
 * يشارك "الخدمة المختارة" بين بطاقات الخدمات ونموذج الحجز.
 * عند الضغط على «احجز» في أي بطاقة، تُختار الخدمة في النموذج تلقائيًا.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [serviceId, setServiceId] = useState('')
  const [highlightKey, setHighlightKey] = useState(0)

  const goToBooking = useCallback((id?: string) => {
    if (id) {
      setServiceId(id)
      setHighlightKey((key) => key + 1)
    }
    const section = document.getElementById('booking')
    if (!section) return
    section.scrollIntoView({ block: 'start' })
    // ننقل التركيز إلى عنوان النموذج (مفيد لقارئ الشاشة ولوحة المفاتيح)
    document.getElementById('booking-title')?.focus({ preventScroll: true })
  }, [])

  const value = useMemo(
    () => ({ serviceId, setServiceId, goToBooking, highlightKey }),
    [serviceId, goToBooking, highlightKey],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
