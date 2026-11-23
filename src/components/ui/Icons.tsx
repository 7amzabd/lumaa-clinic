import type { SVGProps } from 'react'

/**
 * أيقونات SVG صغيرة مرسومة داخل الكود (بدون مكتبة ولا رموز تعبيرية).
 * كل الأيقونات تأخذ لون النص المحيط بها (currentColor)،
 * وهي مخفية عن قارئ الشاشة لأنها زخرفية؛ النص المجاور يشرح معناها.
 */
type IconProps = SVGProps<SVGSVGElement>

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

/** النجمة الرباعية: رمز اللمعة في هوية العيادة */
export function IconSparkle(props: IconProps) {
  return (
    <Svg {...props} stroke="none" fill="currentColor">
      <path d="M12 1.5C12.9 7.6 16.4 11.1 22.5 12 16.4 12.9 12.9 16.4 12 22.5 11.1 16.4 7.6 12.9 1.5 12 7.6 11.1 11.1 7.6 12 1.5Z" />
    </Svg>
  )
}

export function IconMenu(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 9h16M4 15h16" />
    </Svg>
  )
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}

/** سهم يشير إلى "نهاية" السطر: يمين في الإنجليزي ويسار في العربي */
export function IconArrow({ className = '', ...props }: IconProps) {
  return (
    <Svg className={`rtl:-scale-x-100 ${className}`} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  )
}

export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  )
}

export function IconLeaf(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 19c0-8.5 5.5-13.5 14.5-14 0 9-5.5 14-14.5 14Z" />
      <path d="M5 19 13 11" />
    </Svg>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  )
}

export function IconSun(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </Svg>
  )
}

export function IconMoon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </Svg>
  )
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m15 6-6 6 6 6" />
    </Svg>
  )
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  )
}

export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8 7.5 9.5 4.4-1.5 7.5-5.1 7.5-9.5V6L12 3Z" />
      <path d="m9 12 2 2 4-4.5" />
    </Svg>
  )
}

export function IconUsers(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9.5" cy="8.5" r="3.5" />
      <path d="M3.5 20a6 6 0 0 1 12 0" />
      <path d="M16 5.3a3.5 3.5 0 0 1 0 6.4M17.5 14.6a6 6 0 0 1 3 5.4" />
    </Svg>
  )
}

export function IconDocument(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 3.5h7l4 4v13H7v-17Z" />
      <path d="M14 3.5v4h4M10 12h5M10 15.5h5" />
    </Svg>
  )
}

export function IconChevronDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  )
}

export function IconPlus(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

export function IconMapPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </Svg>
  )
}

export function IconStar(props: IconProps) {
  return (
    <Svg {...props} stroke="none" fill="currentColor">
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
    </Svg>
  )
}

export function IconQuote(props: IconProps) {
  return (
    <Svg {...props} stroke="none" fill="currentColor" viewBox="0 0 32 32">
      <path d="M13 8c-4.4 1.6-7 5.2-7 10.2V24h7.5v-7.5H9.6c.2-3 1.7-5 4.4-6.2L13 8Zm13 0c-4.4 1.6-7 5.2-7 10.2V24h7.5v-7.5h-3.9c.2-3 1.7-5 4.4-6.2L26 8Z" />
    </Svg>
  )
}

/** سهمان متعاكسان لمقبض شريط المقارنة */
export function IconDrag(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
    </Svg>
  )
}

export function IconWhatsapp(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20.5 5.3 16.6A8.6 8.6 0 1 1 8.3 19.5L4 20.5Z" />
      <path d="M9.3 8.4c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6a6.3 6.3 0 0 0 2.6 2.6l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .6-.4.8-.6.4-1.5.6-2.4.3a7.4 7.4 0 0 1-4.7-4.7c-.3-.9-.1-1.8.3-2.4Z" />
    </Svg>
  )
}

export function IconInstagram(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconSnapchat(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5c2.9 0 4.8 2.1 4.8 5v2.2l1.7.6c.4.2.4.7 0 .9l-1.5.7c.6 1.5 1.8 2.6 3.1 3-.3.6-1.3.9-2.4 1-.2.6-.3 1-.7 1-.8 0-1.5-.4-2.4-.1-.9.3-1.5 1-2.6 1s-1.7-.7-2.6-1c-.9-.3-1.6.1-2.4.1-.4 0-.5-.4-.7-1-1.1-.1-2.1-.4-2.4-1 1.3-.4 2.5-1.5 3.1-3l-1.5-.7c-.4-.2-.4-.7 0-.9l1.7-.6V8.5c0-2.9 1.9-5 4.8-5Z" />
    </Svg>
  )
}

export function IconTiktok(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 3.5v11a3.75 3.75 0 1 1-3.75-3.75" />
      <path d="M14 3.5c.4 2.6 2.3 4.4 5 4.6" />
    </Svg>
  )
}
