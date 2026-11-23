import { AnimatePresence, m } from 'motion/react'
import { site } from '../../content/site'
import { useElementVisible } from '../../hooks/useElementVisible'
import { useLang } from '../../i18n/useLang'
import { CONSULTATION_ID } from '../../state/BookingContext'
import { useBooking } from '../../state/useBooking'
import { LinkButton } from '../ui/Button'
import { IconSparkle } from '../ui/Icons'

/**
 * شريط سفلي ثابت في الجوال فيه زر «احجز استشارة مجانية».
 * يختفي تلقائيًا عندما يظهر نموذج الحجز، حتى لا يغطيه.
 */
export function MobileBookingBar() {
  const { t } = useLang()
  const { goToBooking } = useBooking()
  const bookingVisible = useElementVisible('booking')

  return (
    <AnimatePresence initial={false}>
      {!bookingVisible && (
        <m.aside
          aria-label={t(site.ui.bookConsultation)}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-canvas/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <LinkButton
            href="#booking"
            size="lg"
            className="w-full"
            onClick={(event) => {
              event.preventDefault()
              goToBooking(CONSULTATION_ID)
            }}
          >
            <IconSparkle className="size-3.5 text-gold" />
            {t(site.ui.bookConsultation)}
          </LinkButton>
        </m.aside>
      )}
    </AnimatePresence>
  )
}
