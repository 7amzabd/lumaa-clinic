import { createRandom, softSpot, TAU } from './drawSkin'

/**
 * مؤثرات «قبل / بعد» فوق صورة الوجه الحقيقية.
 * -----------------------------------------------------------
 * لا نعدّل الصورة الأصلية، بل نرسم فوقها على canvas شفاف:
 * - before: بهتان خفيف، احمرار موضعي، مسام أوضح، رؤوس سوداء دقيقة
 *           حول الأنف والذقن، وحبوب قليلة واقعية (قبة محمرّة بلمعة وظل).
 * - after : إشراق، نعومة، وندى لامع.
 * الرسم يقتصر على "منطقة البشرة" التي يحددها face (نسب من عرض الصورة وارتفاعها)
 * حتى لا تقع الحبوب على الشعر أو العينين. عدّل هذه النسب إذا غيّرت الصورة.
 */
export type SkinMode = 'before' | 'after'

/** منطقة الوجه داخل الصورة كنسب (0 إلى 1): مركز البيضاوي ونصفا قطريه، والعينان والفم */
export interface FaceRegion {
  cx: number
  cy: number
  rx: number
  ry: number
  eyeY: number
  eyeDx: number
  eyeRx: number
  eyeRy: number
  mouthY: number
}

/** مقاسة على صورة public/face.jpg (3:4). عدّلها إذا بدّلت الصورة */
export const DEFAULT_FACE: FaceRegion = { cx: 0.5, cy: 0.46, rx: 0.235, ry: 0.25, eyeY: 0.41, eyeDx: 0.125, eyeRx: 0.09, eyeRy: 0.065, mouthY: 0.64 }

/** مواضع الأنف والذقن والجبهة كنسب من الصورة (لتوزيع الرؤوس السوداء والاحمرار) */
const NOSE_WING_Y = 0.55
const NOSE_BRIDGE_Y = 0.48
const CHIN_Y = 0.695
const FOREHEAD_Y = 0.3

/** هل النقطة داخل بيضاوي الوجه وخارج العينين والفم؟ */
function onSkin(x: number, y: number, w: number, h: number, face: FaceRegion) {
  const dx = (x - w * face.cx) / (w * face.rx)
  const dy = (y - h * face.cy) / (h * face.ry)
  if (dx * dx + dy * dy > 0.92) return false
  for (const side of [-1, 1]) {
    const ex = (x - w * (face.cx + side * face.eyeDx)) / (w * face.eyeRx)
    const ey = (y - h * face.eyeY) / (h * face.eyeRy)
    if (ex * ex + ey * ey < 1) return false
  }
  const mx = (x - w * face.cx) / (w * 0.1)
  const my = (y - h * face.mouthY) / (h * 0.04)
  return mx * mx + my * my > 1
}

/** يرسم طبقة «قبل» أو «بعد» على canvas شفاف بحجم الصورة */
export function drawSkinOverlay(canvas: HTMLCanvasElement, mode: SkinMode, face: FaceRegion = DEFAULT_FACE) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width: w, height: h } = canvas
  const scale = w / 600
  ctx.clearRect(0, 0, w, h)

  if (mode === 'before') drawBefore(ctx, w, h, scale, face)
  else drawAfter(ctx, w, h, scale, face)

  // قناع ناعم لبيضاوي الوجه: كل ما رُسم يُقص به حتى يتلاشى عند حواف الوجه
  ctx.globalCompositeOperation = 'destination-in'
  ctx.save()
  ctx.translate(w * face.cx, h * face.cy)
  ctx.scale(1, (h * face.ry) / (w * face.rx))
  const mask = ctx.createRadialGradient(0, 0, 0, 0, 0, w * face.rx)
  mask.addColorStop(0.72, 'rgba(0,0,0,1)')
  mask.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = mask
  ctx.fillRect(-w * 2, -h * 2, w * 4, h * 4)
  ctx.restore()
  ctx.globalCompositeOperation = 'source-over'
}

/** نقاط موزعة طبيعيًا: مبعثرة حول مركز بتوزيع قريب من الجرس (غاوسي) */
function scatter(random: () => number, cx: number, cy: number, spreadX: number, spreadY: number) {
  // مجموع ثلاث قيم عشوائية يقترب من التوزيع الطبيعي
  const g = () => (random() + random() + random()) / 1.5 - 1
  return { x: cx + g() * spreadX, y: cy + g() * spreadY }
}

function drawBefore(ctx: CanvasRenderingContext2D, w: number, h: number, scale: number, face: FaceRegion) {
  const skin = (x: number, y: number) => onSkin(x, y, w, h, face)
  /** نقطة عشوائية داخل مستطيل الوجه */
  const randomOnFace = (random: () => number) => ({
    x: (face.cx - face.rx + random() * face.rx * 2) * w,
    y: (face.cy - face.ry + random() * face.ry * 2) * h,
  })
  /** المناطق التي لا نضع فيها حبوبًا كبيرة: الأنف والفم مباشرة */
  const nearNoseOrMouth = (x: number, y: number) =>
    Math.abs(x - w * face.cx) < w * 0.035 && y > h * (face.cy - 0.04) && y < h * (face.mouthY + 0.03)

  // 1) بهتان خفيف: البشرة تفقد إشراقها وتميل إلى الرمادي الدافئ قليلًا
  ctx.fillStyle = 'rgba(140,118,96,0.14)'
  ctx.fillRect(0, 0, w, h)

  // 2) تفاوت لوني طبيعي: بقع واسعة ناعمة أفتح وأغمق (بدل لون موحّد)
  const tone = createRandom(7)
  for (let i = 0; i < 70; i++) {
    const x = tone() * w
    const y = tone() * h
    if (!skin(x, y)) continue
    const light = tone() > 0.55
    softSpot(ctx, x, y, (0.025 + tone() * 0.06) * w, light ? [255, 236, 222] : [150, 92, 66], 0.05 + tone() * 0.06)
  }

  // 3) احمرار منتشر: أوسع على الخدين، وأخف على الجبهة والذقن
  const redZones = [
    { x: face.cx - 0.13, y: face.cy + 0.09, r: 0.11, a: 0.14 }, // الخد الأيسر
    { x: face.cx + 0.13, y: face.cy + 0.09, r: 0.11, a: 0.14 }, // الخد الأيمن
    { x: face.cx - 0.08, y: NOSE_WING_Y + 0.01, r: 0.06, a: 0.12 },
    { x: face.cx + 0.08, y: NOSE_WING_Y + 0.01, r: 0.06, a: 0.12 },
    { x: face.cx, y: CHIN_Y, r: 0.07, a: 0.11 },
    { x: face.cx, y: FOREHEAD_Y, r: 0.1, a: 0.09 },
  ]
  for (const zone of redZones) softSpot(ctx, w * zone.x, h * zone.y, w * zone.r, [205, 85, 78], zone.a)

  // 4) مسام أوضح على الوجه كله: نقاط صغيرة جدًا ناعمة الحواف
  const pore = createRandom(17)
  for (let i = 0; i < Math.round(5200 * scale * scale); i++) {
    const x = pore() * w
    const y = pore() * h
    if (!skin(x, y)) continue
    softSpot(ctx, x, y, (0.7 + pore() * 0.9) * scale, [95, 52, 36], 0.07 + pore() * 0.1, 0.3)
  }

  // 5) رؤوس سوداء: عناقيد أكثف في منطقة T، ونقاط متفرقة أخف على الخدين
  const black = createRandom(41)
  const drawBlackhead = (x: number, y: number, strength: number) => {
    const radius = (0.35 + black() * 0.45) * scale
    softSpot(ctx, x, y, radius * 3.2, [95, 55, 40], 0.12 * strength)
    ctx.fillStyle = `rgba(62,38,26,${(0.32 + black() * 0.28) * strength})`
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, TAU)
    ctx.fill()
  }
  const clusters = [
    { x: face.cx - 0.05, y: NOSE_WING_Y, sx: 0.03, sy: 0.032, n: 26 }, // جناح الأنف الأيسر
    { x: face.cx + 0.05, y: NOSE_WING_Y, sx: 0.03, sy: 0.032, n: 26 }, // جناح الأنف الأيمن
    { x: face.cx, y: NOSE_BRIDGE_Y, sx: 0.016, sy: 0.05, n: 18 }, // جسر الأنف
    { x: face.cx, y: CHIN_Y, sx: 0.06, sy: 0.026, n: 30 }, // الذقن
    { x: face.cx, y: FOREHEAD_Y, sx: 0.09, sy: 0.045, n: 40 }, // الجبهة
  ]
  for (const cluster of clusters) {
    for (let i = 0; i < Math.round(cluster.n * Math.min(scale * scale, 2.5)); i++) {
      const point = scatter(black, w * cluster.x, h * cluster.y, w * cluster.sx, h * cluster.sy)
      if (skin(point.x, point.y)) drawBlackhead(point.x, point.y, 1)
    }
  }
  for (let i = 0; i < Math.round(220 * Math.min(scale * scale, 2.5)); i++) {
    const { x, y } = randomOnFace(black)
    if (skin(x, y)) drawBlackhead(x, y, 0.75)
  }

  // 6) رؤوس بيضاء مغلقة (comedones): نتوءات صغيرة بلون البشرة، تُرى بالظل واللمعة فقط
  const comedo = createRandom(61)
  for (let i = 0; i < Math.round(170 * Math.min(scale * scale, 2.5)); i++) {
    const { x, y } = randomOnFace(comedo)
    if (!skin(x, y) || nearNoseOrMouth(x, y)) continue
    const r = (1.2 + comedo() * 1.4) * scale
    softSpot(ctx, x + r * 0.3, y + r * 0.7, r * 1.2, [120, 60, 45], 0.2) // ظل أسفل
    softSpot(ctx, x, y, r, [235, 190, 170], 0.35, 0.4) // القبة
    softSpot(ctx, x - r * 0.35, y - r * 0.4, r * 0.4, [255, 245, 238], 0.5) // لمعة
  }

  // 7) حبوب ملتهبة منتشرة: على الخدين والجبهة والذقن والفك، متباعدة وبأحجام مختلفة
  const bump = createRandom(53)
  const placed: { x: number; y: number }[] = []
  let attempts = 0
  while (placed.length < 34 && attempts < 1200) {
    attempts++
    const { x, y } = randomOnFace(bump)
    if (!skin(x, y) || nearNoseOrMouth(x, y)) continue
    if (placed.some((p) => Math.hypot(p.x - x, p.y - y) < w * 0.045)) continue
    placed.push({ x, y })
  }
  placed.forEach(({ x, y }, index) => {
    const kind = index % 4 // 0 = رأس أبيض (pustule)، 1-2 = حبة حمراء (papule)، 3 = صغيرة بدأت تلتهب
    const r = (kind === 3 ? 2 + bump() * 1.5 : 3 + bump() * 3.2) * scale
    const inflamed = kind === 0 || kind === 1
    // هالة الالتهاب تتلاشى بنعومة
    softSpot(ctx, x, y, r * (inflamed ? 3.6 : 2.8), [210, 90, 82], inflamed ? 0.32 : 0.2)
    // ظل رقيق أسفل القبة يوحي بالارتفاع
    softSpot(ctx, x + r * 0.35, y + r * 0.8, r * 1.1, [120, 55, 42], 0.24)
    // القبة نفسها: أحمر وردي متدرج
    softSpot(ctx, x, y, r, [205, 95, 88], 0.6, 0.35)
    // رأس أبيض في البثور الصديدية
    if (kind === 0) softSpot(ctx, x, y - r * 0.15, r * 0.5, [250, 236, 220], 0.7, 0.45)
    // لمعة انعكاس الضوء أعلى يسار القبة
    softSpot(ctx, x - r * 0.4, y - r * 0.45, r * 0.32, [255, 240, 232], 0.6)
  })

  // 8) آثار حبوب قديمة: بقع بنية وحمراء باهتة غير منتظمة على الوجه كله
  const marks = createRandom(47)
  for (let i = 0; i < 60; i++) {
    const { x, y } = randomOnFace(marks)
    if (!skin(x, y)) continue
    const r = (3 + marks() * 6) * scale
    const red = marks() > 0.5
    for (let k = 0; k < 2; k++) {
      softSpot(
        ctx,
        x + (marks() - 0.5) * r,
        y + (marks() - 0.5) * r,
        r * (0.7 + marks() * 0.5),
        red ? [180, 85, 75] : [120, 70, 48],
        0.1 + marks() * 0.1,
        0.5,
      )
    }
  }
}

function drawAfter(ctx: CanvasRenderingContext2D, w: number, h: number, scale: number, face: FaceRegion) {
  // إشراق دافئ من منتصف الوجه
  const glow = ctx.createRadialGradient(w * face.cx, h * (face.cy - 0.05), 0, w * face.cx, h * face.cy, w * face.rx * 1.1)
  glow.addColorStop(0, 'rgba(255,245,235,0.28)')
  glow.addColorStop(1, 'rgba(255,245,235,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)
  // حمرة خد صحية خفيفة
  softSpot(ctx, w * (face.cx - 0.17), h * (face.cy + 0.08), w * 0.1, [255, 190, 185], 0.12)
  softSpot(ctx, w * (face.cx + 0.17), h * (face.cy + 0.08), w * 0.1, [255, 190, 185], 0.12)
  // ندى لامع صغير متفرق
  const dew = createRandom(31)
  for (let i = 0; i < Math.round(70 * scale * scale); i++) {
    const x = dew() * w
    const y = dew() * h
    if (!onSkin(x, y, w, h, face)) continue
    softSpot(ctx, x, y, (1 + dew() * 2) * scale, [255, 252, 248], 0.28)
  }
  // خط لمعة مائل رقيق
  const sheen = ctx.createLinearGradient(0, 0, w, h)
  sheen.addColorStop(0.3, 'rgba(255,255,255,0)')
  sheen.addColorStop(0.42, 'rgba(255,255,255,0.14)')
  sheen.addColorStop(0.54, 'rgba(255,255,255,0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, w, h)
}
