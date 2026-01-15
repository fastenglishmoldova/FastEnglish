import Navbar from '@/components/public/Navbar'
import HeroSection from '@/components/public/HeroSection'
import CoursesSection from '@/components/public/CoursesSection'
import AboutSection from '@/components/public/AboutSection'
import ContactSection from '@/components/public/ContactSection'
import ReviewsSection from '@/components/public/ReviewsSection'
import FAQSection from '@/components/public/FAQSection'
import Footer from '@/components/public/Footer'


export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CoursesSection />
        <AboutSection />
        <ContactSection />
        <ReviewsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
