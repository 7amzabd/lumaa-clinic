import { Suspense, lazy } from 'react'

// لوحة الإدارة (ومعها مكتبة Firebase) تُحمَّل فقط عند فتح ‎/admin، فلا تثقل الموقع على الزوار
const AdminApp = lazy(() => import('./AdminApp'))

/** مدخل صفحة ‎/admin: يحمّل اللوحة عند الحاجة */
export function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminApp />
    </Suspense>
  )
}
