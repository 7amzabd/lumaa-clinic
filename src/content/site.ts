import type { SiteContent } from './types.ts'

/**
 * ============================================================
 *  ملف المحتوى: كل نصوص الموقع وأسعاره وبياناته هنا
 * ============================================================
 *  - كل نص مكتوب بلغتين:  { ar: 'العربي', en: 'English' }
 *  - عدّل هنا فقط، ولا تحتاج إلى لمس أي مكوّن.
 *  - الأسعار أرقام عادية (450 وليس '450 ريال')، والموقع ينسّقها.
 *  - لإضافة خدمة أو سؤال أو رأي: انسخ عنصرًا موجودًا وعدّل قيمه.
 */
export const site: SiteContent = {
  // ─── بيانات الصفحة لمحركات البحث والمشاركة على واتساب وتويتر ───
  meta: {
    siteUrl: 'https://lumaa-clinic.vercel.app', // غيّره إلى رابط موقعك بعد النشر (بدون / في النهاية)
    noIndex: true, // true = لا تظهر الصفحة في نتائج البحث (مناسب لعيادة وهمية). اجعلها false لعيادة حقيقية
    title: {
      ar: 'لُمعة | عيادة عناية بالبشرة في جدة',
      en: 'Lumaa | Skin Care Clinic in Jeddah',
    },
    description: {
      ar: 'لُمعة عيادة عناية بالبشرة في جدة: هيدرافيشل، تقشير كيميائي، علاج حب الشباب والتصبغات، وخطة واضحة قبل أي التزام. احجز استشارتك المجانية.',
      en: 'Lumaa is a skin care clinic in Jeddah: HydraFacial, chemical peels, acne and pigmentation treatments, with a clear plan before any commitment. Book your free consultation.',
    },
    ogImageAlt: {
      ar: 'شعار لُمعة مع عبارة: بشرتك تستحق أن تلمع',
      en: 'Lumaa logo with the line: Your skin deserves to glow',
    },
  },

  // ─── هوية العيادة ───
  brand: {
    name: { ar: 'لُمعة', en: 'Lumaa' },
    whatsappNumber: '966500000000', // رقم وهمي. اكتبه بالصيغة الدولية بدون + وبدون مسافات
    phoneDisplay: '+966 50 000 0000', // الشكل الذي يظهر للزائر
  },

  // تنسيق التاريخ والوقت: تقويم ميلادي وأرقام إنجليزية في العربي
  locale: { ar: 'ar-SA-u-ca-gregory-nu-latn', en: 'en-US' },

  // ─── نصوص عامة في الواجهة ───
  ui: {
    skipToContent: { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' },
    switchLanguage: { ar: 'التبديل إلى الإنجليزية', en: 'Switch to Arabic' },
    languageToggle: { ar: 'EN', en: 'عربي' },
    switchToDark: { ar: 'التبديل إلى الوضع الداكن', en: 'Switch to dark mode' },
    switchToLight: { ar: 'التبديل إلى الوضع الفاتح', en: 'Switch to light mode' },
    previousMonth: { ar: 'الشهر السابق', en: 'Previous month' },
    nextMonth: { ar: 'الشهر التالي', en: 'Next month' },
    closedDay: { ar: 'مغلق', en: 'Closed' },
    whatsappChat: { ar: 'تواصل معنا على واتساب', en: 'Chat with us on WhatsApp' },
    ratingLabel: { ar: 'التقييم: 5 من 5', en: 'Rating: 5 out of 5' },
    openMenu: { ar: 'فتح القائمة', en: 'Open menu' },
    closeMenu: { ar: 'إغلاق القائمة', en: 'Close menu' },
    mainNav: { ar: 'روابط الأقسام', en: 'Sections' },
    homeLink: { ar: 'لُمعة: أعلى الصفحة', en: 'Lumaa: back to top' },
    bookNow: { ar: 'احجز موعدك', en: 'Book now' },
    bookConsultation: { ar: 'احجز استشارة مجانية', en: 'Book a free consultation' },
    priceFormat: { ar: '{price} ريال', en: 'SAR {price}' },
  },

  // ─── روابط الشريط العلوي (بالترتيب) ───
  nav: [
    { id: 'services', label: { ar: 'الخدمات', en: 'Services' } },
    { id: 'journey', label: { ar: 'رحلتك معنا', en: 'Your journey' } },
    { id: 'results', label: { ar: 'النتائج', en: 'Results' } },
    { id: 'team', label: { ar: 'الفريق', en: 'Team' } },
    { id: 'testimonials', label: { ar: 'الآراء', en: 'Reviews' } },
    { id: 'faq', label: { ar: 'الأسئلة', en: 'FAQ' } },
  ],

  // ─── 1) الرئيسية ───
  hero: {
    eyebrow: { ar: 'عيادة عناية بالبشرة · جدة', en: 'Skin care clinic · Jeddah' },
    titleStart: { ar: 'بشرتك تستحق أن', en: 'Your skin deserves to' },
    titleShine: { ar: 'تلمع', en: 'glow' },
    description: {
      ar: 'جلسات مصممة لبشرتك أنت: تحليل دقيق، وخطة مكتوبة قبل أي التزام، وأخصائيات يهتممن بأدق التفاصيل.',
      en: 'Treatments designed around your skin: a precise analysis, a written plan before any commitment, and specialists who care about every detail.',
    },
    primaryCta: { ar: 'احجز استشارة مجانية', en: 'Book a free consultation' },
    secondaryCta: { ar: 'شاهد الخدمات', en: 'View services' },
    floatingCards: [
      { ar: 'هيدرافيشل · 60 دقيقة', en: 'HydraFacial · 60 min' },
      { ar: 'بدون فترة تعافي', en: 'No downtime' },
    ],
    panelLabel: { ar: 'تحليل البشرة · مباشر', en: 'Skin analysis · live' },
    panelHint: { ar: 'حرّكي الماوس فوق الوجه', en: 'Move your mouse over the face' },
    panelAlt: {
      ar: 'رسم لوجه امرأة مع عدسة تكبير تُظهر البشرة قبل العلاج (رؤوس سوداء ونتوءات) وبعده (صافية ولامعة)',
      en: 'Illustration of a woman’s face with a magnifying lens showing the skin before treatment (blackheads and bumps) and after (clear and glowing)',
    },
    stats: [
      { value: 4.9, decimals: 1, icon: 'star', label: { ar: 'تقييم العميلات', en: 'Client rating' } },
      { value: 3200, plus: true, label: { ar: 'جلسة منجزة', en: 'Sessions completed' } },
      {
        value: 15,
        unit: { ar: 'دقيقة', en: 'min' },
        label: { ar: 'استشارة مجانية', en: 'Free consultation' },
      },
    ],
  },

  // ─── 2) الخدمات ───
  services: {
    eyebrow: { ar: 'الخدمات', en: 'Services' },
    title: { ar: 'علاجات مختارة بعناية لكل بشرة', en: 'Treatments chosen with care, for every skin' },
    intro: {
      ar: 'كل خدمة تبدأ بتحليل بشرتك، والأسعار واضحة من البداية.',
      en: 'Every treatment starts with a skin analysis, and prices are clear from day one.',
    },
    featuredBadge: { ar: 'الأكثر طلبًا', en: 'Most loved' },
    durationLabel: { ar: 'المدة', en: 'Duration' },
    recoveryLabel: { ar: 'فترة التعافي', en: 'Downtime' },
    priceFromLabel: { ar: 'يبدأ من', en: 'From' },
    bookLabel: { ar: 'احجز', en: 'Book' },
    detailsLabel: { ar: 'التفاصيل', en: 'Details' },
    includesTitle: { ar: 'ماذا تشمل الجلسة', en: 'What the session includes' },
    idealForLabel: { ar: 'مناسبة لـ', en: 'Ideal for' },
    bookThisLabel: { ar: 'احجز هذه الخدمة', en: 'Book this treatment' },
    closeLabel: { ar: 'إغلاق', en: 'Close' },
    // لكل خدمة صورة بنسبة 4:3 في public/services بصيغتين: ‎.webp و ‎.jpg (اكتب المسار بدون الامتداد)
    items: [
      {
        id: 'hydrafacial',
        featured: true,
        name: { ar: 'هيدرافيشل', en: 'HydraFacial' },
        description: {
          ar: 'تنظيف عميق وتقشير لطيف وترطيب مكثف في جلسة واحدة، لبشرة نضرة من أول مرة.',
          en: 'Deep cleansing, gentle exfoliation and intense hydration in one session, for fresh skin from the very first visit.',
        },
        duration: { ar: '60 دقيقة', en: '60 min' },
        recovery: { ar: 'بدون تعافي', en: 'None' },
        priceFrom: 450,
        image: '/services/hydrafacial',
        imageAlt: { ar: 'أخصائية تمرر جهاز الهيدرافيشل على خد عميلة ببشرة ندية', en: 'An aesthetician gliding a HydraFacial wand over a client’s dewy cheek' },
        includes: [
          { ar: 'تنظيف عميق وشفط لطيف للرؤوس السوداء', en: 'Deep cleansing and gentle blackhead extraction' },
          { ar: 'تقشير خفيف بأحماض الفواكه', en: 'A light fruit-acid exfoliation' },
          { ar: 'سيروم ترطيب بحمض الهيالورونيك', en: 'Hyaluronic acid hydration serum' },
          { ar: 'ماسك مهدئ وواقي شمس', en: 'A calming mask and sunscreen' },
        ],
        idealFor: { ar: 'كل أنواع البشرة، خصوصًا الباهتة والمجهدة', en: 'All skin types, especially dull and tired skin' },
      },
      {
        id: 'chemical-peel',
        name: { ar: 'التقشير الكيميائي', en: 'Chemical peel' },
        description: {
          ar: 'أحماض مختارة حسب نوع بشرتك، تجدد الطبقة السطحية وتوحّد الملمس واللون.',
          en: 'Acids selected for your skin type that renew the surface layer and even out texture and tone.',
        },
        duration: { ar: '45 دقيقة', en: '45 min' },
        recovery: { ar: '3 إلى 5 أيام', en: '3 to 5 days' },
        priceFrom: 380,
        image: '/services/chemical-peel',
        imageAlt: { ar: 'أخصائية تضع محلول التقشير بفرشاة ناعمة على جبهة عميلة', en: 'An aesthetician applying a peel solution with a soft brush on a client’s forehead' },
        includes: [
          { ar: 'تحليل البشرة واختيار نوع الحمض المناسب', en: 'Skin analysis and choosing the right acid' },
          { ar: 'تنظيف وتحضير البشرة', en: 'Cleansing and prepping the skin' },
          { ar: 'تطبيق التقشير ثم معادلته', en: 'Applying the peel, then neutralising it' },
          { ar: 'كريم مهدئ وتعليمات العناية في البيت', en: 'A soothing cream and home-care instructions' },
        ],
        idealFor: { ar: 'البشرة الدهنية والمختلطة والمسام الواسعة', en: 'Oily and combination skin and large pores' },
      },
      {
        id: 'acne',
        name: { ar: 'علاج حب الشباب وآثاره', en: 'Acne & acne scars' },
        description: {
          ar: 'خطة متكاملة تهدّئ الالتهاب وتقلل الحبوب، ثم تعالج الآثار والندبات تدريجيًا.',
          en: 'A complete plan that calms inflammation and reduces breakouts, then gradually treats marks and scars.',
        },
        duration: { ar: 'خطة 6 جلسات', en: '6-session plan' },
        recovery: { ar: 'يوم إلى يومين', en: '1 to 2 days' },
        priceFrom: 1800,
        image: '/services/acne',
        imageAlt: { ar: 'يد أخصائية تضع علاجًا موضعيًا بعود قطني على خد فيه حبوب خفيفة', en: 'A specialist’s hand applying a spot treatment with a cotton swab on a cheek with mild blemishes' },
        includes: [
          { ar: 'تقييم طبي وخطة مكتوبة من الجلسة الأولى', en: 'A medical assessment and a written plan from session one' },
          { ar: 'جلسات تنظيف عميق وتقشير علاجي', en: 'Deep cleansing and therapeutic peel sessions' },
          { ar: 'علاج الآثار والندبات في المراحل الأخيرة', en: 'Treating marks and scars in the later stages' },
          { ar: 'روتين منزلي ومتابعة بين الجلسات', en: 'A home routine and follow-up between sessions' },
        ],
        idealFor: { ar: 'حب الشباب النشط وآثاره', en: 'Active acne and the marks it leaves' },
      },
      {
        id: 'pigmentation',
        name: { ar: 'علاج التصبغات والكلف', en: 'Pigmentation & melasma' },
        description: {
          ar: 'بروتوكول يستهدف البقع الداكنة والكلف بأمان، مع خطة وقاية تحافظ على النتيجة.',
          en: 'A protocol that safely targets dark spots and melasma, with a prevention plan that keeps results lasting.',
        },
        duration: { ar: '50 دقيقة', en: '50 min' },
        recovery: { ar: 'يوم واحد', en: '1 day' },
        priceFrom: 520,
        image: '/services/pigmentation',
        imageAlt: { ar: 'جهاز ليزر يعالج بقعة على خد عميلة تضع واقي عينين', en: 'A laser handpiece treating a spot on the cheek of a client wearing eye shields' },
        includes: [
          { ar: 'تحديد نوع التصبغ وعمقه', en: 'Identifying the pigmentation type and depth' },
          { ar: 'جلسة علاج موضعي للبقع', en: 'A targeted spot-treatment session' },
          { ar: 'سيروم تفتيح ومهدئ بعد الجلسة', en: 'A brightening, soothing serum afterwards' },
          { ar: 'خطة وقاية وواقي شمس مناسب', en: 'A prevention plan and the right sunscreen' },
        ],
        idealFor: { ar: 'الكلف والبقع الداكنة وآثار الشمس', en: 'Melasma, dark spots and sun damage' },
      },
      {
        id: 'mesotherapy',
        name: { ar: 'ميزوثيرابي النضارة', en: 'Glow mesotherapy' },
        description: {
          ar: 'حقن دقيقة بالفيتامينات وحمض الهيالورونيك تمنح البشرة إشراقة وامتلاءً طبيعيًا.',
          en: 'Micro-injections of vitamins and hyaluronic acid that give skin natural radiance and bounce.',
        },
        duration: { ar: '40 دقيقة', en: '40 min' },
        recovery: { ar: 'يوم واحد', en: '1 day' },
        priceFrom: 650,
        image: '/services/mesotherapy',
        imageAlt: { ar: 'أمبولات سيروم ذهبية وجهاز عناية على صينية رخامية', en: 'Golden serum ampoules and a skincare device on a marble tray' },
        includes: [
          { ar: 'كريم مخدر موضعي قبل الجلسة', en: 'Topical numbing cream before the session' },
          { ar: 'حقن دقيقة بكوكتيل فيتامينات وحمض الهيالورونيك', en: 'Micro-injections of a vitamin and hyaluronic acid cocktail' },
          { ar: 'ماسك مهدئ بعد الجلسة', en: 'A calming mask afterwards' },
          { ar: 'تعليمات العناية لأول 24 ساعة', en: 'Care instructions for the first 24 hours' },
        ],
        idealFor: { ar: 'البشرة الجافة والباهتة وفاقدة الحيوية', en: 'Dry, dull skin that has lost its bounce' },
      },
      {
        id: 'event-glow',
        name: { ar: 'جلسة الإشراقة قبل المناسبات', en: 'Pre-event glow session' },
        description: {
          ar: 'جلسة مكثفة تجمع التنظيف والترطيب والتفتيح، لتظهر بشرتك في أجمل حالاتها.',
          en: 'An intensive session combining cleansing, hydration and brightening, so your skin looks its very best.',
        },
        duration: { ar: '75 دقيقة', en: '75 min' },
        recovery: { ar: 'بدون تعافي', en: 'None' },
        priceFrom: 550,
        image: '/services/event-glow',
        imageAlt: { ar: 'أخصائية تضع ماسكًا ذهبيًا بفرشاة على خد عميلة', en: 'An aesthetician brushing a gold mask onto a client’s cheek' },
        includes: [
          { ar: 'تنظيف عميق وتقشير خفيف', en: 'Deep cleansing and a light exfoliation' },
          { ar: 'ماسك ذهبي للإشراقة', en: 'A gold radiance mask' },
          { ar: 'تدليك ينشّط الدورة الدموية', en: 'A massage that boosts circulation' },
          { ar: 'سيروم لمعان وترطيب', en: 'A glow and hydration serum' },
        ],
        idealFor: { ar: 'قبل المناسبات بيومين إلى ثلاثة', en: 'Two to three days before an occasion' },
      },
    ],
  },

  // ─── لماذا لُمعة: شبكة بطاقات غير متماثلة ───
  // size: 'large' تجعل البطاقة بعرض عمودين. stat رقم كبير اختياري.
  why: {
    eyebrow: { ar: 'لماذا لُمعة', en: 'Why Lumaa' },
    title: { ar: 'تفاصيل صغيرة تصنع الفرق', en: 'Small details that make the difference' },
    items: [
      {
        icon: 'document',
        size: 'large',
        title: { ar: 'خطة مكتوبة قبل أي التزام', en: 'A written plan before any commitment' },
        text: {
          ar: 'تعرفين عدد الجلسات والتكلفة الكاملة قبل أن تدفعي ريالًا واحدًا، بلا مفاجآت في منتصف الطريق.',
          en: 'You know the number of sessions and the full cost before paying a single riyal, with no surprises halfway through.',
        },
      },
      {
        icon: 'clock',
        title: { ar: 'متابعة بعد الجلسة', en: 'Follow-up after every session' },
        text: { ar: 'نطمئن على بشرتك بعد كل جلسة.', en: 'We check on your skin after every visit.' },
        stat: { value: 48, unit: { ar: 'ساعة', en: 'hours' } },
      },
      {
        icon: 'shield',
        title: { ar: 'أجهزة ومنتجات معتمدة', en: 'Approved devices and products' },
        text: { ar: 'أجهزة مرخّصة من هيئة الغذاء والدواء ومنتجات طبية.', en: 'Devices licensed by the SFDA and medical-grade products.' },
      },
      {
        icon: 'users',
        title: { ar: 'فريق نسائي بالكامل', en: 'An all-female team' },
        text: { ar: 'خصوصية تامة من الاستقبال إلى غرفة الجلسة.', en: 'Complete privacy from reception to treatment room.' },
      },
      {
        icon: 'sparkle',
        title: { ar: 'رضا العميلات', en: 'Client satisfaction' },
        text: { ar: 'نسبة من يعدن إلينا بعد أول خطة علاج.', en: 'The share of clients who return after their first plan.' },
        stat: { value: 96, unit: { ar: '%', en: '%' } },
      },
    ],
  },

  // ─── محلّل البشرة المصغّر: 3 أسئلة تقترح الخدمة المناسبة ───
  // كل خيار يعطي نقاطًا لخدمات معيّنة (بمعرّفاتها من services.items)،
  // والخدمة ذات المجموع الأعلى هي المقترحة. أرقام سالبة تستبعد خدمة.
  quiz: {
    eyebrow: { ar: 'محلّل البشرة', en: 'Skin analyser' },
    title: { ar: 'أي علاج يناسب بشرتك؟', en: 'Which treatment suits your skin?' },
    intro: {
      ar: 'ثلاثة أسئلة سريعة، ونقترح عليك نقطة البداية المناسبة.',
      en: 'Three quick questions, and we will suggest the right place to start.',
    },
    progress: { ar: '{current} من {total}', en: '{current} of {total}' },
    back: { ar: 'رجوع', en: 'Back' },
    resultEyebrow: { ar: 'نقترح لك', en: 'We suggest' },
    resultTitle: { ar: 'نقطة البداية المناسبة لك', en: 'Your ideal starting point' },
    resultNote: {
      ar: 'هذا اقتراح أولي، والخطة النهائية تُحدَّد بعد تحليل البشرة في الاستشارة المجانية.',
      en: 'This is an initial suggestion. Your final plan is set after a skin analysis in the free consultation.',
    },
    bookCta: { ar: 'احجز هذه الخدمة', en: 'Book this treatment' },
    restart: { ar: 'أعد الاختبار', en: 'Start over' },
    questions: [
      {
        id: 'concern',
        question: { ar: 'ما أكثر ما يشغلك في بشرتك؟', en: 'What concerns you most about your skin?' },
        options: [
          { id: 'spots', label: { ar: 'بقع داكنة أو كلف', en: 'Dark spots or melasma' }, scores: { pigmentation: 3, 'chemical-peel': 1 } },
          { id: 'acne', label: { ar: 'حبوب وآثارها', en: 'Breakouts and their marks' }, scores: { acne: 3, 'chemical-peel': 1 } },
          { id: 'dull', label: { ar: 'جفاف وبهتان', en: 'Dryness and dullness' }, scores: { hydrafacial: 3, mesotherapy: 2 } },
          { id: 'texture', label: { ar: 'مسام واسعة وملمس خشن', en: 'Large pores and rough texture' }, scores: { 'chemical-peel': 3, hydrafacial: 1 } },
          { id: 'glow', label: { ar: 'أريد إشراقة عامة فقط', en: 'I just want an overall glow' }, scores: { 'event-glow': 2, hydrafacial: 2 } },
        ],
      },
      {
        id: 'type',
        question: { ar: 'كيف تصفين بشرتك؟', en: 'How would you describe your skin?' },
        options: [
          { id: 'oily', label: { ar: 'دهنية', en: 'Oily' }, scores: { 'chemical-peel': 1, hydrafacial: 1 } },
          { id: 'dry', label: { ar: 'جافة', en: 'Dry' }, scores: { mesotherapy: 1, hydrafacial: 1 } },
          { id: 'combo', label: { ar: 'مختلطة', en: 'Combination' }, scores: { hydrafacial: 1 } },
          { id: 'sensitive', label: { ar: 'حساسة', en: 'Sensitive' }, scores: { hydrafacial: 1, 'chemical-peel': -2 } },
        ],
      },
      {
        id: 'timing',
        question: { ar: 'ما وقتك المتاح للتعافي؟', en: 'How much downtime can you afford?' },
        options: [
          { id: 'event', label: { ar: 'عندي مناسبة خلال أيام', en: 'I have an event in a few days' }, scores: { 'event-glow': 3, hydrafacial: 1, 'chemical-peel': -3, acne: -2 } },
          { id: 'none', label: { ar: 'لا أريد أي فترة تعافي', en: 'No downtime at all' }, scores: { hydrafacial: 2, 'event-glow': 1, 'chemical-peel': -3 } },
          { id: 'flexible', label: { ar: 'أتحمل أيامًا قليلة لنتيجة دائمة', en: 'A few days is fine for lasting results' }, scores: { pigmentation: 1, acne: 1, 'chemical-peel': 1 } },
        ],
      },
    ],
  },

  // ─── 3) رحلتك معنا ───
  journey: {
    eyebrow: { ar: 'رحلتك معنا', en: 'Your journey' },
    title: { ar: 'خمس خطوات واضحة، بلا مفاجآت', en: 'Five clear steps, no surprises' },
    intro: {
      ar: 'نؤمن أن الثقة تبدأ بالوضوح، لذلك تعرف كل شيء قبل أن تبدأ.',
      en: 'We believe trust starts with clarity, so you know everything before you begin.',
    },
    steps: [
      {
        title: { ar: 'الاستشارة', en: 'Consultation' },
        description: {
          ar: 'نستمع لهدفك وتاريخ بشرتك، ونجيب عن كل أسئلتك في استشارة مجانية مدتها 15 دقيقة.',
          en: 'We listen to your goals and skin history and answer every question in a free 15-minute consultation.',
        },
      },
      {
        skinScale: true,
        title: { ar: 'تحليل البشرة', en: 'Skin analysis' },
        description: {
          ar: 'نقيس الرطوبة والدهون والحساسية، ونحدد نوع بشرتك حسب مقياس فيتزباتريك لاختيار العلاج الآمن لها.',
          en: 'We measure hydration, oil and sensitivity, and identify your skin type on the Fitzpatrick scale to choose a safe treatment.',
        },
      },
      {
        title: { ar: 'خطة مكتوبة', en: 'A written plan' },
        description: {
          ar: 'تصلك خطة واضحة بعدد الجلسات وتكلفتها الكاملة قبل أي التزام.',
          en: 'You receive a clear plan with the number of sessions and the full cost before any commitment.',
        },
      },
      {
        title: { ar: 'الجلسة', en: 'The session' },
        description: {
          ar: 'جلسة هادئة بأجهزة معقمة ومنتجات طبية، مع شرح كل خطوة أثناء العلاج.',
          en: 'A calm session with sterilised devices and medical-grade products, with every step explained along the way.',
        },
      },
      {
        title: { ar: 'المتابعة', en: 'Follow-up' },
        description: {
          ar: 'نتواصل معك بعد 48 ساعة للاطمئنان على بشرتك وتعديل روتين العناية إن لزم.',
          en: 'We check in after 48 hours to see how your skin is doing and adjust your routine if needed.',
        },
      },
    ],
  },

  // ─── 4) النتائج (قبل وبعد) ───
  results: {
    eyebrow: { ar: 'النتائج', en: 'Results' },
    title: { ar: 'الفرق يظهر في التفاصيل', en: 'The difference is in the details' },
    intro: {
      ar: 'اسحب الشريط لترى كيف تتحسن البشرة بعد خطة علاج التصبغات والاحمرار.',
      en: 'Drag the slider to see how skin improves after a pigmentation and redness plan.',
    },
    beforeLabel: { ar: 'قبل', en: 'Before' },
    afterLabel: { ar: 'بعد', en: 'After' },
    caption: { ar: 'صورة توضيحية', en: 'Illustrative image' },
    sliderLabel: { ar: 'شريط المقارنة بين قبل وبعد', en: 'Before and after comparison slider' },
    canvasAlt: {
      ar: 'رسم توضيحي لبشرة قبل العلاج فيها بقع تصبغ واحمرار ومسام واضحة، وبعد العلاج ناعمة ومشرقة',
      en: 'Illustration of skin before treatment with dark spots, redness and visible pores, and after treatment smooth and radiant',
    },
    highlights: [
      { ar: 'تفتيح البقع الداكنة وتوحيد اللون', en: 'Lighter dark spots and a more even tone' },
      { ar: 'تهدئة الاحمرار', en: 'Calmer, less red skin' },
      { ar: 'مسام أصغر وملمس أنعم', en: 'Smaller pores and smoother texture' },
    ],
  },

  // ─── 5) الفريق ───
  team: {
    eyebrow: { ar: 'الفريق', en: 'Our team' },
    title: { ar: 'أخصائيات يفهمن بشرتك', en: 'Specialists who understand your skin' },
    intro: {
      ar: 'فريق نسائي بالكامل، بخبرة مجتمعة تتجاوز 25 سنة.',
      en: 'An all-female team with more than 25 years of combined experience.',
    },
    members: [
      {
        initial: { ar: 'ر', en: 'R' },
        name: { ar: 'د. ريم العتيبي', en: 'Dr. Reem Al-Otaibi' },
        role: { ar: 'استشارية جلدية', en: 'Consultant dermatologist' },
        experience: { ar: '12 سنة خبرة', en: '12 years of experience' },
        focus: { ar: 'حب الشباب والبشرة الحساسة', en: 'Acne and sensitive skin' },
      },
      {
        initial: { ar: 'ن', en: 'N' },
        name: { ar: 'د. نورة الحربي', en: 'Dr. Noura Al-Harbi' },
        role: { ar: 'أخصائية ليزر وتصبغات', en: 'Laser & pigmentation specialist' },
        experience: { ar: '8 سنوات خبرة', en: '8 years of experience' },
        focus: { ar: 'الكلف وتوحيد لون البشرة', en: 'Melasma and even skin tone' },
      },
      {
        initial: { ar: 'ل', en: 'L' },
        name: { ar: 'لينا حداد', en: 'Lina Haddad' },
        role: { ar: 'أخصائية عناية بالبشرة', en: 'Skin care specialist' },
        experience: { ar: '6 سنوات خبرة', en: '6 years of experience' },
        focus: { ar: 'الهيدرافيشل وجلسات الإشراقة', en: 'HydraFacial and glow sessions' },
      },
    ],
  },

  // ─── 6) آراء العميلات ───
  testimonials: {
    eyebrow: { ar: 'آراء العميلات', en: 'Client reviews' },
    title: { ar: 'كلام عميلاتنا أصدق من أي وصف', en: 'Our clients say it best' },
    items: [
      {
        quote: {
          ar: 'من أول جلسة حسيت بشرتي ارتاحت ونوّرت، والأحلى إني رجعت دوامي على طول بدون أي احمرار. تعامل راقي وما أحد استعجلني.',
          en: 'After the first session my skin felt calm and bright, and the best part is I went straight back to work with no redness at all. Truly classy, and nobody rushed me.',
        },
        name: { ar: 'نوف', en: 'Nouf' },
        city: { ar: 'جدة', en: 'Jeddah' },
        service: { ar: 'هيدرافيشل', en: 'HydraFacial' },
      },
      {
        quote: {
          ar: 'الكلف مضايقني من سنين وجربت أشياء كثير. د. نورة عطتني خطة واضحة بالعدد والسعر من البداية، وبعد ثالث جلسة الفرق بان والكل لاحظ.',
          en: 'Melasma bothered me for years and I tried so many things. Dr. Noura gave me a clear plan with sessions and price upfront, and by the third session everyone noticed.',
        },
        name: { ar: 'هيا', en: 'Haya' },
        city: { ar: 'مكة', en: 'Makkah' },
        service: { ar: 'علاج التصبغات والكلف', en: 'Pigmentation & melasma' },
      },
      {
        quote: {
          ar: 'سويت جلسة الإشراقة قبل ملكة أختي بيومين، ووجهي كان منوّر بالصور بدون فلتر. خلاص صارت عادة عندي قبل أي مناسبة.',
          en: 'I had the glow session two days before my sister’s engagement, and my face was glowing in photos with no filter. Now it’s my ritual before every occasion.',
        },
        name: { ar: 'جود', en: 'Joud' },
        city: { ar: 'الرياض', en: 'Riyadh' },
        service: { ar: 'جلسة الإشراقة قبل المناسبات', en: 'Pre-event glow session' },
      },
    ],
  },

  // ─── 7) الحجز ───
  booking: {
    eyebrow: { ar: 'الحجز', en: 'Booking' },
    title: { ar: 'احجز موعدك في دقيقة', en: 'Book your visit in a minute' },
    intro: {
      ar: 'اختر الخدمة والوقت المناسب، وسنؤكد موعدك عبر واتساب.',
      en: 'Choose your treatment and a time that suits you, and we will confirm on WhatsApp.',
    },
    fields: {
      name: {
        label: { ar: 'الاسم', en: 'Full name' },
        placeholder: { ar: 'اكتب اسمك', en: 'Your name' },
      },
      phone: {
        label: { ar: 'رقم الجوال', en: 'Mobile number' },
        placeholder: { ar: '05xxxxxxxx', en: '05xxxxxxxx' },
        hint: { ar: 'رقم سعودي يبدأ بـ 05', en: 'Saudi number starting with 05' },
      },
      service: {
        label: { ar: 'الخدمة', en: 'Treatment' },
        placeholder: { ar: 'اختر الخدمة', en: 'Choose a treatment' },
      },
      date: {
        label: { ar: 'التاريخ', en: 'Date' },
        hint: { ar: 'نستقبلك من السبت إلى الخميس', en: 'Open Saturday to Thursday' },
      },
      time: { label: { ar: 'الوقت', en: 'Time' } },
      notes: {
        label: { ar: 'ملاحظات', en: 'Notes' },
        placeholder: {
          ar: 'مثلًا: بشرتي حساسة، أو أفضّل الدكتورة ريم',
          en: 'e.g. I have sensitive skin, or I prefer Dr. Reem',
        },
      },
    },
    optional: { ar: '(اختياري)', en: '(optional)' },
    steps: [
      { ar: 'الخدمة', en: 'Treatment' },
      { ar: 'الموعد', en: 'Date & time' },
      { ar: 'بياناتك', en: 'Your details' },
    ],
    stepDone: { ar: 'مكتملة', en: 'done' },
    summary: {
      title: { ar: 'ملخص حجزك', en: 'Your booking' },
      empty: { ar: 'اختر الخدمة والموعد، وسيظهر ملخص حجزك هنا.', en: 'Choose a treatment and a time, and your summary will appear here.' },
      notChosen: { ar: 'لم يُحدَّد بعد', en: 'Not chosen yet' },
    },
    consultationOption: { ar: 'استشارة مجانية · 15 دقيقة', en: 'Free consultation · 15 min' },
    timeSlots: ['11:00', '13:00', '16:00', '18:00', '20:00'],
    closedDays: [5], // الجمعة
    submit: { ar: 'أرسل الحجز عبر واتساب', en: 'Send booking on WhatsApp' },
    errorSummary: {
      ar: 'تحقق من الحقول المعلّمة باللون الأحمر.',
      en: 'Please check the fields marked in red.',
    },
    errors: {
      nameRequired: { ar: 'اكتب اسمك من فضلك.', en: 'Please enter your name.' },
      nameShort: { ar: 'الاسم قصير جدًا.', en: 'That name looks too short.' },
      phoneRequired: { ar: 'اكتب رقم الجوال.', en: 'Please enter your mobile number.' },
      phoneInvalid: {
        ar: 'الرقم غير صحيح. اكتبه هكذا: 05xxxxxxxx',
        en: 'That number is not valid. Use this format: 05xxxxxxxx',
      },
      serviceRequired: { ar: 'اختر الخدمة.', en: 'Please choose a treatment.' },
      dateRequired: { ar: 'اختر التاريخ.', en: 'Please choose a date.' },
      datePast: { ar: 'لا يمكن اختيار تاريخ مضى.', en: 'That date has already passed.' },
      dateClosed: {
        ar: 'العيادة مغلقة يوم الجمعة، اختر يومًا آخر.',
        en: 'The clinic is closed on Fridays. Please choose another day.',
      },
      timeRequired: { ar: 'اختر الوقت المناسب.', en: 'Please choose a time.' },
      timePast: {
        ar: 'هذا الوقت مضى اليوم، اختر وقتًا لاحقًا.',
        en: 'That time has passed today. Please choose a later one.',
      },
    },
    // نص رسالة واتساب التي تُجهَّز تلقائيًا
    whatsappMessage: {
      intro: { ar: 'مرحبًا لُمعة، أرغب بحجز موعد:', en: 'Hello Lumaa, I would like to book an appointment:' },
      name: { ar: 'الاسم', en: 'Name' },
      phone: { ar: 'الجوال', en: 'Mobile' },
      service: { ar: 'الخدمة', en: 'Treatment' },
      date: { ar: 'التاريخ', en: 'Date' },
      time: { ar: 'الوقت', en: 'Time' },
      notes: { ar: 'ملاحظات', en: 'Notes' },
    },
    success: {
      title: { ar: 'شكرًا {name}، طلبك جاهز', en: 'Thank you, {name}. Your request is ready' },
      text: {
        ar: 'فتحنا لك واتساب برسالة فيها كل التفاصيل. أرسلها، وسنؤكد موعدك خلال ساعات العمل.',
        en: 'We opened WhatsApp with a message containing all the details. Send it and we will confirm during opening hours.',
      },
      fallback: { ar: 'لم يُفتح واتساب؟ اضغط هنا', en: 'WhatsApp did not open? Tap here' },
      newBooking: { ar: 'حجز موعد آخر', en: 'Book another visit' },
    },
    info: {
      hoursLabel: { ar: 'ساعات العمل', en: 'Opening hours' },
      days: { ar: 'السبت إلى الخميس', en: 'Saturday to Thursday' },
      hours: { ar: '10 صباحًا حتى 10 مساءً', en: '10 am to 10 pm' },
      closed: { ar: 'الجمعة: مغلق', en: 'Friday: closed' },
      addressLabel: { ar: 'العنوان', en: 'Address' },
      address: { ar: 'جدة، حي الشاطئ', en: 'Al Shati District, Jeddah' },
      whatsappLabel: { ar: 'واتساب', en: 'WhatsApp' },
      note: {
        ar: 'أول زيارة؟ ابدأ باستشارة مجانية مدتها 15 دقيقة تشمل تحليل البشرة.',
        en: 'First visit? Start with a free 15-minute consultation that includes a skin analysis.',
      },
    },
  },

  // ─── 8) الأسئلة الشائعة ───
  faq: {
    eyebrow: { ar: 'الأسئلة الشائعة', en: 'FAQ' },
    title: { ar: 'أسئلة تصلنا كثيرًا', en: 'Questions we hear often' },
    contactPrompt: { ar: 'لم تجد إجابة سؤالك؟', en: 'Didn’t find your answer?' },
    contactCta: { ar: 'اسألنا على واتساب', en: 'Ask us on WhatsApp' },
    items: [
      {
        question: { ar: 'هل الجلسة مؤلمة؟', en: 'Is the session painful?' },
        answer: {
          ar: 'أغلب جلساتنا مريحة تمامًا. قد تشعر بوخز خفيف في التقشير الكيميائي والميزوثيرابي، ونستخدم كريمًا مخدرًا موضعيًا عند الحاجة.',
          en: 'Most of our sessions are completely comfortable. You may feel a light tingling during chemical peels and mesotherapy, and we use a topical numbing cream when needed.',
        },
      },
      {
        question: { ar: 'كم جلسة أحتاج؟', en: 'How many sessions will I need?' },
        answer: {
          ar: 'يعتمد ذلك على حالة بشرتك وهدفك. الهيدرافيشل تظهر نتيجته من أول جلسة، أما علاج التصبغات وحب الشباب فيحتاج عادة من 4 إلى 6 جلسات. نحدد العدد بدقة في خطتك المكتوبة.',
          en: 'It depends on your skin and your goal. HydraFacial shows results from the first session, while pigmentation and acne treatments usually take 4 to 6 sessions. We set the exact number in your written plan.',
        },
      },
      {
        question: { ar: 'هل أحتاج استشارة قبل الحجز؟', en: 'Do I need a consultation before booking?' },
        answer: {
          ar: 'ننصح بها في الزيارة الأولى، وهي مجانية مدتها 15 دقيقة وتشمل تحليل البشرة. ويمكنك حجز الهيدرافيشل أو جلسة الإشراقة مباشرة.',
          en: 'We recommend it for your first visit. It is free, takes 15 minutes and includes a skin analysis. You can also book a HydraFacial or a glow session directly.',
        },
      },
      {
        question: { ar: 'ما سياسة الإلغاء؟', en: 'What is your cancellation policy?' },
        answer: {
          ar: 'يمكنك الإلغاء أو تغيير الموعد مجانًا قبل 24 ساعة على الأقل عبر واتساب. الإلغاء المتأخر أو عدم الحضور قد يؤخر أولوية حجزك في المواعيد القريبة.',
          en: 'You can cancel or reschedule for free up to 24 hours before your visit via WhatsApp. Late cancellations or no-shows may lower your priority for near-term appointments.',
        },
      },
    ],
  },

  // ─── 9) التذييل ───
  footer: {
    about: {
      ar: 'عيادة عناية بالبشرة في جدة. نؤمن أن البشرة الصحية هي أجمل لمعة.',
      en: 'A skin care clinic in Jeddah. We believe healthy skin is the most beautiful glow.',
    },
    linksTitle: { ar: 'روابط سريعة', en: 'Quick links' },
    contactTitle: { ar: 'تواصل معنا', en: 'Get in touch' },
    // ضع روابط الحسابات الحقيقية مكان # (رابط واتساب يُبنى تلقائيًا من الرقم أعلاه)
    socials: [
      { icon: 'whatsapp', label: { ar: 'واتساب', en: 'WhatsApp' }, href: '' },
      { icon: 'instagram', label: { ar: 'إنستغرام', en: 'Instagram' }, href: '#' },
      { icon: 'snapchat', label: { ar: 'سناب شات', en: 'Snapchat' }, href: '#' },
      { icon: 'tiktok', label: { ar: 'تيك توك', en: 'TikTok' }, href: '#' },
    ],
    // لعيادة حقيقية اجعل النصين فارغين '' فيختفي هذا السطر
    demoNote: {
      ar: 'موقع تجريبي لعيادة وهمية لعرض الأعمال',
      en: 'A demo website for a fictional clinic, made for a portfolio',
    },
    credit: { ar: 'تصميم وتطوير: حمزة بدر', en: 'Design & development: Hamza Bder' },
    creditHandle: '@hamza.bder.dev',
    creditHref: 'https://www.instagram.com/hamza.bder.dev/',
    rights: { ar: '© {year} لُمعة. جميع الحقوق محفوظة.', en: '© {year} Lumaa. All rights reserved.' },
  },
}
