import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { IconPlus } from './Icons'

export interface AccordionItem {
  id: string
  question: string
  answer: string
}

/**
 * قائمة أسئلة قابلة للفتح والإغلاق.
 * كل سؤال زر له aria-expanded، فيعرف قارئ الشاشة هل الإجابة مفتوحة أم مغلقة.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="border-t border-line">
      {items.map((item) => {
        const isOpen = openId === item.id
        const buttonId = `${item.id}-button`
        const panelId = `${item.id}-panel`

        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-start"
              >
                <span className="heading-card transition-colors duration-300 group-hover:text-gold-deep">
                  {item.question}
                </span>
                {/* علامة + تدور لتصبح × عند الفتح */}
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ease-lux ${
                    isOpen ? 'rotate-45 border-primary bg-primary text-on-primary' : 'border-line group-hover:border-gold'
                  }`}
                >
                  <IconPlus className="size-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pe-14 pb-7 text-ink-soft">{item.answer}</p>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
