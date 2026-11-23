import type { ReactNode } from 'react'

interface FormFieldProps {
  id: string
  label: string
  optional?: string
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

/**
 * غلاف الحقل: العنوان (label) + الحقل + رسالة الخطأ أو التلميح.
 * رسالة الخطأ لها id بالشكل ‎{id}-error لربطها بالحقل عبر aria-describedby.
 */
export function FormField({ id, label, optional, hint, error, className = '', children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-ink-soft">{optional}</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-xs text-ink-soft">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
