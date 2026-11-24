import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { Photo } from '../ui/Photo'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/**
 * الفريق: صورة دائرية داخل حلقة ذهبية، ثم الاسم والتخصص والخبرة.
 * إذا لم تُكتب صورة للعضو في site.ts يظهر الحرف الأول من اسمه بدلًا منها.
 */
export function Team() {
  const { t } = useLang()
  const { team } = site

  return (
    <section id="team" aria-labelledby="team-title" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="team-title" content={team} className="mx-auto text-center" />

        <ul className="mt-16 grid gap-14 sm:grid-cols-3 sm:gap-8">
          {team.members.map((member, index) => (
            <li key={index}>
              <Reveal delay={index * 0.1} className="group text-center">
                {/* حلقة ذهبية تدور قليلًا عند المرور، وبداخلها الصورة */}
                <div className="relative mx-auto size-40 sm:size-44">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,var(--color-gold),transparent_40%,var(--color-gold)_70%,transparent)] transition-transform duration-700 ease-lux motion-safe:group-hover:rotate-45"
                  />
                  <div className="absolute inset-[3px] overflow-hidden rounded-full border-4 border-canvas bg-sand">
                    {member.image ? (
                      <Photo
                        src={member.image}
                        alt={member.imageAlt ? t(member.imageAlt) : t(member.name)}
                        width={600}
                        height={600}
                        className="size-full object-cover transition-transform duration-[1200ms] ease-lux motion-safe:group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_32%_28%,var(--orb-1),var(--orb-2)_55%,var(--orb-3))]">
                        <span aria-hidden="true" className="font-heading text-6xl leading-none text-on-orb">
                          {t(member.initial)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="heading-card mt-7">{t(member.name)}</h3>
                <p className="mt-1 text-gold-deep">{t(member.role)}</p>
                <div className="mx-auto mt-5 h-px w-10 bg-gold/60" />
                <p className="mt-5 text-sm text-ink-soft">{t(member.experience)}</p>
                <p className="mt-1 text-sm text-ink-soft">{t(member.focus)}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
