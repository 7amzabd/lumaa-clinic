import { site } from '../content/site'
import type { Service } from '../content/types'

/**
 * يحسب الخدمة المقترحة من إجابات محلّل البشرة.
 * answers: { معرّف السؤال: معرّف الخيار المختار }
 * يجمع نقاط كل خيار لكل خدمة، ويرجع الخدمة ذات المجموع الأعلى.
 */
export function recommendService(answers: Record<string, string>): Service {
  const totals: Record<string, number> = {}

  for (const question of site.quiz.questions) {
    const option = question.options.find((item) => item.id === answers[question.id])
    if (!option) continue
    for (const [serviceId, score] of Object.entries(option.scores)) {
      totals[serviceId] = (totals[serviceId] ?? 0) + score
    }
  }

  const { items } = site.services
  let best = items[0]
  let bestScore = -Infinity
  for (const service of items) {
    const score = totals[service.id] ?? 0
    if (score > bestScore) {
      best = service
      bestScore = score
    }
  }
  return best
}
