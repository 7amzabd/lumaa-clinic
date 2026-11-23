import { site } from '../content/site'
import type { Lang } from '../content/types'

/** 3200 ← "3,200" (أرقام إنجليزية في اللغتين، كما هو شائع في المواقع السعودية) */
export function formatNumber(value: number, decimals = 0) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/** 450 ← "450 ريال" أو "SAR 450" حسب priceFormat في site.ts */
export function formatPrice(value: number, lang: Lang) {
  return site.ui.priceFormat[lang].replace('{price}', formatNumber(value))
}

/** "16:00" ← "4:00 م" أو "4:00 PM" */
export function formatTime(time: string, lang: Lang) {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date(2000, 0, 1, hours, minutes)
  return new Intl.DateTimeFormat(site.locale[lang], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

/** "2026-11-08" ← "الأحد، 8 نوفمبر 2026" */
export function formatDate(isoDate: string, lang: Lang) {
  return new Intl.DateTimeFormat(site.locale[lang], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parseLocalDate(isoDate))
}

/** يحوّل "YYYY-MM-DD" إلى تاريخ محلي (بدون مشاكل فرق التوقيت) */
export function parseLocalDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** تاريخ اليوم بصيغة "YYYY-MM-DD" كما يحتاجه حقل التاريخ */
export function todayIso() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}
