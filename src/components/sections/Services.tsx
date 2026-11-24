import { useEffect, useRef, useState } from 'react'
import { site } from '../../content/site'
import type { Service } from '../../content/types'
import { useLang } from '../../i18n/useLang'
import { formatPrice } from '../../lib/format'
import { useBooking } from '../../state/useBooking'
import { IconArrow, IconClock, IconLeaf } from '../ui/Icons'
import { Photo } from '../ui/Photo'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { ServiceDialog } from '../ui/ServiceDialog'
import { TiltCard } from '../ui/TiltCard'

/**
 * قسم الخدمات: بطاقات بصور تميل مع الماوس على سطح المكتب،
 * وفي الجوال تصبح شريطًا ينزلق بالإصبع مع نقاط تنقّل.
 * الضغط على البطاقة يفتح نافذة التفاصيل، وزر «احجز» يختار الخدمة في نموذج الحجز.
 */
export function Services() {
  const { t } = useLang()
  const { goToBooking } = useBooking()
  const { items } = site.services
  const trackRef = useRef<HTMLUListElement>(null)
  const [current, setCurrent] = useState(0)
  // الخدمة المفتوحة في نافذة التفاصيل (null = مغلقة)
  const [openService, setOpenService] = useState<Service | null>(null)

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
                <TiltCard max={5}>
                  <ServiceCard service={service} eager={index === 0} onOpen={() => setOpenService(service)} />
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* نقاط التنقل: الجوال فقط (مساحة اللمس أكبر من النقطة الظاهرة) */}
        <div className="mt-1 flex justify-center sm:hidden" role="tablist" aria-label={t(site.services.eyebrow)}>
          {items.map((service, index) => (
            <button
              key={service.id}
              type="button"
              role="tab"
              aria-selected={index === current}
              aria-label={t(service.name)}
              onClick={() => scrollTo(index)}
              className="grid h-8 place-items-center px-1"
            >
              <span
                className={`block h-2 rounded-full transition-[width,background-color] duration-400 ease-lux ${
                  index === current ? 'w-7 bg-gold-deep' : 'w-2 bg-line'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <ServiceDialog service={openService} onClose={() => setOpenService(null)} onBook={(id) => goToBooking(id)} />
    </section>
  )
}

interface ServiceCardProps {
  service: Service
  /** الصورة الأولى تُحمَّل فورًا، والباقي عند الاقتراب منها */
  eager: boolean
  onOpen: () => void
}

function ServiceCard({ service, eager, onOpen }: ServiceCardProps) {
  const { t, lang } = useLang()
  const { goToBooking } = useBooking()
  const { services } = site
  const featured = service.featured === true

  // البطاقة المميزة بألوان معكوسة (خلفية داكنة)، والباقي بخلفية فاتحة
  const tone = featured
    ? {
        card: 'border-gold/25 bg-inverse text-on-inverse',
        soft: 'text-on-inverse-soft',
        link: 'text-gold',
        button: 'bg-on-inverse text-inverse hover:bg-gold',
      }
    : {
        card: 'border-line bg-surface hover:border-gold/60',
        soft: 'text-ink-soft',
        link: 'text-gold-deep',
        button: 'bg-primary text-on-primary hover:bg-primary-hover',
      }

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-card border transition-[border-color,box-shadow] duration-500 ease-lux hover:shadow-float ${tone.card}`}
    >
      {/* الصورة مع تكبير ناعم عند تمرير الماوس */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Photo
          src={service.image}
          alt={t(service.imageAlt)}
          eager={eager}
          className="size-full object-cover transition-transform duration-[1400ms] ease-lux motion-safe:group-hover:scale-[1.06]"
        />
        {/* تدرج داكن أسفل الصورة حتى تُقرأ الشارات فوقها */}
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent" />
        {featured && (
          <span className="absolute top-4 start-4 rounded-full bg-gold px-3 py-1 text-xs font-medium text-on-orb">
            {t(services.featuredBadge)}
          </span>
        )}
        <ul className="absolute inset-x-4 bottom-3.5 flex flex-wrap gap-2 text-xs font-medium text-white">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 backdrop-blur-sm">
            <IconClock className="size-3.5" />
            <span className="sr-only">{t(services.durationLabel)}: </span>
            {t(service.duration)}
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 backdrop-blur-sm">
            <IconLeaf className="size-3.5" />
            <span className="sr-only">{t(services.recoveryLabel)}: </span>
            {t(service.recovery)}
          </li>
        </ul>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="heading-card">
          {/* after:inset-0 يمدّ مساحة الضغط على البطاقة كلها، فتفتح التفاصيل من أي مكان فيها */}
          <button type="button" onClick={onOpen} aria-haspopup="dialog" className="text-start after:absolute after:inset-0">
            {t(service.name)}
          </button>
        </h3>
        <p className={`mt-2 line-clamp-2 ${tone.soft}`}>{t(service.description)}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <p>
            <span className={`block text-xs ${tone.soft}`}>{t(services.priceFromLabel)}</span>
            <span className="font-heading text-2xl leading-tight">{formatPrice(service.priceFrom, lang)}</span>
          </p>
          <div className="flex items-center gap-3">
            {/* تلميح بصري فقط: الضغط على البطاقة نفسها يفتح التفاصيل */}
            <span aria-hidden="true" className={`text-sm underline-offset-4 group-hover:underline ${tone.link}`}>
              {t(services.detailsLabel)}
            </span>
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
        </div>
      </div>
    </article>
  )
}
