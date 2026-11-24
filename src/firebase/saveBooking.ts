import type { Lang } from '../content/types'
import { normalizePhone, type BookingValues } from '../lib/validation'
import {
  BOOKINGS_COLLECTION,
  EMULATOR_HOST,
  FIRESTORE_EMULATOR_PORT,
  firebaseConfig,
  firebaseEnabled,
  useEmulators,
} from './config'

/**
 * حفظ الحجز في Firestore من صفحة الموقع.
 * نحمّل مكتبة Firebase عند الحاجة فقط (النسخة الخفيفة lite)،
 * حتى لا يثقل الموقع على الزائر الذي لا يحجز.
 */
function loadStore() {
  return Promise.all([import('firebase/app'), import('firebase/firestore/lite')]).then(([appModule, store]) => {
    const app = appModule.initializeApp(firebaseConfig)
    const db = store.getFirestore(app)
    if (useEmulators) store.connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_EMULATOR_PORT)
    return { db, store }
  })
}

let storePromise: ReturnType<typeof loadStore> | null = null

function getStore() {
  storePromise ??= loadStore()
  return storePromise
}

/** يبدأ تحميل المكتبة مبكرًا (عند اختيار التاريخ)، فيكون الحفظ فوريًا عند الإرسال */
export function preloadBookingStore() {
  if (!firebaseEnabled) return
  getStore().catch(() => {
    storePromise = null // فشل التحميل (انقطاع مثلًا): نحاول من جديد عند الإرسال
  })
}

/**
 * يحفظ الحجز بحالة «جديد». يرجع true إذا حُفظ.
 * إذا لم يُربط Firebase أو فشل الحفظ يرجع false، ورسالة واتساب تبقى تعمل كما هي.
 */
export async function saveBooking(values: BookingValues, lang: Lang) {
  if (!firebaseEnabled) return false
  try {
    const { db, store } = await getStore()
    // هذه الحقول نفسها تتحقق منها قواعد الأمان في firestore.rules
    await store.addDoc(store.collection(db, BOOKINGS_COLLECTION), {
      name: values.name.trim(),
      phone: normalizePhone(values.phone),
      service: values.service,
      date: values.date,
      time: values.time,
      notes: values.notes.trim(),
      lang,
      status: 'new',
      createdAt: store.serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error('Booking was not saved', error)
    storePromise = null
    return false
  }
}
