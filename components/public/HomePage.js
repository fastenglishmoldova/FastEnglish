'use client'

import HeroSection from './HeroSection'
import CoursesSection from './CoursesSection'
import AboutSection from './AboutSection'
import ReviewsSection from './ReviewsSection'
import FAQSection from './FAQSection'
import ContactSection from './ContactSection'
import CTASection from './CTASection'

export default function HomePage() {
  return (
    <main className="bg-[#0a0a0a]">
      <HeroSection />
      <CoursesSection />
      <AboutSection />
      <ReviewsSection />
      <FAQSection />
      <ContactSection />
      <CTASection />
    </main>
  )
}
