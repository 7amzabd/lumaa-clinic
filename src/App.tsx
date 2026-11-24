import { useCallback, useState } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { FloatingWhatsapp } from './components/layout/FloatingWhatsapp'
import { MobileBookingBar } from './components/layout/MobileBookingBar'
import { Booking } from './components/sections/Booking'
import { Faq } from './components/sections/Faq'
import { Hero } from './components/sections/Hero'
import { Journey } from './components/sections/Journey'
import { Results } from './components/sections/Results'
import { Services } from './components/sections/Services'
import { SkinQuiz } from './components/sections/SkinQuiz'
import { Team } from './components/sections/Team'
import { Testimonials } from './components/sections/Testimonials'
import { Why } from './components/sections/Why'
import { Preloader } from './components/ui/Preloader'
import { site } from './content/site'
import { useLang } from './i18n/useLang'
import { IntroContext } from './state/IntroContext'

/**
 * الصفحة كاملة: ترتيب الأقسام من الأعلى إلى الأسفل.
 * لتغيير ترتيب قسم، انقل سطره هنا (ورابطه في site.nav إن وُجد).
 */
export default function App() {
  const { t } = useLang()
  // تصبح true بعد شاشة التحميل القصيرة، فتبدأ حركات الصفحة الرئيسية
  const [introDone, setIntroDone] = useState(false)
  const finishIntro = useCallback(() => setIntroDone(true), [])

  return (
    <IntroContext.Provider value={introDone}>
      <Preloader onDone={finishIntro} />
      <a href="#main" className="skip-link">
        {t(site.ui.skipToContent)}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Services />
        <SkinQuiz />
        <Journey />
        <Why />
        <Results />
        <Team />
        <Testimonials />
        <Booking />
        <Faq />
      </main>
      <Footer />
      <MobileBookingBar />
      <FloatingWhatsapp />
    </IntroContext.Provider>
  )
}
