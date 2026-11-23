import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** أقصى زاوية ميل بالدرجات */
  max?: number
}

/**
 * بطاقة تميل ثلاثي الأبعاد نحو الماوس، مع بقعة ضوء ذهبية تتبعه.
 * على اللمس وعند تقليل الحركة تبقى ثابتة.
 */
export function TiltCard({ children, className = '', max = 7 }: TiltCardProps) {
  const reduceMotion = useReducedMotion()
  // موضع الماوس داخل البطاقة كنسبة من 0 إلى 1
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 20 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 20 })
  const glowOpacity = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 })
  const glowX = useTransform(px, (value) => `${value * 100}%`)
  const glowY = useTransform(py, (value) => `${value * 100}%`)
  const glow = useMotionTemplate`radial-gradient(22rem circle at ${glowX} ${glowY}, color-mix(in srgb, var(--color-gold) 22%, transparent), transparent 60%)`

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width)
    py.set((event.clientY - rect.top) / rect.height)
    glowOpacity.set(1)
  }

  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    glowOpacity.set(0)
  }

  return (
    <div className="h-full" style={{ perspective: 1000 }}>
      <m.div
        className={`relative h-full ${className}`}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {children}
        {/* بقعة الضوء: فوق البطاقة ولا تلتقط الماوس */}
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-card"
          style={{ backgroundImage: glow, opacity: glowOpacity }}
        />
      </m.div>
    </div>
  )
}
