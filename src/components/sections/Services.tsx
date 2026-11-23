import { useEffect, useRef, useState } from 'react'
import { site } from '../../content/site'
import type { Service } from '../../content/types'
import { useLang } from '../../i18n/useLang'
import { formatPrice } from '../../lib/format'
import { useBooking } from '../../state/useBooking'
import { IconArrow, IconClock, IconLeaf } from '../ui/Icons'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { TiltCard } from '../ui/TiltCard'

/**
 * قسم الخدمات: ست بطاقات تميل مع الماوس على سطح المكتب،
 * وفي الجوال تصبح شريطًا ينزلق بالإصبع مع نقاط تنقّل.
 */
export function Services() {
  const { t } = useLang()
  const { items } = site.services
  const trackRef = useRef<HTMLUListElement>(null)
  const [current, setCurrent] = useState(0)

  // في الجوال: نعرف البطاقة الظاهرة من موضع التمرير لتمييز نقطتها
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const cards = Array.from(track.children) as HTMLElement[]
      const center = track.scrollLeft + track.clientWidth / 2
      let nearest = 0
      let nearestDistance = Infinity
      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearest = index
        }
      })
      setCurrent(nearest)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (index: number) => {
    const card = trackRef.current?.children[index] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <section id="services" aria-labelledby="services-title" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="services-title" content={site.services} />

        {/* في الجوال: شريط أفقي ينزلق ويلتقط كل بطاقة. من sm فأكبر: شبكة */}
        <ul
          ref={trackRef}
          className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] max-sm:-mx-5 [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
        >
          {items.map((service, index) => (
            <li key={service.id} className="w-[84%] shrink-0 snap-center sm:w-auto">
              <Reveal delay={(index % 3) * 0.08} className="h-full">
                <TiltCard>
                  <ServiceCard service={service} number={index + 1} />
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* نقاط التنقل: الجوال فقط */}
        <div className="mt-2 flex justify-center gap-2 sm:hidden" role="tablist" aria-label={t(site.services.eyebrow)}>
          {items.map((service, index) => (
            <button
              key={service.id}
              type="button"
              role="tab"
              aria-selected={index === current}
              aria-label={t(service.name)}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-[width,background-color] duration-400 ease-lux ${
                index === current ? 'w-7 bg-gold-deep' : 'w-2 bg-line'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, number }: { service: Service; number: number }) {
  const { t, lang } = useLang()
  const { goToBooking } = useBooking()
  const { services } = site
  const featured = service.featured === true

  // البطاقة المميزة بألوان معكوسة (خلفية داكنة)، والباقي بخلفية فاتحة
  const tone = featured
    ? {
        card: 'border-gold/25 bg-inverse text-on-inverse',
        soft: 'text-on-inverse-soft',
        number: 'text-gold',
        line: 'border-on-inverse/15',
        button: 'bg-on-inverse text-inverse hover:bg-gold',
      }
    : {
        card: 'border-line bg-surface hover:border-gold/60',
        soft: 'text-ink-soft',
        number: 'text-gold-deep',
        line: 'border-line',
        button: 'border border-ink/15 hover:border-primary hover:bg-primary hover:text-on-primary',
      }

  return (
    <article
      className={`group flex h-full flex-col rounded-card border p-6 transition-[border-color,box-shadow] duration-500 ease-lux hover:shadow-float sm:p-7 ${tone.card}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`font-heading text-lg ${tone.number}`} aria-hidden="true">
          {String(number).padStart(2, '0')}
        </span>
        {featured && (
          <span className="rounded-full border border-gold/50 px-3 py-1 text-xs text-gold">{t(services.featuredBadge)}</span>
        )}
      </div>

      <h3 className="heading-card mt-6">{t(service.name)}</h3>
      <p className={`mt-3 ${tone.soft}`}>{t(service.description)}</p>

      {/* المدة وفترة التعافي */}
      <dl className={`mt-6 grid grid-cols-2 gap-4 border-t pt-5 text-sm ${tone.line}`}>
        <div>
          <dt className={`flex items-center gap-1.5 ${tone.soft}`}>
            <IconClock className="size-4 text-gold" />
            {t(services.durationLabel)}
          </dt>
          <dd className="mt-1 font-medium">{t(service.duration)}</dd>
        </div>
        <div>
          <dt className={`flex items-center gap-1.5 ${tone.soft}`}>
            <IconLeaf className="size-4 text-gold" />
            {t(services.recoveryLabel)}
          </dt>
          <dd className="mt-1 font-medium">{t(service.recovery)}</dd>
        </div>
      </dl>

      {/* السعر وزر الحجز */}
      <div className="mt-auto flex items-end justify-between gap-4 pt-7">
        <p>
          <span className={`block text-xs ${tone.soft}`}>{t(services.priceFromLabel)}</span>
          <span className="font-heading text-2xl leading-tight">{formatPrice(service.priceFrom, lang)}</span>
        </p>
        <button
          type="button"
          onClick={() => goToBooking(service.id)}
          className={`relative z-10 inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-300 ${tone.button}`}
        >
          {t(services.bookLabel)}
          {/* اسم الخدمة لقارئ الشاشة، حتى لا تكون كل الأزرار «احجز» فقط */}
          <span className="sr-only">{t(service.name)}</span>
          <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </button>
      </div>
    </article>
  )
}
