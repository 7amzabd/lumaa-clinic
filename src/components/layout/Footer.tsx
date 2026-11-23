import type { ComponentType, SVGProps } from 'react'
import { site } from '../../content/site'
import type { SocialIcon } from '../../content/types'
import { useLang } from '../../i18n/useLang'
import { whatsappUrl } from '../../lib/whatsapp'
import {
  IconClock,
  IconInstagram,
  IconMapPin,
  IconSnapchat,
  IconTiktok,
  IconWhatsapp,
} from '../ui/Icons'
import { Logo } from '../ui/Logo'

const socialIcons: Record<SocialIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  whatsapp: IconWhatsapp,
  instagram: IconInstagram,
  snapchat: IconSnapchat,
  tiktok: IconTiktok,
}

// السنة الحالية لسطر الحقوق (تُحسب مرة واحدة عند تحميل الموقع)
const YEAR = String(new Date().getFullYear())

/** التذييل: الشعار، روابط سريعة، التواصل، وسطور عرض الأعمال */
export function Footer() {
  const { t } = useLang()
  const { footer, booking, brand } = site

  return (
    <footer className="bg-inverse text-on-inverse">
      <div className="container-page grid gap-12 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-on-inverse-soft">{t(footer.about)}</p>
        </div>

        <nav aria-labelledby="footer-links-title">
          <h2 id="footer-links-title" className="text-sm font-medium text-gold">
            {t(footer.linksTitle)}
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
            {site.nav.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="text-on-inverse-soft transition-colors hover:text-on-inverse"
                >
                  {t(link.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-medium text-gold">{t(footer.contactTitle)}</h2>
          <ul className="mt-5 space-y-3 text-on-inverse-soft">
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 transition-colors hover:text-on-inverse"
              >
                <IconWhatsapp className="size-4.5 shrink-0 text-gold" />
                <span dir="ltr">{brand.phoneDisplay}</span>
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <IconMapPin className="size-4.5 shrink-0 text-gold" />
              {t(booking.info.address)}
            </li>
            <li className="flex items-center gap-2.5">
              <IconClock className="size-4.5 shrink-0 text-gold" />
              {t(booking.info.days)} · {t(booking.info.hours)}
            </li>
          </ul>

          <ul className="mt-6 flex gap-2.5">
            {footer.socials.map((social) => {
              const Icon = socialIcons[social.icon]
              const href = social.icon === 'whatsapp' ? whatsappUrl() : social.href
              return (
                <li key={social.icon}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(social.label)}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-on-inverse/20 text-on-inverse transition-[border-color,color,transform] duration-300 hover:border-gold hover:text-gold motion-safe:hover:-translate-y-0.5"
                  >
                    <Icon className="size-4.5" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-on-inverse/10">
        {/* مسافة سفلية إضافية في الجوال حتى لا يغطي شريط الحجز السفلي هذه السطور */}
        <div className="container-page flex flex-col gap-2 pt-6 pb-28 text-sm text-on-inverse-soft lg:flex-row lg:items-center lg:justify-between lg:pb-6">
          <p>
            {t(footer.rights).replace('{year}', YEAR)}
            {/* سطر الموقع التجريبي: اتركه فارغًا '' في site.ts لعيادة حقيقية فيختفي */}
            {t(footer.demoNote) && ` · ${t(footer.demoNote)}`}
          </p>
          <p>
            {t(footer.credit)} ·{' '}
            <a
              href={footer.creditHref}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="text-on-inverse underline decoration-gold/60 underline-offset-4 transition-colors hover:text-gold"
            >
              {footer.creditHandle}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
