import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../components/ui/Button'
import { IconSparkle } from '../components/ui/Icons'
import { LangToggle } from '../components/ui/LangToggle'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { site } from '../content/site'
import { isAdmin, signOutAdmin, watchAuth, type AdminUser } from '../firebase/admin'
import { firebaseEnabled } from '../firebase/config'
import { useLang } from '../i18n/useLang'
import { AdminBookings } from './AdminBookings'
import { AdminLogin } from './AdminLogin'

/**
 * حالة الجلسة في لوحة الإدارة:
 *   off       = لم يُربط Firebase بعد
 *   loading   = ننتظر Firebase ليخبرنا هل يوجد دخول محفوظ
 *   signedOut = لا يوجد دخول: نعرض نموذج الدخول
 *   checking  = دخل، ونتحقق أنه مدير
 *   denied    = دخل لكنه ليس مديرًا
 *   admin     = مدير: نعرض الحجوزات
 */
type Session =
  | { state: 'off' | 'loading' | 'signedOut' }
  | { state: 'checking' | 'denied' | 'admin'; user: AdminUser }

/** صفحة ‎/admin كاملة: الشريط العلوي + ما يناسب حالة الجلسة */
export default function AdminApp() {
  const { t } = useLang()
  const { admin } = site
  const [session, setSession] = useState<Session>({ state: firebaseEnabled ? 'loading' : 'off' })

  useEffect(() => {
    if (!firebaseEnabled) return
    // آخر حساب وصلنا: حتى لا تغيّر نتيجة فحص قديم الحالة بعد تسجيل الخروج
    let currentUid: string | null = null

    const stop = watchAuth((user) => {
      currentUid = user?.uid ?? null
      if (!user) {
        setSession({ state: 'signedOut' })
        return
      }
      setSession({ state: 'checking', user })
      void isAdmin(user.uid).then((allowed) => {
        if (currentUid === user.uid) setSession({ state: allowed ? 'admin' : 'denied', user })
      })
    })

    return () => {
      currentUid = null
      stop()
    }
  }, [])

  const signedIn = session.state === 'denied' || session.state === 'admin'

  return (
    <div className="min-h-dvh">
      <a href="#main" className="skip-link">
        {t(site.ui.skipToContent)}
      </a>

      <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <a href="/" title={t(admin.backToSite)} className="inline-flex min-w-0 items-center gap-2 rounded-full">
            <span className="font-heading text-2xl leading-none font-semibold">{t(site.brand.name)}</span>
            <IconSparkle className="size-3 shrink-0 -translate-y-2 text-gold" />
            <span className="truncate border-s border-line ps-3 text-sm text-ink-soft max-sm:hidden">{t(admin.title)}</span>
            <span className="sr-only">: {t(admin.backToSite)}</span>
          </a>
          <div className="flex shrink-0 items-center gap-2">
            <LangToggle />
            <ThemeToggle />
            {signedIn && (
              <Button variant="outline" className="h-10 px-4" onClick={() => void signOutAdmin()}>
                {t(admin.signOut)}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="container-page pt-8 pb-20 outline-none sm:pt-12">
        {session.state === 'off' && <Notice title={t(admin.notConfigured.title)}>{t(admin.notConfigured.text)}</Notice>}

        {(session.state === 'loading' || session.state === 'checking') && (
          <p role="status" className="mt-16 text-center text-ink-soft">
            {t(admin.loading)}
          </p>
        )}

        {session.state === 'signedOut' && <AdminLogin />}

        {session.state === 'denied' && (
          <Notice title={t(admin.notAllowed.title)}>
            {t(admin.notAllowed.text)}
            <span className="mt-5 block text-xs text-ink-soft">{t(admin.notAllowed.uidLabel)}</span>
            {/* select-all: ضغطة واحدة تحدد المعرّف كاملًا لنسخه */}
            <code dir="ltr" className="mt-1 block rounded-field bg-sand px-4 py-3 text-sm break-all text-ink select-all">
              {session.user.uid}
            </code>
          </Notice>
        )}

        {session.state === 'admin' && (
          <>
            <h1 className="heading-section">{t(admin.title)}</h1>
            <p dir="ltr" className="mt-1 text-sm text-ink-soft rtl:text-right">
              {session.user.email}
            </p>
            <AdminBookings />
          </>
        )}
      </main>
    </div>
  )
}

/** بطاقة رسالة في منتصف الصفحة (غير مفعّلة / ليس مديرًا) */
function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:mt-16 sm:p-10">
      <h1 className="heading-card">{title}</h1>
      <div className="mt-3 text-sm text-ink-soft">{children}</div>
    </div>
  )
}
