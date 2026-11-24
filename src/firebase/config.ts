/**
 * إعدادات Firebase
 * ------------------------------------------------------------
 * القيم تُقرأ من ملف ‎.env.local (انسخه من ‎.env.example واملأه)،
 * وفي Vercel من Environment Variables. هذه القيم ليست سرية:
 * الحماية الحقيقية في قواعد الأمان (firestore.rules).
 *
 * إذا تُركت القيم فارغة يعمل الموقع كما كان: الحجز عبر واتساب فقط،
 * وصفحة ‎/admin تعرض رسالة «غير مفعّلة».
 */
const env = import.meta.env

export const firebaseConfig = {
  apiKey: String(env.VITE_FIREBASE_API_KEY ?? ''),
  authDomain: String(env.VITE_FIREBASE_AUTH_DOMAIN ?? ''),
  projectId: String(env.VITE_FIREBASE_PROJECT_ID ?? ''),
  appId: String(env.VITE_FIREBASE_APP_ID ?? ''),
}

/** هل رُبط الموقع بمشروع Firebase؟ */
export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

/** true عند التشغيل بـ npm run dev:emulator: نتصل بالمحاكي المحلي بدل المشروع الحقيقي */
export const useEmulators = env.VITE_FIREBASE_EMULATOR === 'true'
export const EMULATOR_HOST = '127.0.0.1'
export const FIRESTORE_EMULATOR_PORT = 8080
export const AUTH_EMULATOR_PORT = 9099

/** أسماء المجموعات في Firestore (مكررة في firestore.rules، غيّرهما معًا) */
export const BOOKINGS_COLLECTION = 'bookings'
export const ADMINS_COLLECTION = 'admins'
