import { m, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

// درجات البشرة الست في مقياس فيتزباتريك (للتوضيح فقط)
const FITZPATRICK_TONES = ['#f6e3d4', '#ecccb2', '#d6a684', '#b47d57', '#865436', '#583421']

/**
 * رحلتك معنا: خمس خطوات على خط زمني يُرسم مع التمرير،
 * وكل خطوة تضيء بالذهبي عند وصول الزائر إليها.
 */
export function Journey() {
  const { t } = useLang()
  const { steps } = site.journey
  const listRef = useRef<HTMLOListElement>(null)

  // نسبة التمرير داخل القائمة: يبدأ الرسم عندما تدخل 75% من الشاشة وينتهي عند خروج آخر خطوة
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 75%'] })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })

  return (
    <section id="journey" aria-labelledby="journey-title" className="py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* العنوان يبقى ثابتًا بجانب الخطوات على الشاشات الكبيرة */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading id="journey-title" content={site.journey} />
        </div>

        <ol ref={listRef} className="relative">
          {/* الخط الخلفي الباهت، وفوقه الخط الذهبي الذي يُرسم مع التمرير */}
          <div aria-hidden="true" className="absolute top-6 bottom-6 start-6 w-px bg-line" />
          <m.div
            aria-hidden="true"
            className="absolute top-6 bottom-6 start-6 w-px origin-top bg-linear-to-b from-gold to-gold-deep"
            style={{ scaleY: lineProgress }}
          />

          {steps.map((step, index) => {
            const isLast = index === steps.length - 1
            return (
              <li key={index} className={`relative flex gap-5 sm:gap-7 ${isLast ? '' : 'pb-12'}`}>
                {/* الرقم: يتحول إلى ذهبي ممتلئ عندما يصل الزائر إليه */}
                <m.span
                  className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border font-heading text-lg"
                  initial={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-canvas)', color: 'var(--color-ink-soft)' }}
                  whileInView={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-gold)', color: 'var(--color-on-orb)', scale: [1, 1.12, 1] }}
                  viewport={{ once: true, margin: '0px 0px -30% 0px' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {String(index + 1).padStart(2, '0')}
                </m.span>

                <Reveal className="pt-2">
                  <h3 className="heading-card">{t(step.title)}</h3>
                  <p className="mt-2 max-w-md text-ink-soft">{t(step.description)}</p>
                  {step.skinScale && (
                    <div aria-hidden="true" className="mt-4 flex items-center gap-1.5" dir="ltr">
                      {FITZPATRICK_TONES.map((tone, toneIndex) => (
                        <m.span
                          key={tone}
                          className="size-6 rounded-full ring-1 ring-ink/10"
                          style={{ backgroundColor: tone }}
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + toneIndex * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                      ))}
                      <span className="ms-2 text-xs text-ink-soft">I – VI</span>
                    </div>
                  )}
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
