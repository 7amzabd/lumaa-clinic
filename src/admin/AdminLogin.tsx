import { useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { site } from '../content/site'
import type { SignInErrorKey } from '../content/types'
import { signIn } from '../firebase/admin'
import { useLang } from '../i18n/useLang'
import { inputClass } from '../lib/form'

/** نموذج دخول الإدارة: بريد وكلمة مرور (الحساب يُنشأ من Firebase Console) */
export function AdminLogin() {
  const { t } = useLang()
  const { login } = site.admin
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<SignInErrorKey | null>(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('empty')
      return
    }
    setBusy(true)
    setError(null)
    // عند النجاح تنتقل AdminApp تلقائيًا إلى لوحة الحجوزات
    const failure = await signIn(email, password)
    if (failure) {
      setError(failure)
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:mt-16 sm:p-10">
      <h1 className="heading-card">{t(login.title)}</h1>
      <p className="mt-2 text-sm text-ink-soft">{t(login.intro)}</p>

      <form noValidate onSubmit={handleSubmit} className="mt-8 grid gap-5">
        <FormField id="admin-email" label={t(login.email)}>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby={error ? 'admin-login-error' : undefined}
            className={`${inputClass} h-13 rtl:text-right`}
          />
        </FormField>
        <FormField id="admin-password" label={t(login.password)}>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            dir="ltr"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby={error ? 'admin-login-error' : undefined}
            className={`${inputClass} h-13 rtl:text-right`}
          />
        </FormField>

        {error && (
          <p
            id="admin-login-error"
            role="alert"
            className="rounded-field border border-danger/30 px-4 py-3 text-sm text-danger"
          >
            {t(login.errors[error])}
          </p>
        )}

        <Button type="submit" size="lg" disabled={busy} className="w-full">
          {t(busy ? login.submitting : login.submit)}
        </Button>
      </form>
    </div>
  )
}
