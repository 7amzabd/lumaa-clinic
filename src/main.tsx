import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdminPage } from './admin/AdminPage'
import App from './App'
import { site } from './content/site'
import { LanguageProvider } from './i18n/LanguageProvider'
import { BookingProvider } from './state/BookingProvider'
import './styles/global.css'
import { ThemeProvider } from './theme/ThemeProvider'

// هل فتح الزائر صفحة الإدارة ‎/admin؟ (في Vercel يوجّهها ملف vercel.json إلى الصفحة نفسها)
const isAdminPage = window.location.pathname.replace(/\/+$/, '') === '/admin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider title={isAdminPage ? site.admin.pageTitle : undefined}>
      <ThemeProvider>
        {/* reducedMotion="user": يلغي حركات الإزاحة إذا فعّل الزائر «تقليل الحركة» في جهازه */}
        <MotionConfig reducedMotion="user">
          {/* LazyMotion: يحمّل الجزء الذي نحتاجه فقط من مكتبة motion، فيبقى الموقع خفيفًا */}
          <LazyMotion features={domAnimation} strict>
            {isAdminPage ? (
              <AdminPage />
            ) : (
              <BookingProvider>
                <App />
              </BookingProvider>
            )}
          </LazyMotion>
        </MotionConfig>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)
