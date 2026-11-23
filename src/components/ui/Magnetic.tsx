import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'

/**
 * يجعل العنصر "مغناطيسيًا": ينجذب قليلًا نحو الماوس وهو فوقه ثم يعود.
 * يعمل فقط على الأجهزة التي فيها ماوس، ويتعطل مع إعداد تقليل الحركة.
 */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * strength)
    y.set((event.clientY - rect.top - rect.height / 2) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div className="inline-block" style={{ x: springX, y: springY }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </m.div>
  )
}
