import { AnimatePresence, m } from 'motion/react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { useTheme } from '../../theme/ThemeContext'
import { IconMoon, IconSun } from './Icons'

/** زر التبديل بين الوضع الفاتح والداكن: الأيقونة تدور وتتبدل */
export function ThemeToggle() {
  const { t } = useLang()
  const { theme, toggleTheme } = useTheme()
  const label = t(theme === 'dark' ? site.ui.switchToLight : site.ui.switchToDark)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full border border-ink/15 transition-colors duration-300 hover:border-gold hover:text-gold-deep"
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={theme}
          className="grid place-items-center"
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {theme === 'dark' ? <IconSun className="size-[1.15rem]" /> : <IconMoon className="size-[1.15rem]" />}
        </m.span>
      </AnimatePresence>
    </button>
  )
}
