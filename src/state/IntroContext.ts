import { createContext, useContext } from 'react'

/**
 * هل انتهت شاشة التحميل القصيرة؟
 * الصفحة الرئيسية تنتظر هذه القيمة قبل أن تبدأ حركاتها، حتى لا تحدث خلف الشاشة.
 */
export const IntroContext = createContext(true)

export function useIntroDone() {
  return useContext(IntroContext)
}
