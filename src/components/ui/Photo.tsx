interface PhotoProps {
  /** مسار الصورة بدون الامتداد، مثل ‎/services/hydrafacial (يوجد منها ‎.webp و ‎.jpg) */
  src: string
  alt: string
  className?: string
  /** true = تُحمَّل فورًا (للصور الظاهرة مباشرة). الافتراضي: تحميل مؤجل عند الاقتراب منها */
  eager?: boolean
  /** أبعاد الصورة الأصلية (الافتراضي 960×720 لصور الخدمات) */
  width?: number
  height?: number
}

/**
 * صورة بصيغتين: WebP الخفيفة للمتصفحات الحديثة و JPG احتياطًا.
 * width و height يحجزان مكان الصورة قبل تحميلها، فلا تقفز الصفحة.
 */
export function Photo({ src, alt, className = '', eager = false, width = 960, height = 720 }: PhotoProps) {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img
        src={`${src}.jpg`}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
