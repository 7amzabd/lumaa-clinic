import { site } from '../../content/site'
import type { Testimonial } from '../../content/types'
import { useLang } from '../../i18n/useLang'
import { IconQuote } from '../ui/Icons'
import { Marquee } from '../ui/Marquee'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** آراء العميلات: شريط متحرك يتوقف عند لمسه ويُسحب بالإصبع والماوس */
export function Testimonials() {
  const { t } = useLang()
  const { testimonials } = site

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="overflow-hidden bg-sand py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="testimonials-title" content={testimonials} />
      </div>

      <Reveal delay={0.1} className="relative mt-14">
        {/* تلاشٍ على الطرفين حتى تدخل البطاقات وتخرج بنعومة */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-linear-to-r from-sand to-transparent sm:w-32 rtl:bg-linear-to-l" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-linear-to-l from-sand to-transparent sm:w-32 rtl:bg-linear-to-r" />
        <Marquee label={t(testimonials.eyebrow)} items={testimonials.items.map((item, index) => <TestimonialCard key={index} item={item} />)} />
      </Reveal>
    </section>
  )
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const { t } = useLang()
  return (
    <figure className="flex h-full flex-col rounded-card bg-surface p-7 sm:p-8">
      <IconQuote className="size-8 text-gold rtl:-scale-x-100" />
      <blockquote className="mt-5 text-[1.05rem] leading-[1.9]">{t(item.quote)}</blockquote>
      <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <span>
          <span className="block font-medium">{t(item.name)}</span>
          <span className="block text-sm text-ink-soft">{t(item.city)}</span>
        </span>
        <span className="rounded-full bg-sand px-3 py-1 text-xs text-gold-deep">{t(item.service)}</span>
      </figcaption>
    </figure>
  )
}
