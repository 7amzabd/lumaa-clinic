import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, type RefObject } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { LinkButton } from '../ui/Button'
import { IconArrow } from '../ui/Icons'

interface MobileMenuProps {
  open: boolean
  active: string | null
  onClose: () => void
  /** زر القائمة، لنعيد التركيز إليه عند الإغلاق بزر Esc */
  menuButtonRef: RefObject<HTMLButtonElement | null>
}

/** قائمة الروابط المختصرة في الجوال، تنزل أسفل الشريط العلوي */
export function MobileMenu({ open, active, onClose, menuButtonRef }: MobileMenuProps) {
  const { t } = useLang()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    firstLinkRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        menuButtonRef.current?.focus()
      }
    }
    // إذا كبُرت الشاشة إلى حجم سطح المكتب نغلق القائمة
    const onResize = () => {
      if (window.innerWidth >= 1024) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [open, onClose, menuButtonRef])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* خلفية شفافة: الضغط عليها يغلق القائمة */}
          <m.div
            key="backdrop"
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-x-0 top-full h-dvh bg-ink/25 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <m.div
            key="panel"
            id="mobile-menu"
            className="absolute inset-x-0 top-full border-b border-line bg-canvas shadow-float lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label={t(site.ui.mainNav)} className="container-page pt-2 pb-6">
              <ul>
                {site.nav.map((link, index) => (
                  <li key={link.id} className="border-b border-line/70">
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={`#${link.id}`}
                      onClick={onClose}
                      aria-current={active === link.id ? 'true' : undefined}
                      className="flex items-center justify-between py-4 font-heading text-xl aria-[current=true]:text-gold-deep"
                    >
                      {t(link.label)}
                      <IconArrow className="size-4 text-gold" />
                    </a>
                  </li>
                ))}
              </ul>
              <LinkButton href="#booking" onClick={onClose} size="lg" className="mt-6 w-full">
                {t(site.ui.bookNow)}
              </LinkButton>
            </nav>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
