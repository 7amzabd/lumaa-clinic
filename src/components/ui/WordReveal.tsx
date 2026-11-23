import { m, type Variants } from 'motion/react'
import { Fragment } from 'react'

/**
 * يُظهر النص كلمةً كلمة: كل كلمة تصعد من خلف قناع.
 * نقسم بالكلمات لا بالحروف، لأن تقسيم الحروف العربية يفصلها عن بعضها.
 * يعمل داخل عنصر أب له variants (hidden / show) حتى تتتابع الكلمات.
 */
const word: Variants = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

export function WordReveal({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((item, index) => (
        <Fragment key={index}>
          {index > 0 && ' '}
          <span className="inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-bottom">
            <m.span variants={word} className="inline-block">
              {item}
            </m.span>
          </span>
        </Fragment>
      ))}
    </>
  )
}
