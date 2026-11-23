import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n/LanguageProvider'
import { BookingProvider } from './state/BookingProvider'
import './styles/global.css'
import { ThemeProvider } from './theme/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <BookingProvider>
          {/* reducedMotion="user": يلغي حركات الإزاحة إذا فعّل الزائر «تقليل الحركة» في جهازه */}
          <MotionConfig reducedMotion="user">
            {/* LazyMotion: يحمّل الجزء الذي نحتاجه فقط من مكتبة motion، فيبقى الموقع خفيفًا */}
            <LazyMotion features={domAnimation} strict>
              <App />
            </LazyMotion>
          </MotionConfig>
        </BookingProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)
