import { m, useAnimationFrame, useMotionValue, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { useLang } from '../../i18n/useLang'

interface MarqueeProps {
  items: ReactNode[]
  /** اسم المنطقة لقارئ الشاشة */
  label: string
  /** السرعة بالبكسل في الثانية */
  speed?: number
}

/** يلف القيمة داخل المدى [min, max) حتى يبدو الشريط لا نهائيًا */
function wrap(min: number, max: number, value: number) {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

/**
 * شريط يتحرك باستمرار، يتوقف عند تمرير الماوس أو اللمس،
 * ويمكن سحبه بالإصبع والماوس. نكرر العناصر 3 مرات حتى لا يظهر فراغ.
 * مع تقليل الحركة يصبح قائمة عادية تُمرَّر أفقيًا.
 */
export function Marquee({ items, label, speed = 40 }: MarqueeProps) {
  const { dir } = useLang()
  const reduceMotion = useReducedMotion()
  const setRef = useRef<HTMLDivElement>(null)
  const [setWidth, setSetWidth] = useState(0)
  const x = useMotionValue(0)
  const paused = useRef(false)
  const dragging = useRef(false)
  const lastX = useRef(0)

  // عرض نسخة واحدة من العناصر (مع الفراغات)، ونقيسه من جديد عند تغيّر الحجم
  useLayoutEffect(() => {
    const element = setRef.current
    if (!element) return
    const measure = () => setSetWidth(element.getBoundingClientRect().width)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // في rtl يتحرك الشريط نحو اليمين (قيم موجبة)
  const sign = dir === 'rtl' ? 1 : -1

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !setWidth || paused.current || dragging.current) return
    const next = x.get() + sign * speed * (delta / 1000)
    x.set(dir === 'rtl' ? wrap(0, setWidth, next) : wrap(-setWidth, 0, next))
  })

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    lastX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const dx = event.clientX - lastX.current
    lastX.current = event.clientX
    const next = x.get() + dx
    x.set(dir === 'rtl' ? wrap(0, setWidth, next) : wrap(-setWidth, 0, next))
  }

  const stop = () => {
    dragging.current = false
  }

  if (reduceMotion) {
    return (
      // قابل للتركيز حتى يمكن تمريره بلوحة المفاتيح
      <div tabIndex={0} role="region" aria-label={label} className="flex gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:thin]">
        {items.map((item, index) => (
          <div key={index} className="w-[20rem] shrink-0 sm:w-[24rem]">
            {item}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => {
        paused.current = false
        stop()
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
    >
      <m.div className="flex w-max" style={{ x }}>
        {[0, 1, 2].map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? setRef : undefined}
            className="flex gap-5 pe-5"
            // النسختان المكررتان للشكل فقط، فلا يقرؤهما قارئ الشاشة
            aria-hidden={copy > 0 ? true : undefined}
          >
            {items.map((item, index) => (
              <div key={index} className="w-[20rem] shrink-0 sm:w-[24rem]">
                {item}
              </div>
            ))}
          </div>
        ))}
      </m.div>
    </div>
  )
}
