import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { formatNumber } from '../../lib/format'
import { easeOutQuint, tween } from '../../lib/tween'

interface CountUpProps {
  value: number
  decimals?: number
}

/**
 * رقم يعدّ من الصفر إلى قيمته عندما يظهر على الشاشة.
 * قارئ الشاشة يقرأ الرقم النهائي مباشرة (النص المخفي sr-only).
 */
export function CountUp({ value, decimals = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduceMotion = useReducedMotion()
  const finalText = formatNumber(value, decimals)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduceMotion) {
      node.textContent = finalText
      return
    }
    if (!inView) return
    // نحدّث النص مباشرة بدل state، فلا يُعاد رسم المكوّن في كل إطار
    return tween([0, value], {
      duration: 1.8,
      ease: easeOutQuint,
      onUpdate: (latest) => {
        node.textContent = formatNumber(latest, decimals)
      },
    })
  }, [inView, reduceMotion, value, decimals, finalText])

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {reduceMotion ? finalText : formatNumber(0, decimals)}
      </span>
      <span className="sr-only">{finalText}</span>
    </>
  )
}
