import { useEffect, useState } from 'react'

/**
 * يرجع true عندما يظهر العنصر (بالمعرّف id) على الشاشة.
 * نستخدمه لإخفاء شريط الحجز السفلي عندما يكون نموذج الحجز ظاهرًا.
 */
export function useElementVisible(id: string, rootMargin = '0px 0px -25% 0px') {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = document.getElementById(id)
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin,
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [id, rootMargin])

  return visible
}
