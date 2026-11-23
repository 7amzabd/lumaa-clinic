/**
 * رسم بشرة توضيحية على canvas بدل الصور الحقيقية.
 * ------------------------------------------------------------
 * «قبل»: بشرة باهتة فيها مسام واضحة، احمرار، بقع تصبغ، وآثار حبوب.
 * «بعد»: نفس البشرة (نفس أماكن المسام) لكن ناعمة ومشرقة.
 * نستخدم مولّد أرقام عشوائية ثابت، فتُرسم البشرة بالشكل نفسه في كل مرة.
 */

export type SkinVariant = 'before' | 'after'

export type Rgb = [number, number, number]

export const TAU = Math.PI * 2

/** مولّد أرقام عشوائية ثابت (mulberry32): نفس الرقم الأولي يعطي نفس النتائج */
export function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** بقعة ناعمة دائرية تتلاشى من المركز إلى الأطراف */
export function softSpot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  [r, g, b]: Rgb,
  alpha: number,
  hardness = 0,
) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
  if (hardness > 0) gradient.addColorStop(hardness, `rgba(${r},${g},${b},${alpha * 0.85})`)
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, TAU)
  ctx.fill()
}

/**
 * ملمس بشرة صحية للكرة في الصفحة الرئيسية:
 * مسام دقيقة واضحة قليلًا، تدرج لوني ناعم، وحمرة خفيفة على الخد.
 * (الظل الكروي واللمعان يُضافان فوقها بـ CSS في SkinOrb)
 */
export function drawSkinTexture(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width: w, height: h } = canvas
  const scale = w / 600
  ctx.clearRect(0, 0, w, h)

  // 1) لون البشرة الأساسي مع تدرج دافئ
  const base = ctx.createLinearGradient(0, 0, w, h)
  base.addColorStop(0, '#f5dac8')
  base.addColorStop(0.55, '#e8bca3')
  base.addColorStop(1, '#d9a68c')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)

  // 2) تفاوت لوني طبيعي: بقع كبيرة ناعمة بدرجات أفتح وأغمق (البشرة ليست لونًا واحدًا)
  const tone = createRandom(7)
  for (let i = 0; i < 48; i++) {
    const light = tone() > 0.5
    softSpot(ctx, tone() * w, tone() * h, (0.03 + tone() * 0.14) * w, light ? [255, 236, 224] : [165, 100, 76], 0.05 + tone() * 0.07)
  }
  // حمرة الخد وحرارة خفيفة حول الحواف
  softSpot(ctx, w * 0.62, h * 0.66, w * 0.32, [232, 140, 130], 0.2)
  softSpot(ctx, w * 0.28, h * 0.48, w * 0.2, [240, 170, 160], 0.09)

  // 3) شبكة خطوط دقيقة جدًا في اتجاهين (الملمس الطبيعي الذي تراه عن قرب)
  const line = createRandom(19)
  ctx.lineWidth = 0.6 * scale
  ctx.lineCap = 'round'
  for (let i = 0; i < Math.round(2600 * scale * scale); i++) {
    const x = line() * w
    const y = line() * h
    const length = (4 + line() * 9) * scale
    const angle = (line() > 0.5 ? 0.7 : -0.9) + (line() - 0.5) * 0.5
    const dark = line() > 0.45
    ctx.strokeStyle = dark
      ? `rgba(120,66,46,${0.025 + line() * 0.035})`
      : `rgba(255,242,234,${0.04 + line() * 0.05})`
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + Math.cos(angle) * length * 0.5 + (line() - 0.5) * 3 * scale, y + Math.sin(angle) * length * 0.5, x + Math.cos(angle) * length, y + Math.sin(angle) * length)
    ctx.stroke()
  }

  // 4) المسام: كثيرة وصغيرة بحواف ناعمة، وبعضها أوضح قليلًا
  const pore = createRandom(17)
  for (let i = 0; i < Math.round(4200 * scale * scale); i++) {
    const x = pore() * w
    const y = pore() * h
    // كثافة المسام تتفاوت بين منطقة وأخرى (كما في البشرة الحقيقية)
    const density = 0.5 + 0.5 * Math.sin((x / w) * 6.1 + 0.7) * Math.sin((y / h) * 5.3 + 1.9)
    if (pore() > 0.35 + density * 0.65) continue
    const big = pore() > 0.88
    const radius = (big ? 1.4 + pore() * 1.2 : 0.6 + pore() * 0.9) * scale
    softSpot(ctx, x, y, radius, [110, 58, 40], big ? 0.11 + pore() * 0.08 : 0.06 + pore() * 0.09, 0.3)
  }

  // 5) حبيبات دقيقة جدًا توحّد الملمس
  const grain = createRandom(13)
  for (let i = 0; i < Math.round((w * h) / 40); i++) {
    const x = grain() * w
    const y = grain() * h
    const alpha = 0.02 + grain() * 0.04
    ctx.fillStyle = grain() > 0.5 ? `rgba(255,240,230,${alpha})` : `rgba(110,60,42,${alpha})`
    ctx.fillRect(x, y, 1.2 * scale, 1.2 * scale)
  }

  // 6) ندى: لمعات صغيرة ناعمة قرب مصدر الضوء فقط (أعلى اليسار)
  const dew = createRandom(31)
  for (let i = 0; i < Math.round(26 * scale * scale); i++) {
    softSpot(ctx, dew() * w * 0.6, dew() * h * 0.55, (2 + dew() * 3) * scale, [255, 252, 248], 0.35)
  }
}

export function drawSkin(canvas: HTMLCanvasElement, variant: SkinVariant) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { width: w, height: h } = canvas
  const scale = w / 600 // حتى تبقى التفاصيل بنفس النسبة على أي حجم شاشة
  const before = variant === 'before'

  ctx.clearRect(0, 0, w, h)

  // 1) لون البشرة الأساسي: «قبل» أبهت، و«بعد» أفتح وأكثر إشراقًا
  const base = ctx.createLinearGradient(0, 0, w, h)
  base.addColorStop(0, before ? '#e1b59b' : '#f3d4c1')
  base.addColorStop(1, before ? '#c4957a' : '#e2b39a')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)

  // 2) ضوء وظل كبيران يعطيان إحساس انحناء الخد
  softSpot(ctx, w * 0.3, h * 0.25, w * 0.6, [255, 238, 226], before ? 0.3 : 0.5)
  softSpot(ctx, w * 0.95, h * 1.0, w * 0.65, [110, 58, 40], 0.3)

  // 3) ملمس دقيق جدًا (حبيبات فاتحة وداكنة)
  const grain = createRandom(3)
  const grainCount = Math.round((w * h) / (before ? 45 : 55))
  for (let i = 0; i < grainCount; i++) {
    const x = grain() * w
    const y = grain() * h
    const light = grain() > 0.5
    const alpha = (before ? 0.05 : 0.035) + grain() * 0.03
    ctx.fillStyle = light ? `rgba(255,240,230,${alpha})` : `rgba(100,55,40,${alpha})`
    ctx.fillRect(x, y, 1.2 * scale, 1.2 * scale)
  }

  // 4) المسام: نفس الأماكن في الصورتين، لكنها في «بعد» أصغر وأخف بكثير
  const pore = createRandom(11)
  const poreCount = Math.round(1500 * scale * scale)
  for (let i = 0; i < poreCount; i++) {
    const x = pore() * w
    const y = pore() * h
    const radius = (0.6 + pore() * 1.4) * scale
    const jitter = pore()
    ctx.fillStyle = before
      ? `rgba(105,58,40,${0.16 + jitter * 0.18})`
      : `rgba(105,58,40,${0.05 + jitter * 0.04})`
    ctx.beginPath()
    ctx.arc(x, y, before ? radius : radius * 0.6, 0, TAU)
    ctx.fill()
  }

  if (before) {
    // 5) مناطق احمرار
    const redness = createRandom(29)
    for (let i = 0; i < 6; i++) {
      softSpot(
        ctx,
        redness() * w,
        redness() * h,
        (0.1 + redness() * 0.14) * w,
        [206, 74, 70],
        0.18 + redness() * 0.14,
      )
    }

    // 6) كلف: بقعتان كبيرتان بلون بني باهت
    softSpot(ctx, w * 0.64, h * 0.36, w * 0.17, [122, 70, 42], 0.28, 0.3)
    softSpot(ctx, w * 0.24, h * 0.68, w * 0.12, [122, 70, 42], 0.24, 0.3)

    // 7) بقع تصبغ صغيرة غير منتظمة (كل بقعة = 3 دوائر متداخلة)
    const spots = createRandom(47)
    for (let i = 0; i < 22; i++) {
      const x = spots() * w
      const y = spots() * h
      const size = (3 + spots() * 9) * scale
      const alpha = 0.32 + spots() * 0.25
      for (let k = 0; k < 3; k++) {
        softSpot(
          ctx,
          x + (spots() - 0.5) * size,
          y + (spots() - 0.5) * size,
          size * (0.7 + spots() * 0.5),
          [108, 60, 36],
          alpha * 0.6,
          0.5,
        )
      }
    }

    // 8) آثار حبوب: نتوءات حمراء صغيرة مع لمعة خفيفة
    const acne = createRandom(83)
    for (let i = 0; i < 6; i++) {
      const x = (0.15 + acne() * 0.7) * w
      const y = (0.2 + acne() * 0.65) * h
      const radius = (4 + acne() * 4) * scale
      softSpot(ctx, x, y, radius * 2.2, [200, 70, 64], 0.22)
      softSpot(ctx, x, y, radius, [176, 58, 52], 0.5, 0.4)
      softSpot(ctx, x - radius * 0.3, y - radius * 0.35, radius * 0.35, [255, 230, 220], 0.4)
    }

    // 9) طبقة رمادية خفيفة تعطي مظهر البشرة المتعبة
    ctx.fillStyle = 'rgba(150,130,115,0.1)'
    ctx.fillRect(0, 0, w, h)
  } else {
    // 5) إشراقة صحية: ضوء ناعم على الخد ولون وردي خفيف
    softSpot(ctx, w * 0.34, h * 0.3, w * 0.42, [255, 250, 244], 0.45)
    softSpot(ctx, w * 0.7, h * 0.58, w * 0.28, [242, 160, 150], 0.12)

    // 6) لمعة مائلة رقيقة على سطح البشرة
    const sheen = ctx.createLinearGradient(0, 0, w, h)
    sheen.addColorStop(0.3, 'rgba(255,255,255,0)')
    sheen.addColorStop(0.42, 'rgba(255,255,255,0.16)')
    sheen.addColorStop(0.54, 'rgba(255,255,255,0)')
    ctx.fillStyle = sheen
    ctx.fillRect(0, 0, w, h)
  }

  // ظل خفيف عند الأطراف (في الصورتين) لإحساس العمق
  const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75)
  vignette.addColorStop(0, 'rgba(60,30,20,0)')
  vignette.addColorStop(1, 'rgba(60,30,20,0.22)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, w, h)
}
