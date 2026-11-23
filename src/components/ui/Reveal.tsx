import { m, type HTMLMotionProps } from 'motion/react'

type RevealProps = HTMLMotionProps<'div'> & {
  /** تأخير الظهور بالثواني (مفيد لإظهار البطاقات واحدة بعد الأخرى) */
  delay?: number
}

/**
 * يُظهر المحتوى بنعومة عند وصول الزائر إليه أثناء التمرير.
 * إذا فعّل الزائر "تقليل الحركة"، تُلغى الإزاحة ويبقى تلاشٍ بسيط فقط.
 */
export function Reveal({ delay = 0, children, ...props }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </m.div>
  )
}
