import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { whatsappUrl } from '../../lib/whatsapp'
import { Accordion } from '../ui/Accordion'
import { IconArrow } from '../ui/Icons'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** الأسئلة الشائعة: العنوان على جانب، والأسئلة القابلة للفتح على الجانب الآخر */
export function Faq() {
  const { t } = useLang()
  const { faq } = site

  const items = faq.items.map((item, index) => ({
    id: `faq-${index + 1}`,
    question: t(item.question),
    answer: t(item.answer),
  }))

  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 sm:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading id="faq-title" content={faq} />
          <Reveal delay={0.1} className="mt-8">
            <p className="text-ink-soft">{t(faq.contactPrompt)}</p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex items-center gap-2 font-medium text-gold-deep underline-offset-4 hover:underline"
            >
              {t(faq.contactCta)}
              <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Accordion items={items} />
        </Reveal>
      </div>
    </section>
  )
}
