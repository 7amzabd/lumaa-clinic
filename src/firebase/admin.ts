import { initializeApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from 'firebase/auth'
import {
  collection,
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Firestore,
} from 'firebase/firestore'
import type { BookingStatus, Lang, SignInErrorKey } from '../content/types'
import {
  ADMINS_COLLECTION,
  AUTH_EMULATOR_PORT,
  BOOKINGS_COLLECTION,
  EMULATOR_HOST,
  FIRESTORE_EMULATOR_PORT,
  firebaseConfig,
  useEmulators,
} from './config'

/**
 * كل تعامل لوحة الإدارة مع Firebase في هذا الملف:
 * تسجيل الدخول، قراءة الحجوزات مباشرة (تتحدث لحظيًا)، وتغيير حالة الحجز.
 * هذا الملف يُحمَّل في صفحة ‎/admin فقط، فلا يثقل الموقع على الزوار.
 */

/** الحجز كما يُعرض في لوحة الإدارة */
export interface BookingRecord {
  id: string
  name: string
  phone: string
  service: string
  date: string
  time: string
  notes: string
  lang: Lang
  status: BookingStatus
  /** وقت استلام الحجز */
  createdAt: Date | null
}

export interface AdminUser {
  uid: string
  email: string
}

/** أقصى عدد حجوزات نحمّله (الأحدث أولًا) */
const MAX_BOOKINGS = 500

let services: { auth: Auth; db: Firestore } | null = null

/** نهيّئ Firebase عند أول استخدام فقط */
function getServices() {
  if (!services) {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
    if (useEmulators) {
      connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${AUTH_EMULATOR_PORT}`, { disableWarnings: true })
      connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_EMULATOR_PORT)
    }
    services = { auth, db }
  }
  return services
}

/** يراقب حالة الدخول: يستدعي الدالة عند الدخول والخروج. يرجع دالة لإيقاف المراقبة */
export function watchAuth(onChange: (user: AdminUser | null) => void) {
  return onAuthStateChanged(getServices().auth, (user) => {
    onChange(user ? { uid: user.uid, email: user.email ?? '' } : null)
  })
}

/** يسجل الدخول. يرجع null عند النجاح، أو اسم رسالة الخطأ (النص في site.ts) */
export async function signIn(email: string, password: string): Promise<SignInErrorKey | null> {
  try {
    await signInWithEmailAndPassword(getServices().auth, email.trim(), password)
    return null
  } catch (error) {
    const code = (error as { code?: string }).code ?? ''
    if (code === 'auth/too-many-requests') return 'tooMany'
    if (code === 'auth/network-request-failed') return 'network'
    const wrongCodes = ['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email', 'auth/user-disabled']
    return wrongCodes.includes(code) ? 'wrong' : 'unknown'
  }
}

export function signOutAdmin() {
  return signOut(getServices().auth)
}

/**
 * هل هذا الحساب مدير؟ المدير هو من له مستند في مجموعة admins باسم معرّفه (UID).
 * قواعد الأمان تتحقق من الشيء نفسه في الخادم، فهذا الفحص للواجهة فقط.
 */
export async function isAdmin(uid: string) {
  try {
    const snapshot = await getDoc(doc(getServices().db, ADMINS_COLLECTION, uid))
    return snapshot.exists()
  } catch {
    return false
  }
}

/** يراقب الحجوزات لحظيًا: أي حجز جديد أو تغيير يصل مباشرة. يرجع دالة لإيقاف المراقبة */
export function watchBookings(onData: (bookings: BookingRecord[]) => void, onError: () => void) {
  const bookingsQuery = query(
    collection(getServices().db, BOOKINGS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(MAX_BOOKINGS),
  )
  return onSnapshot(
    bookingsQuery,
    (snapshot) => {
      onData(
        snapshot.docs.map((item) => {
          const data = item.data({ serverTimestamps: 'estimate' })
          return {
            id: item.id,
            name: String(data.name ?? ''),
            phone: String(data.phone ?? ''),
            service: String(data.service ?? ''),
            date: String(data.date ?? ''),
            time: String(data.time ?? ''),
            notes: String(data.notes ?? ''),
            lang: data.lang === 'en' ? 'en' : 'ar',
            status: toStatus(data.status),
            createdAt: typeof data.createdAt?.toDate === 'function' ? data.createdAt.toDate() : null,
          }
        }),
      )
    },
    () => onError(),
  )
}

function toStatus(value: unknown): BookingStatus {
  return value === 'confirmed' || value === 'done' || value === 'cancelled' ? value : 'new'
}

/** يغيّر حالة الحجز (قواعد الأمان تسمح للمدير بتغيير الحالة فقط) */
export function setBookingStatus(id: string, status: BookingStatus) {
  return updateDoc(doc(getServices().db, BOOKINGS_COLLECTION, id), {
    status,
    updatedAt: serverTimestamp(),
  })
}
