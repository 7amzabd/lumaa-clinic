import { m, useScroll } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '../../content/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useLang } from '../../i18n/useLang'
import { LinkButton } from '../ui/Button'
import { IconClose, IconMenu } from '../ui/Icons'
import { Logo } from '../ui/Logo'
import { ThemeToggle } from '../ui/ThemeToggle'
import { MobileMenu } from './MobileMenu'

// الأقسام التي نراقبها لتمييز الرابط النشط
const SECTION_IDS = ['top', ...site.nav.map((link) => link.id), 'booking']

/** الشريط العلوي الثابت: الشعار، الروابط، زر اللغة، زر الحجز */
export function Header() {
  const { t, lang, toggleLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const active = useActiveSection(SECTION_IDS)
  // useCallback: نفس الدالة في كل مرة، حتى لا تُعاد تهيئة القائمة مع كل تمرير
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  // نسبة التمرير في الصفحة (0 إلى 1) لشريط التقدم الذهبي
  const { scrollYProgress } = useScroll()

  // بعد تمرير بسيط يصبح للشريط خلفية ضبابية وخط سفلي
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || menuOpen

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${
        solid ? 'border-line/80 bg-canvas/85 backdrop-blur-xl' : 'border-transparent'
      }`}
    >
      {/* شريط تقدم رفيع يمتد مع التمرير، من جهة البداية */}
      <m.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-linear-to-r from-gold to-gold-deep rtl:origin-right"
        style={{ scaleX: scrollYProgress }}
      />
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo />

        {/* روابط الأقسام: تظهر على الشاشات الكبيرة فقط */}
        <nav aria-label={t(site.ui.mainNav)} className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {site.nav.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className="relative py-2 text-[0.95rem] text-ink-soft transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 after:ease-lux hover:text-ink hover:after:scale-x-100 aria-[current=true]:text-ink aria-[current=true]:after:scale-x-100"
                >
                  {t(link.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* زر تبديل اللغة */}
          <button
            type="button"
            onClick={toggleLang}
            title={t(site.ui.switchLanguage)}
            className="inline-flex h-10 min-w-11 items-center justify-center rounded-full border border-ink/15 px-3 text-sm font-medium transition-colors duration-300 hover:border-gold hover:text-gold-deep"
          >
            <span lang={lang === 'ar' ? 'en' : 'ar'}>{t(site.ui.languageToggle)}</span>
            <span className="sr-only">{t(site.ui.switchLanguage)}</span>
          </button>

          {/* في الجوال ينتقل زر الوضع إلى داخل القائمة، حتى يتسع الشريط للأزرار الأساسية */}
          <div className="max-sm:hidden">
            <ThemeToggle />
          </div>

          <LinkButton href="#booking" className="max-sm:h-10 max-sm:px-3.5">
            {t(site.ui.bookNow)}
          </LinkButton>

          {/* زر القائمة: يظهر في الجوال والتابلت فقط */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={t(menuOpen ? site.ui.closeMenu : site.ui.openMenu)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-ink/15 transition-colors duration-300 hover:border-gold lg:hidden"
          >
            {menuOpen ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        active={active}
        onClose={closeMenu}
        menuButtonRef={menuButtonRef}
      />
    </header>
  )
}
