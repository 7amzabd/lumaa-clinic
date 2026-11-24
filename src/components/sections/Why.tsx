import { m } from 'motion/react'
import type { ComponentType, SVGProps } from 'react'
import { site } from '../../content/site'
import type { WhyIcon, WhyItem } from '../../content/types'
import { useLang } from '../../i18n/useLang'
import { CountUp } from '../ui/CountUp'
import { IconClock, IconDocument, IconLeaf, IconShield, IconSparkle, IconUsers } from '../ui/Icons'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { TiltCard } from '../ui/TiltCard'

const icons: Record<WhyIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  shield: IconShield,
  users: IconUsers,
  document: IconDocument,
  clock: IconClock,
  leaf: IconLeaf,
  sparkle: IconSparkle,
}

/** لماذا لُمعة: شبكة بطاقات غير متماثلة (bento) بأرقام وأيقونات متحركة */
export function Why() {
  const { why } = site

  return (
    <section id="why" aria-labelledby="why-title" className="bg-sand py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="why-title" content={why} />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {why.items.map((item, index) => (
            <li key={index} className={item.size === 'large' ? 'sm:col-span-2' : ''}>
              <Reveal delay={index * 0.07} className="h-full">
                <TiltCard max={5}>
                  <WhyCard item={item} large={item.size === 'large'} />
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function WhyCard({ item, large }: { item: WhyItem; large: boolean }) {
  const { t } = useLang()
  const Icon = icons[item.icon]

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface p-6 sm:p-7 ${
        large ? 'min-h-[16rem] justify-end' : 'min-h-[14rem]'
      }`}
    >
      {large && (
        // زخرفة للبطاقة الكبيرة: سطور «الخطة» تُرسم واحدًا بعد الآخر
        <div aria-hidden="true" className="absolute top-7 end-7 w-28 space-y-2.5 opacity-70 sm:w-36">
          {[1, 0.75, 0.9, 0.55].map((width, index) => (
            <m.span
              key={index}
              className="block h-1.5 origin-left rounded-full bg-gold/60 rtl:origin-right"
              style={{ width: `${width * 100}%` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
          <m.span
            className="mt-4 block size-7 rounded-full border border-gold text-gold"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <IconSparkle className="m-auto mt-1.5 size-3.5" />
          </m.span>
        </div>
      )}

      {/* الأيقونة في دائرة رملية، تتوهج قليلًا عند تمرير الماوس */}
      <span className="grid size-11 place-items-center rounded-full bg-sand text-xl text-gold-deep transition-shadow duration-500 group-hover:shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-gold)_20%,transparent)]">
        <Icon />
      </span>

      {item.stat && (
        <p className="mt-6 flex items-baseline gap-1.5 font-heading text-5xl leading-none" dir="ltr">
          <span>
            <CountUp value={item.stat.value} />
            {item.stat.plus && '+'}
          </span>
          {item.stat.unit && <span className="text-lg text-ink-soft">{t(item.stat.unit)}</span>}
        </p>
      )}

      <h3 className={`heading-card ${item.stat ? 'mt-3' : large ? 'mt-10' : 'mt-6'}`}>{t(item.title)}</h3>
      <p className={`mt-2 text-ink-soft ${large ? 'max-w-md' : 'text-sm'}`}>{t(item.text)}</p>
    </article>
  )
}
