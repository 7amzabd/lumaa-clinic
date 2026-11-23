/**
 * أنواع البيانات (Types) لملف المحتوى site.ts
 * ------------------------------------------------------------
 * هذا الملف يصف "شكل" البيانات فقط، ولا تحتاج لتعديله عادةً.
 * إذا نسيت حقلًا أو كتبته خطأ في site.ts، سيظهر لك TypeScript
 * خطأً واضحًا في المحرر قبل أن يصل الخطأ إلى الموقع.
 */

export type Lang = 'ar' | 'en'

/** نص بلغتين: { ar: 'نص عربي', en: 'English text' } */
export type Localized<T = string> = Record<Lang, T>

/** معرّفات الأقسام، وتُستخدم في الروابط مثل ‎#services */
export type SectionId =
  | 'top'
  | 'services'
  | 'quiz'
  | 'why'
  | 'journey'
  | 'results'
  | 'team'
  | 'testimonials'
  | 'booking'
  | 'faq'

export interface NavLink {
  id: SectionId
  label: Localized
}

/** عنوان أي قسم: سطر صغير فوق العنوان + العنوان + وصف اختياري */
export interface SectionIntro {
  eyebrow: Localized
  title: Localized
  intro?: Localized
}

export interface Stat {
  value: number
  /** عدد الخانات العشرية (مثل 4.9) */
  decimals?: number
  /** يضيف + بعد الرقم (مثل ‎3,200+) */
  plus?: boolean
  /** وحدة تظهر بعد الرقم (مثل: دقيقة) */
  unit?: Localized
  icon?: 'star'
  label: Localized
}

export interface Service {
  /** معرّف ثابت بالإنجليزية بدون مسافات، يربط البطاقة بنموذج الحجز */
  id: string
  name: Localized
  description: Localized
  duration: Localized
  recovery: Localized
  /** السعر بالأرقام فقط، ويُنسَّق تلقائيًا حسب اللغة */
  priceFrom: number
  /** true = بطاقة مميزة عليها شارة «الأكثر طلبًا» */
  featured?: boolean
}

export type WhyIcon = 'shield' | 'users' | 'document' | 'clock' | 'leaf' | 'sparkle'

export interface WhyItem {
  icon: WhyIcon
  title: Localized
  text: Localized
  /** رقم كبير اختياري يظهر في البطاقة (مثل 48 مع وحدة «ساعة») */
  stat?: { value: number; unit?: Localized; plus?: boolean }
  /** large = بطاقة تأخذ عمودين */
  size?: 'large'
}

export interface QuizOption {
  id: string
  label: Localized
  /** نقاط لكل خدمة (معرّفها من services.items). الأعلى مجموعًا هي الخدمة المقترحة */
  scores: Record<string, number>
}

export interface QuizQuestion {
  id: string
  question: Localized
  options: QuizOption[]
}

export interface JourneyStep {
  title: Localized
  description: Localized
  /** true = يعرض دوائر درجات البشرة الست (مقياس فيتزباتريك) تحت الخطوة */
  skinScale?: boolean
}

export interface TeamMember {
  /** الحرف الذي يظهر في الدائرة بدل الصورة */
  initial: Localized
  name: Localized
  role: Localized
  experience: Localized
  focus: Localized
}

export interface Testimonial {
  quote: Localized
  name: Localized
  city: Localized
  service: Localized
}

export interface FaqItem {
  question: Localized
  answer: Localized
}

export type SocialIcon = 'whatsapp' | 'instagram' | 'snapchat' | 'tiktok'

export interface SocialLink {
  icon: SocialIcon
  label: Localized
  href: string
}

export interface FieldText {
  label: Localized
  placeholder?: Localized
  hint?: Localized
}

/** أسماء رسائل الخطأ في نموذج الحجز */
export type BookingErrorKey =
  | 'nameRequired'
  | 'nameShort'
  | 'phoneRequired'
  | 'phoneInvalid'
  | 'serviceRequired'
  | 'dateRequired'
  | 'datePast'
  | 'dateClosed'
  | 'timeRequired'
  | 'timePast'

/** الشكل الكامل لملف المحتوى */
export interface SiteContent {
  meta: {
    siteUrl: string
    noIndex: boolean
    title: Localized
    description: Localized
    ogImageAlt: Localized
  }
  brand: {
    name: Localized
    whatsappNumber: string
    phoneDisplay: string
  }
  /** إعدادات تنسيق التاريخ والوقت لكل لغة */
  locale: Localized
  ui: {
    skipToContent: Localized
    switchLanguage: Localized
    languageToggle: Localized
    switchToDark: Localized
    switchToLight: Localized
    previousMonth: Localized
    nextMonth: Localized
    closedDay: Localized
    openMenu: Localized
    closeMenu: Localized
    mainNav: Localized
    homeLink: Localized
    bookNow: Localized
    bookConsultation: Localized
    /** شكل السعر، و {price} يُستبدل بالرقم */
    priceFormat: Localized
  }
  nav: NavLink[]
  hero: {
    eyebrow: Localized
    /** العنوان مقسوم: الجزء العادي + الكلمة التي تلمع */
    titleStart: Localized
    titleShine: Localized
    description: Localized
    primaryCta: Localized
    secondaryCta: Localized
    floatingCards: [Localized, Localized]
    /** الشارة الصغيرة أعلى لوحة البشرة (مثل: تحليل البشرة) */
    panelLabel: Localized
    /** تلميح صغير تحت اللوحة (يظهر على الأجهزة التي فيها ماوس) */
    panelHint: Localized
    /** وصف اللوحة لقارئ الشاشة */
    panelAlt: Localized
    stats: Stat[]
  }
  services: SectionIntro & {
    featuredBadge: Localized
    durationLabel: Localized
    recoveryLabel: Localized
    priceFromLabel: Localized
    bookLabel: Localized
    items: Service[]
  }
  why: SectionIntro & {
    items: WhyItem[]
  }
  quiz: SectionIntro & {
    questions: QuizQuestion[]
    /** "{current} من {total}" */
    progress: Localized
    back: Localized
    resultEyebrow: Localized
    resultTitle: Localized
    resultNote: Localized
    bookCta: Localized
    restart: Localized
  }
  journey: SectionIntro & {
    steps: JourneyStep[]
  }
  results: SectionIntro & {
    beforeLabel: Localized
    afterLabel: Localized
    caption: Localized
    sliderLabel: Localized
    canvasAlt: Localized
    highlights: Localized[]
  }
  team: SectionIntro & {
    members: TeamMember[]
  }
  testimonials: SectionIntro & {
    items: Testimonial[]
  }
  booking: SectionIntro & {
    fields: {
      name: FieldText
      phone: FieldText
      service: FieldText
      date: FieldText
      time: FieldText
      notes: FieldText
    }
    optional: Localized
    consultationOption: Localized
    /** أوقات المواعيد بصيغة 24 ساعة، وتُعرض تلقائيًا بصيغة 12 ساعة */
    timeSlots: string[]
    /** أيام الإغلاق: 0 = الأحد ... 5 = الجمعة، 6 = السبت */
    closedDays: number[]
    submit: Localized
    errorSummary: Localized
    errors: Record<BookingErrorKey, Localized>
    whatsappMessage: {
      intro: Localized
      name: Localized
      phone: Localized
      service: Localized
      date: Localized
      time: Localized
      notes: Localized
    }
    success: {
      title: Localized
      text: Localized
      fallback: Localized
      newBooking: Localized
    }
    info: {
      hoursLabel: Localized
      days: Localized
      hours: Localized
      closed: Localized
      addressLabel: Localized
      address: Localized
      whatsappLabel: Localized
      note: Localized
    }
  }
  faq: SectionIntro & {
    items: FaqItem[]
    contactPrompt: Localized
    contactCta: Localized
  }
  footer: {
    about: Localized
    linksTitle: Localized
    contactTitle: Localized
    socials: SocialLink[]
    demoNote: Localized
    credit: Localized
    creditHandle: string
    creditHref: string
    rights: Localized
  }
}
