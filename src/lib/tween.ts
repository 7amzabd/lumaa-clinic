/**
 * حركة رقمية صغيرة جدًا (عدّاد الأرقام وتلميح شريط المقارنة).
 * كتبناها بدل دالة animate من مكتبة motion لأن تلك الدالة تضيف
 * حوالي 20KB للموقع، ونحن نحتاج فقط تحريك رقم من قيمة إلى أخرى.
 */

type Easing = (t: number) => number

/** تبدأ سريعة وتنتهي بهدوء */
export const easeOutQuint: Easing = (t) => 1 - (1 - t) ** 5
/** ناعمة في البداية والنهاية */
export const easeInOutSine: Easing = (t) => -(Math.cos(Math.PI * t) - 1) / 2

interface TweenOptions {
  /** المدة بالثواني */
  duration: number
  /** التأخير قبل البدء بالثواني */
  delay?: number
  ease?: Easing
  onUpdate: (value: number) => void
}

/**
 * يحرك رقمًا عبر قيم متتالية: tween([0, 100], {...}) أو tween([50, 36, 63, 50], {...})
 * يرجع دالة لإيقاف الحركة.
 */
export function tween(keyframes: number[], { duration, delay = 0, ease = easeOutQuint, onUpdate }: TweenOptions) {
  const segments = keyframes.length - 1
  let frameId = 0
  let startTime: number | null = null

  const step = (now: number) => {
    startTime ??= now + delay * 1000
    const elapsed = now - startTime
    if (elapsed >= 0) {
      const progress = Math.min(1, elapsed / (duration * 1000))
      // نحدد أي جزء من القيم نحن فيه، ونطبّق التنعيم داخله
      const position = progress * segments
      const index = Math.min(segments - 1, Math.floor(position))
      const local = ease(position - index)
      onUpdate(keyframes[index] + (keyframes[index + 1] - keyframes[index]) * local)
      if (progress >= 1) return
    }
    frameId = requestAnimationFrame(step)
  }

  frameId = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frameId)
}
