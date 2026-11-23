import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { site } from '../../content/site'
import { useLang } from '../../i18n/useLang'
import { formatPrice } from '../../lib/format'
import { recommendService } from '../../lib/recommend'
import { useBooking } from '../../state/useBooking'
import { Button } from '../ui/Button'
import { IconArrow, IconCheck, IconClock, IconLeaf, IconSparkle } from '../ui/Icons'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * محلّل البشرة المصغّر: ثلاثة أسئلة، ثم اقتراح خدمة مع زر يختارها في نموذج الحجز.
 * الأسئلة والنقاط في site.ts (quiz)، والحساب في lib/recommend.ts
 */
export function SkinQuiz() {
  const { t, dir } = useLang()
  const { goToBooking } = useBooking()
  const { quiz } = site
  const [step, setStep] = useState(0) // رقم السؤال الحالي، أو عدد الأسئلة = النتيجة
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [direction, setDirection] = useState(1) // 1 = للأمام، -1 = للخلف (لاتجاه الانزلاق)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const timer = useRef<number>(0)

  const total = quiz.questions.length
  const finished = step >= total
  const question = quiz.questions[Math.min(step, total - 1)]

  const choose = (optionId: string) => {
    setAnswers((previous) => ({ ...previous, [question.id]: optionId }))
    // ننتقل بعد لحظة قصيرة حتى يرى الزائر اختياره
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setDirection(1)
      setStep((current) => current + 1)
    }, 260)
  }

  const back = () => {
    window.clearTimeout(timer.current)
    setDirection(-1)
    setStep((current) => Math.max(0, current - 1))
  }

  const restart = () => {
    setAnswers({})
    setDirection(-1)
    setStep(0)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // عند تغيّر الخطوة ننقل التركيز إلى عنوانها (لقارئ الشاشة ولوحة المفاتيح)
  useEffect(() => {
    if (step > 0) headingRef.current?.focus({ preventScroll: true })
  }, [step])

  // الانزلاق يتبع اتجاه القراءة
  const slide = direction * (dir === 'rtl' ? -1 : 1) * 40

  return (
    <section id="quiz" aria-labelledby="quiz-title" className="bg-sand py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading id="quiz-title" content={quiz} />
          {/* مؤشر التقدم */}
          <ol className="mt-8 flex items-center gap-2" aria-hidden="true">
            {quiz.questions.map((item, index) => (
              <li
                key={item.id}
                className={`h-1 rounded-full transition-[width,background-color] duration-500 ease-lux ${
                  index < step || finished ? 'w-10 bg-gold-deep' : index === step ? 'w-10 bg-gold' : 'w-4 bg-line'
                }`}
              />
            ))}
          </ol>
        </div>

        <Reveal delay={0.1}>
          <div className="relative min-h-[26rem] overflow-hidden rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:p-10">
            <AnimatePresence mode="wait" initial={false} custom={slide}>
              {finished ? (
                <m.div
                  key="result"
                  initial={{ opacity: 0, x: slide }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -slide, transition: { duration: 0.22, ease } }}
                  transition={{ duration: 0.5, ease }}
                >
                  <QuizResult
                    answers={answers}
                    onBook={(id) => goToBooking(id)}
                    onRestart={restart}
                    headingRef={headingRef}
                  />
                </m.div>
              ) : (
                <m.div
                  key={question.id}
                  initial={{ opacity: 0, x: slide }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -slide, transition: { duration: 0.22, ease } }}
                  transition={{ duration: 0.45, ease }}
                >
                  <p className="text-sm text-gold-deep">
                    {t(quiz.progress).replace('{current}', String(step + 1)).replace('{total}', String(total))}
                  </p>
                  <h3 ref={headingRef} tabIndex={-1} className="heading-card mt-3 focus:outline-none">
                    {t(question.question)}
                  </h3>

                  <div role="group" aria-label={t(question.question)} className="mt-7 grid gap-3 sm:grid-cols-2">
                    {question.options.map((option, index) => {
                      const selected = answers[question.id] === option.id
                      return (
                        <m.button
                          key={option.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => choose(option.id)}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 + index * 0.06, duration: 0.5, ease }}
                          className={`group flex items-center justify-between gap-4 rounded-field border px-5 py-4 text-start transition-[border-color,background-color,color,transform] duration-300 ease-lux motion-safe:hover:-translate-y-0.5 ${
                            selected
                              ? 'border-primary bg-primary text-on-primary'
                              : 'border-line bg-canvas hover:border-gold'
                          }`}
                        >
                          <span className="font-medium">{t(option.label)}</span>
                          <span
                            className={`grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                              selected ? 'border-on-primary bg-on-primary text-primary' : 'border-line group-hover:border-gold'
                            }`}
                          >
                            {selected && <IconCheck className="size-3.5" />}
                          </span>
                        </m.button>
                      )
                    })}
                  </div>

                  {step > 0 && (
                    <Button variant="ghost" onClick={back} className="mt-8 -ms-4">
                      <IconArrow className="size-4 rotate-180" />
                      {t(quiz.back)}
                    </Button>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

interface QuizResultProps {
  answers: Record<string, string>
  onBook: (serviceId: string) => void
  onRestart: () => void
  headingRef: RefObject<HTMLHeadingElement | null>
}

function QuizResult({ answers, onBook, onRestart, headingRef }: QuizResultProps) {
  const { t, lang } = useLang()
  const { quiz, services } = site
  const service = recommendService(answers)

  return (
    <div>
      <p className="eyebrow">{t(quiz.resultEyebrow)}</p>
      <h3 ref={headingRef} tabIndex={-1} className="heading-card mt-3 focus:outline-none">
        {t(quiz.resultTitle)}
      </h3>

      {/* بطاقة الخدمة المقترحة */}
      <m.div
        className="relative mt-7 overflow-hidden rounded-card bg-inverse p-6 text-on-inverse sm:p-8"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.6, ease }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -top-16 -end-16 size-48 rounded-full bg-gold/20 blur-3xl" />
        <IconSparkle className="size-4 text-gold" />
        <p className="font-heading mt-4 text-3xl leading-tight">{t(service.name)}</p>
        <p className="mt-3 text-on-inverse-soft">{t(service.description)}</p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-on-inverse/15 pt-5 text-sm">
          <div className="flex items-center gap-2">
            <IconClock className="size-4 text-gold" />
            <dt className="sr-only">{t(services.durationLabel)}</dt>
            <dd>{t(service.duration)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <IconLeaf className="size-4 text-gold" />
            <dt className="sr-only">{t(services.recoveryLabel)}</dt>
            <dd>{t(service.recovery)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-on-inverse-soft">{t(services.priceFromLabel)}</dt>
            <dd className="font-medium">{formatPrice(service.priceFrom, lang)}</dd>
          </div>
        </dl>
      </m.div>

      <p className="mt-5 text-sm text-ink-soft">{t(quiz.resultNote)}</p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={() => onBook(service.id)}>
          {t(quiz.bookCta)}
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          {t(quiz.restart)}
        </Button>
      </div>
    </div>
  )
}
