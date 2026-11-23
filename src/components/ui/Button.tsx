import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'md' | 'lg'

interface StyleProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

// الأنماط المشتركة لكل الأزرار
const base =
  'relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium whitespace-nowrap ' +
  'transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-lux disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  // الزر الأساسي: خلفية داكنة + لمعة عند تمرير الماوس
  primary:
    'btn-shine bg-primary text-on-primary shadow-soft hover:bg-primary-hover motion-safe:hover:-translate-y-0.5',
  // زر بإطار رفيع
  outline:
    'border border-ink/20 text-ink hover:border-gold hover:bg-surface/70 motion-safe:hover:-translate-y-0.5',
  ghost: 'text-ink hover:text-gold-deep',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[0.95rem]',
}

function classes({ variant = 'primary', size = 'md', className = '' }: Omit<StyleProps, 'children'>) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}

/** زر عادي: <Button onClick={...}>نص</Button> */
export function Button({
  variant,
  size,
  className,
  children,
  type = 'button',
  ...props
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes({ variant, size, className })} {...props}>
      {children}
    </button>
  )
}

/** رابط بشكل زر: <LinkButton href="#services">نص</LinkButton> */
export function LinkButton({
  variant,
  size,
  className,
  children,
  ...props
}: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes({ variant, size, className })} {...props}>
      {children}
    </a>
  )
}
