import { useEffect, useRef, type MouseEvent } from 'react'
import { site } from '../../content/site'
import type { Service } from '../../content/types'
import { useLang } from '../../i18n/useLang'
import { formatPrice } from '../../lib/format'
import { Button } from './Button'
import { IconCheck, IconClock, IconClose, IconLeaf } from './Icons'
import { Photo } from './Photo'

interface ServiceDialogProps {
  /** الخدمة المعروضة، أو null إذا كانت النافذة مغلقة */
  service: Service | null
  onClose: () => void
  onBook: (serviceId: string) => void
}

/**
 * نافذة تفاصيل الخدمة: تصعد من الأسفل في الجوال، وتظهر في الوسط على الشاشات الكبيرة.
 * نستخدم عنصر <dialog> الأصلي: يحبس التركيز داخله، يُغلق بزر Esc،
 * ويعيد التركيز إلى البطاقة عند الإغلاق، كل ذلك بدون كود إضافي.
 * (شكلها وحركتها في الصنف sheet داخل global.css)
 */
export function ServiceDialog({ service, onClose, onBook }: ServiceDialogProps) {
  const { t, lang } = useLang()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { services } = site

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (service && !dialog.open) dialog.showModal()
    if (!service && dialog.open) dialog.close()
  }, [service])

  // الضغط على الخلفية المعتمة (خارج المحتوى) يغلق النافذة
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) event.currentTarget.close()
  }

  return (
    <dialog ref={dialogRef} className="sheet" aria-labelledby="service-dialog-title" onClose={onClose} onClick={onBackdropClick}>
      {service && (
        <div className="relative grid md:grid-cols-[0.95fr_1.05fr]">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={t(services.closeLabel)}
            className="absolute top-4 end-4 z-10 grid size-11 place-items-center rounded-full bg-surface/90 text-ink shadow-soft backdrop-blur-sm transition-colors duration-300 hover:bg-surface hover:text-gold-deep"
          >
            <IconClose className="size-5" />
          </button>

          {/* الصورة */}
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[32rem]">
            <Photo src={service.image} alt={t(service.imageAlt)} eager className="absolute inset-0 size-full object-cover" />
            {service.featured && (
              <span className="absolute top-5 start-5 rounded-full bg-gold px-3 py-1 text-xs font-medium text-on-orb">
                {t(services.featuredBadge)}
              </span>
            )}
          </div>

          {/* التفاصيل */}
          <div className="flex flex-col p-6 max-md:pb-0 sm:p-9">
            <p className="eyebrow">{t(services.eyebrow)}</p>
            <h2
              id="service-dialog-title"
              className="heading-card mt-3 pe-10 md:pe-0"
              style={{ fontSize: 'clamp(1.6rem, 1.3rem + 1.2vw, 2.1rem)' }}
            >
              {t(service.name)}
            </h2>
            <p className="mt-3 text-ink-soft">{t(service.description)}</p>

            {/* المدة وفترة التعافي */}
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-field bg-sand/60 p-4">
                <dt className="flex items-center gap-1.5 text-ink-soft">
                  <IconClock className="size-4 text-gold-deep" />
                  {t(services.durationLabel)}
                </dt>
                <dd className="mt-1 font-medium">{t(service.duration)}</dd>
              </div>
              <div className="rounded-field bg-sand/60 p-4">
                <dt className="flex items-center gap-1.5 text-ink-soft">
                  <IconLeaf className="size-4 text-gold-deep" />
                  {t(services.recoveryLabel)}
                </dt>
                <dd className="mt-1 font-medium">{t(service.recovery)}</dd>
              </div>
            </dl>

            {/* ماذا تشمل الجلسة */}
            <h3 className="mt-7 text-sm font-medium text-gold-deep">{t(services.includesTitle)}</h3>
            <ul className="mt-3 space-y-2.5">
              {service.includes.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-sand text-gold-deep">
                    <IconCheck className="size-3" />
                  </span>
                  {t(item)}
                </li>
              ))}
            </ul>

            <p className="mt-6 mb-8 text-sm">
              <span className="text-ink-soft">{t(services.idealForLabel)} </span>
              {t(service.idealFor)}
            </p>

            {/* السعر وزر الحجز */}
            {/* في الجوال يبقى هذا الشريط ملتصقًا بأسفل النافذة، فيظل زر الحجز ظاهرًا أثناء القراءة */}
            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line bg-surface pt-5 max-md:sticky max-md:bottom-0 max-md:-mx-6 max-md:px-6 max-md:pb-5 md:pt-6">
              <p>
                <span className="block text-xs text-ink-soft">{t(services.priceFromLabel)}</span>
                <span className="font-heading text-3xl leading-tight">{formatPrice(service.priceFrom, lang)}</span>
              </p>
              <Button
                size="lg"
                onClick={() => {
                  dialogRef.current?.close()
                  onBook(service.id)
                }}
              >
                {t(services.bookThisLabel)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
