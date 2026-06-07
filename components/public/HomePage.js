'use client'

import HeroSection from './HeroSection'
import CoursesSection from './CoursesSection'
import AboutSection from './AboutSection'
import ReviewsSection from './ReviewsSection'
import FAQSection from './FAQSection'
import ContactSection from './ContactSection'

export default function HomePage() {
  return (
    <main className="bg-[#FFFBF5]">
      <HeroSection />
      <CoursesSection />
      <AboutSection />
      <ReviewsSection />
      <FAQSection />
      <ContactSection />
    </main>
  )
}
