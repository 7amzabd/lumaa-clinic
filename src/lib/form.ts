/** شكل موحّد لكل حقول النموذج (يُضاف إلى className) */
export const inputClass =
  'block w-full rounded-field border border-line bg-surface px-4 text-ink transition-colors duration-300 ' +
  'placeholder:text-ink-soft/80 hover:border-gold/70 focus:border-gold-deep focus-visible:outline-offset-2 ' +
  'aria-invalid:border-danger'

/** يرجع معرّف رسالة الخطأ أو التلميح لخاصية aria-describedby */
export function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}
