import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { whatsappUrl } from '../../lib/whatsapp'
import { IconWhatsapp } from '../ui/Icons'

/**
 * زر واتساب عائم على الشاشات الكبيرة (في الجوال يكفي شريط الحجز السفلي).
 * يظهر بعد تجاوز القسم الأول، ويتمدد ليُظهر النص عند تمرير الماوس أو التركيز.
 */
export function FloatingWhatsapp() {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <m.a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(site.ui.whatsappChat)}
          className="group fixed end-6 bottom-6 z-40 hidden h-14 items-center rounded-full bg-primary px-4 text-on-primary shadow-float transition-colors duration-300 hover:bg-primary-hover lg:inline-flex"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <IconWhatsapp className="size-6 shrink-0" />
          <span className="max-w-0 overflow-hidden text-sm font-medium whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-500 ease-lux group-hover:ms-3 group-hover:max-w-60 group-hover:opacity-100 group-focus-visible:ms-3 group-focus-visible:max-w-60 group-focus-visible:opacity-100">
            {t(site.ui.whatsappChat)}
          </span>
        </m.a>
      )}
    </AnimatePresence>
  )
}
