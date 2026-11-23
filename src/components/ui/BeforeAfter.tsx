import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { drawSkin } from '../../lib/drawSkin'
import { easeInOutSine, tween } from '../../lib/tween'
import { IconDrag } from './Icons'

/** يحصر القيمة بين 0 و 100 */
const clamp = (value: number) => Math.min(100, Math.max(0, value))

/**
 * شريط مقارنة «قبل وبعد» يعمل بالماوس واللمس ولوحة المفاتيح.
 * position = موضع الفاصل كنسبة مئوية من بداية السطر (يمين في العربي، يسار في الإنجليزي).
 * جهة البداية تعرض «قبل»، وجهة النهاية تعرض «بعد».
 */
export function BeforeAfter() {
  const { t, dir } = useLang()
  const { results } = site
  const [position, setPosition] = useState(50)
  const frameRef = useRef<HTMLDivElement>(null)
  const beforeRef = useRef<HTMLCanvasElement>(null)
  const afterRef = useRef<HTMLCanvasElement>(null)
  const dragging = useRef(false)
  const userInteracted = useRef(false)
  const inView = useInView(frameRef, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()

  // رسم الصورتين، وإعادة الرسم عند تغيّر حجم الشاشة
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const draw = () => {
      const { width, height } = frame.getBoundingClientRect()
      if (!width || !height) return
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2) // دقة عالية للشاشات الحديثة
      const canvases = [
        [beforeRef.current, 'before'],
        [afterRef.current, 'after'],
      ] as const
      for (const [canvas, variant] of canvases) {
        if (!canvas) continue
        canvas.width = Math.round(width * pixelRatio)
        canvas.height = Math.round(height * pixelRatio)
        drawSkin(canvas, variant)
      }
    }
    const observer = new ResizeObserver(draw)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  // حركة تلميح صغيرة عند أول ظهور، حتى يعرف الزائر أن الشريط قابل للسحب
  useEffect(() => {
    if (!inView || reduceMotion || userInteracted.current) return
    return tween([50, 36, 63, 50], {
      duration: 2.4,
      delay: 0.4,
      ease: easeInOutSine,
      onUpdate: (value) => {
        if (!userInteracted.current) setPosition(value)
      },
    })
  }, [inView, reduceMotion])

  // يحوّل موضع الماوس أو الإصبع إلى نسبة مئوية من بداية السطر
  const moveTo = (clientX: number) => {
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    const fromLeft = ((clientX - rect.left) / rect.width) * 100
    setPosition(clamp(dir === 'rtl' ? 100 - fromLeft : fromLeft))
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    userInteracted.current = true
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    // في اللمس ننتظر حركة الإصبع، حتى لا يقفز الفاصل عند التمرير العادي للصفحة
    if (event.pointerType !== 'touch') moveTo(event.clientX)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(event.clientX)
  }

  const stopDragging = () => {
    dragging.current = false
  }

  // لوحة المفاتيح: الأسهم تحرك الفاصل في الاتجاه الظاهر على الشاشة
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const step = event.shiftKey ? 10 : 2
    const forwardKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const backwardKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    let next: number | null = null
    if (event.key === forwardKey || event.key === 'ArrowUp') next = position + step
    else if (event.key === backwardKey || event.key === 'ArrowDown') next = position - step
    else if (event.key === 'PageUp') next = position + 10
    else if (event.key === 'PageDown') next = position - 10
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = 100
    if (next === null) return
    event.preventDefault()
    userInteracted.current = true
    setPosition(clamp(next))
  }

  // نقص صورة «بعد» حتى تظهر فقط في جهة النهاية من الفاصل
  const clipPath = dir === 'rtl' ? `inset(0 ${position}% 0 0)` : `inset(0 0 0 ${position}%)`
  const rounded = Math.round(position)
  const valueText = `${t(results.beforeLabel)} ${rounded}% · ${t(results.afterLabel)} ${100 - rounded}%`

  return (
    <figure>
      <div
        ref={frameRef}
        className="relative aspect-[4/5] cursor-ew-resize touch-pan-y overflow-hidden rounded-card shadow-float ring-1 ring-line select-none sm:aspect-[5/4]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        {/* الصورتان المرسومتان، مع وصف نصي لقارئ الشاشة */}
        <div role="img" aria-label={t(results.canvasAlt)} className="absolute inset-0">
          <canvas ref={beforeRef} className="absolute inset-0 size-full" />
          <canvas ref={afterRef} className="absolute inset-0 size-full" style={{ clipPath }} />
        </div>

        {/* شارتا «قبل» و«بعد» */}
        <span
          aria-hidden="true"
          className="absolute top-4 start-4 rounded-full bg-inverse/70 px-3 py-1 text-xs font-medium text-on-inverse backdrop-blur-sm"
        >
          {t(results.beforeLabel)}
        </span>
        <span
          aria-hidden="true"
          className="absolute top-4 end-4 rounded-full bg-inverse/70 px-3 py-1 text-xs font-medium text-on-inverse backdrop-blur-sm"
        >
          {t(results.afterLabel)}
        </span>

        {/* شريط التمرير الحقيقي: مخفي بصريًا، لكنه يعمل بلوحة المفاتيح وقارئ الشاشة */}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={rounded}
          aria-label={t(results.sliderLabel)}
          aria-valuetext={valueText}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            userInteracted.current = true
            setPosition(Number(event.target.value))
          }}
          className="peer sr-only"
        />

        {/* الخط الفاصل */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-surface/90 rtl:translate-x-1/2"
          style={{ insetInlineStart: `${position}%` }}
        />
        {/* المقبض: يظهر حوله إطار عند التركيز بلوحة المفاتيح */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-xl text-ink shadow-float backdrop-blur-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus rtl:translate-x-1/2"
          style={{ insetInlineStart: `${position}%` }}
        >
          <IconDrag />
        </div>
      </div>

      <figcaption className="mt-4 text-center text-sm text-ink-soft">{t(results.caption)}</figcaption>
    </figure>
  )
}
