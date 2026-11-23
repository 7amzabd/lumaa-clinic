import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { BeforeAfter } from '../ui/BeforeAfter'
import { IconCheck } from '../ui/Icons'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** النتائج: نص ونقاط على جانب، وشريط المقارنة على الجانب الآخر */
export function Results() {
  const { t } = useLang()
  const { results } = site

  return (
    <section id="results" aria-labelledby="results-title" className="py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading id="results-title" content={results} />
          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-4">
              {results.highlights.map((highlight, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sand text-gold-deep">
                    <IconCheck className="size-4" />
                  </span>
                  {t(highlight)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <BeforeAfter />
        </Reveal>
      </div>
    </section>
  )
}
