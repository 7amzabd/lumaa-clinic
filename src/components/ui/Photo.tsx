interface PhotoProps {
  /** مسار الصورة بدون الامتداد، مثل ‎/services/hydrafacial (يوجد منها ‎.webp و ‎.jpg) */
  src: string
  alt: string
  className?: string
  /** true = تُحمَّل فورًا (للصور الظاهرة مباشرة). الافتراضي: تحميل مؤجل عند الاقتراب منها */
  eager?: boolean
}

/**
 * صورة بصيغتين: WebP الخفيفة للمتصفحات الحديثة و JPG احتياطًا.
 * width و height يحجزان مكان الصورة (4:3) قبل تحميلها، فلا تقفز الصفحة.
 */
export function Photo({ src, alt, className = '', eager = false }: PhotoProps) {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img
        src={`${src}.jpg`}
        alt={alt}
        width={960}
        height={720}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
