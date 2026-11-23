import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { IconSparkle } from './Icons'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * شاشة تحميل قصيرة (أقل من ثانية): الشعار يلمع ثم تنكشف الصفحة.
 * تُلغى تمامًا إذا طلب الزائر تقليل الحركة.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const { t } = useLang()
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(!reduceMotion)

  useEffect(() => {
    if (reduceMotion) {
      onDone()
      return
    }
    // ننتظر الخطوط حتى لا يلمع الشعار بخط بديل، مع حد أقصى 900ms
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const minimum = new Promise((resolve) => setTimeout(resolve, 900))
    let cancelled = false
    Promise.all([fontsReady, minimum]).then(() => {
      if (cancelled) return
      setVisible(false)
      onDone()
    })
    return () => {
      cancelled = true
    }
  }, [reduceMotion, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-canvas"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.8, ease }}
        >
          <m.div
            className="relative font-heading text-5xl font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, ease }}
          >
            <m.span
              className="text-shine inline-block"
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: '100% 50%' }}
              transition={{ duration: 0.9, delay: 0.15, ease: 'easeInOut' }}
            >
              {t(site.brand.name)}
            </m.span>
            <IconSparkle className="absolute -top-1 -end-5 size-3.5 text-gold" />
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
