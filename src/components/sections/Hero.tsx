import { m, type Variants } from 'motion/react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { CONSULTATION_ID } from '../../state/BookingContext'
import { useIntroDone } from '../../state/IntroContext'
import { useBooking } from '../../state/useBooking'
import { LinkButton } from '../ui/Button'
import { CountUp } from '../ui/CountUp'
import { IconArrow, IconStar } from '../ui/Icons'
import { Magnetic } from '../ui/Magnetic'
import { ShineText } from '../ui/ShineText'
import { SkinPanel } from '../ui/SkinPanel'
import { WordReveal } from '../ui/WordReveal'

// ظهور عناصر النص واحدًا بعد الآخر بعد انتهاء شاشة التحميل
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}
// كلمات العنوان تتتابع بسرعة أكبر
const title: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

/** القسم الأول: العنوان، الوصف، الأزرار، الكرة، والأرقام الثلاثة */
export function Hero() {
  const { t } = useLang()
  const { goToBooking } = useBooking()
  const introDone = useIntroDone()
  const { hero } = site
  const state = introDone ? 'show' : 'hidden'

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
      {/* توهج وردي ناعم في زاوية الصفحة */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-48 -end-40 size-[34rem] rounded-full bg-blush/45 blur-3xl" />

      <div className="container-page relative grid items-center gap-x-12 gap-y-14 lg:grid-cols-[1.08fr_1fr]">
        <m.div variants={container} initial="hidden" animate={state}>
          <m.p variants={item} className="eyebrow">
            {t(hero.eyebrow)}
          </m.p>

          <m.h1 variants={title} id="hero-title" className="heading-display mt-6">
            <WordReveal text={t(hero.titleStart)} />{' '}
            <span className="inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-bottom">
              <m.span variants={{ hidden: { y: '110%', opacity: 0 }, show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }} className="inline-block">
                <ShineText play={introDone} delay={1}>
                  {t(hero.titleShine)}
                </ShineText>
              </m.span>
            </span>
          </m.h1>

          <m.p variants={item} className="mt-6 max-w-lg text-lg text-ink-soft">
            {t(hero.description)}
          </m.p>

          <m.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <LinkButton
                href="#booking"
                size="lg"
                className="w-full sm:w-auto"
                onClick={(event) => {
                  event.preventDefault()
                  goToBooking(CONSULTATION_ID)
                }}
              >
                {t(hero.primaryCta)}
              </LinkButton>
            </Magnetic>
            <LinkButton href="#services" size="lg" variant="outline" className="group">
              {t(hero.secondaryCta)}
              <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </LinkButton>
          </m.div>
        </m.div>

        <SkinPanel />

        {/* الأرقام الثلاثة */}
        <m.dl
          className="grid grid-cols-3 border-t border-line pt-8 lg:col-span-2"
          initial={{ opacity: 0 }}
          animate={introDone ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 1 }}
        >
          {hero.stats.map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col-reverse gap-1 px-2 text-center sm:px-8 sm:text-start ${
                index > 0 ? 'border-s border-line' : 'sm:ps-0'
              }`}
            >
              <dt className="text-xs text-ink-soft sm:text-sm">{t(stat.label)}</dt>
              <dd className="flex items-baseline justify-center gap-1.5 font-heading text-[1.9rem] leading-none sm:justify-start sm:text-[2.6rem]">
                {/* dir="ltr" حتى تظهر علامة + بعد الرقم في العربي أيضًا */}
                <span dir="ltr">
                  <CountUp value={stat.value} decimals={stat.decimals} />
                  {stat.plus && '+'}
                </span>
                {stat.unit && <span className="text-base text-ink-soft sm:text-lg">{t(stat.unit)}</span>}
                {stat.icon === 'star' && <IconStar className="size-4 self-center text-gold sm:size-5" />}
              </dd>
            </div>
          ))}
        </m.dl>
      </div>
    </section>
  )
}
