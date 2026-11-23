import { m, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { DEFAULT_FACE, drawSkinOverlay, type SkinMode } from '../../lib/skinEffects'
import { useIntroDone } from '../../state/IntroContext'
import { IconClock, IconLeaf, IconSparkle } from './Icons'

const ease = [0.22, 1, 0.36, 1] as const
const ZOOM = 2.4 // قوة تكبير العدسة
const LENS_MAX = 150 // قطر العدسة بالبكسل على الشاشات الكبيرة
const MODES: SkinMode[] = ['before', 'after']
/** الصورة في مجلد public (مولّدة بالذكاء الاصطناعي عبر Canva، لا تعود لشخص حقيقي) */
const FACE_WEBP = '/face.webp'
const FACE_JPG = '/face.jpg'

/**
 * العنصر البصري في الصفحة الرئيسية: صورة وجه حقيقي، وفوقها طبقة مرسومة بـ canvas
 * تتبدل بزر «قبل / بعد» (قبل = رؤوس سوداء ونتوءات واحمرار، بعد = صفاء ولمعان)،
 * وعدسة تكبير تتبع الماوس (أو تتجول وحدها على اللمس).
 * لاستبدال الصورة: ضع صورة 3:4 في public وعدّل DEFAULT_FACE في lib/skinEffects.ts
 */
export function SkinPanel() {
  const { t } = useLang()
  const reduceMotion = useReducedMotion()
  const introDone = useIntroDone()
  const [firstCard, secondCard] = site.hero.floatingCards
  const [mode, setMode] = useState<SkinMode>('before')
  const panelRef = useRef<HTMLDivElement>(null)
  const baseRefs = useRef<Record<SkinMode, HTMLCanvasElement | null>>({ before: null, after: null })
  const zoomRefs = useRef<Record<SkinMode, HTMLCanvasElement | null>>({ before: null, after: null })
  const [size, setSize] = useState({ width: 0, height: 0 })
  const hovering = useRef(false)

  const lensSize = useMotionValue(LENS_MAX)
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const lensX = useSpring(targetX, { stiffness: 120, damping: 20, mass: 0.6 })
  const lensY = useSpring(targetY, { stiffness: 120, damping: 20, mass: 0.6 })
  const lensLeft = useTransform([lensX, lensSize], ([x, l]) => (x as number) - (l as number) / 2)
  const lensTop = useTransform([lensY, lensSize], ([y, l]) => (y as number) - (l as number) / 2)
  // الصورة المكبّرة داخل العدسة تتحرك عكس العدسة حتى تُظهر المكان نفسه مكبّرًا
  const zoomLeft = useTransform([lensX, lensSize], ([x, l]) => (l as number) / 2 - (x as number) * ZOOM)
  const zoomTop = useTransform([lensY, lensSize], ([y, l]) => (l as number) / 2 - (y as number) * ZOOM)

  // رسم طبقتي «قبل» و«بعد» بدقة عالية مرة واحدة، ثم نسخهما إلى اللوحة والعدسة
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const draw = () => {
      const rect = panel.getBoundingClientRect()
      if (!rect.width) return
      setSize({ width: rect.width, height: rect.height })
      lensSize.set(Math.min(LENS_MAX, Math.max(96, rect.width * 0.38)))
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const zoomRatio = Math.min(pixelRatio, 1.5)
      for (const current of MODES) {
        // الطبقة الأصلية بدقة العدسة (الأكبر)
        const source = document.createElement('canvas')
        source.width = Math.round(rect.width * ZOOM * zoomRatio)
        source.height = Math.round(rect.height * ZOOM * zoomRatio)
        drawSkinOverlay(source, current, DEFAULT_FACE)

        const base = baseRefs.current[current]
        if (base) {
          base.width = Math.round(rect.width * pixelRatio)
          base.height = Math.round(rect.height * pixelRatio)
          base.getContext('2d')?.drawImage(source, 0, 0, base.width, base.height)
        }
        const zoom = zoomRefs.current[current]
        if (zoom) {
          zoom.width = source.width
          zoom.height = source.height
          zoom.getContext('2d')?.drawImage(source, 0, 0)
        }
      }
      if (!hovering.current) {
        targetX.set(rect.width * 0.5)
        targetY.set(rect.height * 0.5)
      }
    }
    const observer = new ResizeObserver(draw)
    observer.observe(panel)
    return () => observer.disconnect()
  }, [targetX, targetY, lensSize])

  // عندما لا يوجد ماوس فوق اللوحة، تتجول العدسة وحدها فوق الخدين والأنف
  useAnimationFrame((time) => {
    if (reduceMotion || hovering.current || !size.width || !introDone) return
    const t = time / 1000
    targetX.set(size.width * (DEFAULT_FACE.cx + 0.15 * Math.sin(t * 0.35)))
    targetY.set(size.height * (DEFAULT_FACE.cy + 0.05 + 0.1 * Math.sin(t * 0.52 + 1.3)))
  })

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || reduceMotion) return
    hovering.current = true
    const rect = event.currentTarget.getBoundingClientRect()
    targetX.set(event.clientX - rect.left)
    targetY.set(event.clientY - rect.top)
  }

  const onPointerLeave = () => {
    hovering.current = false
  }

  const zoomStyle = { width: size.width * ZOOM, height: size.height * ZOOM, left: zoomLeft, top: zoomTop }

  return (
    <div className="relative mx-auto w-full max-w-[24rem] sm:max-w-[27rem]">
      {/* توهج ناعم خلف اللوحة */}
      <div aria-hidden="true" className="absolute inset-[6%] rounded-[3rem] bg-blush/70 blur-3xl" />

      <m.div
        ref={panelRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative aspect-[3/4] cursor-crosshair overflow-hidden rounded-[2.5rem] bg-sand shadow-float ring-1 ring-line/60"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={introDone ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1.3, ease, delay: 0.2 }}
      >
        {/* الصورة */}
        <picture>
          <source srcSet={FACE_WEBP} type="image/webp" />
          <img src={FACE_JPG} alt={t(site.hero.panelAlt)} width={900} height={1200} className="absolute inset-0 size-full object-cover" />
        </picture>

        {/* طبقتا «قبل» و«بعد» فوق الصورة، والظاهرة منهما حسب الزر */}
        {MODES.map((current) => (
          <canvas
            key={current}
            aria-hidden="true"
            ref={(node) => {
              baseRefs.current[current] = node
            }}
            className="absolute inset-0 size-full transition-opacity duration-700 ease-lux"
            style={{ opacity: mode === current ? 1 : 0 }}
          />
        ))}

        {/* خط المسح الذهبي */}
        {!reduceMotion && (
          <m.div
            aria-hidden="true"
            className="absolute inset-x-0 h-24 bg-linear-to-b from-transparent via-gold/20 to-gold/60"
            initial={{ top: '-30%' }}
            animate={introDone ? { top: ['-30%', '110%'] } : {}}
            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut', delay: 1.5 }}
          >
            <div className="absolute inset-x-0 bottom-0 h-px bg-shine shadow-[0_0_14px_2px_color-mix(in_srgb,var(--color-gold)_70%,transparent)]" />
          </m.div>
        )}

        {/* زوايا منظار التحليل */}
        {['top-5 start-5 border-t border-s', 'top-5 end-5 border-t border-e', 'bottom-5 start-5 border-b border-s', 'bottom-5 end-5 border-b border-e'].map(
          (corner) => (
            <span key={corner} aria-hidden="true" className={`absolute size-5 rounded-[3px] border-white/80 ${corner}`} />
          ),
        )}

        {/* الشارة الصغيرة */}
        <m.span
          aria-hidden="true"
          className="absolute top-5 start-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#2f221c]/65 px-3 py-1.5 text-xs font-medium text-[#f8eee6] backdrop-blur-sm rtl:translate-x-1/2"
          initial={{ opacity: 0, y: -6 }}
          animate={introDone ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/70 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-gold" />
          </span>
          {t(site.hero.panelLabel)}
        </m.span>

        {/* العدسة المكبّرة: نسخة مكبّرة من الصورة والطبقة فوقها */}
        <m.div
          aria-hidden="true"
          className="absolute overflow-hidden rounded-full shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45),inset_0_0_0_2px_rgb(255_255_255/0.8),inset_0_0_0_4px_color-mix(in_srgb,var(--color-gold)_60%,transparent)]"
          style={{ width: lensSize, height: lensSize, left: lensLeft, top: lensTop }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={introDone ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8, ease }}
        >
          <m.picture className="absolute" style={zoomStyle}>
            <source srcSet={FACE_WEBP} type="image/webp" />
            <img src={FACE_JPG} alt="" className="size-full object-cover" />
          </m.picture>
          {MODES.map((current) => (
            <m.canvas
              key={current}
              ref={(node) => {
                zoomRefs.current[current] = node
              }}
              className="absolute transition-opacity duration-700 ease-lux"
              style={{ ...zoomStyle, opacity: mode === current ? 1 : 0 }}
            />
          ))}
          {/* انحناء الزجاج: ضوء أعلى وظل أسفل */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_26%,rgb(255_255_255/0.4),transparent_38%),radial-gradient(circle_at_50%_50%,transparent_62%,rgb(60_30_20/0.35))]" />
          <div className="absolute inset-x-5 top-1/2 h-px bg-white/40" />
          <div className="absolute inset-y-5 left-1/2 w-px bg-white/40" />
        </m.div>
      </m.div>

      {/* زر قبل / بعد */}
      <m.div
        className="relative z-10 mx-auto -mt-6 flex w-fit rounded-full border border-line bg-surface/90 p-1 shadow-float backdrop-blur-md"
        role="group"
        aria-label={`${t(site.results.beforeLabel)} / ${t(site.results.afterLabel)}`}
        initial={{ opacity: 0, y: 10 }}
        animate={introDone ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.3, duration: 0.7, ease }}
      >
        {MODES.map((current) => (
          <button
            key={current}
            type="button"
            aria-pressed={mode === current}
            onClick={() => setMode(current)}
            className={`relative h-10 rounded-full px-6 text-sm font-medium transition-colors duration-300 ${
              mode === current ? 'text-on-primary' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {mode === current && (
              <m.span layoutId="skin-mode" className="absolute inset-0 rounded-full bg-primary" transition={{ duration: 0.4, ease }} />
            )}
            <span className="relative">{t(current === 'before' ? site.results.beforeLabel : site.results.afterLabel)}</span>
          </button>
        ))}
      </m.div>
      <p className="mt-3 hidden text-center text-xs text-ink-soft [@media(hover:hover)]:block" aria-hidden="true">
        {t(site.hero.panelHint)}
      </p>

      <IconSparkle className="absolute -top-3 end-8 size-5 text-gold" aria-hidden="true" />
      <IconSparkle className="absolute bottom-16 -start-3 size-3 text-gold/80" aria-hidden="true" />

      {/* البطاقتان العائمتان على زاويتي اللوحة */}
      <FloatingCard className="top-[14%] -start-3 sm:-start-8" icon={<IconClock />} delay={0} play={introDone && !reduceMotion}>
        {t(firstCard)}
      </FloatingCard>
      <FloatingCard className="bottom-[20%] -end-3 sm:-end-8" icon={<IconLeaf />} delay={1.4} play={introDone && !reduceMotion}>
        {t(secondCard)}
      </FloatingCard>
    </div>
  )
}

interface FloatingCardProps {
  className: string
  icon: ReactNode
  delay: number
  play: boolean
  children: ReactNode
}

function FloatingCard({ className, icon, delay, play, children }: FloatingCardProps) {
  return (
    <m.div
      aria-hidden="true"
      className={`absolute z-10 ${className}`}
      initial={{ opacity: 0, y: 18 }}
      animate={play ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 1 + delay * 0.25, duration: 0.9, ease }}
    >
      <m.div
        className="flex items-center gap-3 rounded-2xl border border-line/80 bg-surface/85 py-2.5 ps-2.5 pe-4 shadow-float backdrop-blur-md"
        animate={play ? { y: [0, -8, 0] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <span className="grid size-9 place-items-center rounded-full bg-sand text-lg text-gold-deep">{icon}</span>
        <span className="text-sm font-medium whitespace-nowrap">{children}</span>
      </m.div>
    </m.div>
  )
}
