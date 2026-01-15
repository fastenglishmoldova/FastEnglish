'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

const footerLinks = {
  legal: [
    { label: 'Termeni și condiții', href: '/termeni' },
    { label: 'Politica de confidențialitate (GDPR)', href: '/gdpr' }
  ]
}

export default function Footer() {
  const [courses, setCourses] = useState([])
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/public/courses')
      if (res.ok) {
        const data = await res.json()
        setCourses(data.slice(0, 4)) // Limitează la primele 4 cursuri
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const scrollToSection = (e, href) => {
    e.preventDefault()
    if (href.startsWith('#')) {
      // Dacă nu suntem pe pagina principală, navigăm acolo cu hash
      if (!isHomePage) {
        router.push('/' + href)
        return
      }
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-[#0a1214] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src="/bravito.png"
                  alt="Bravito After School"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">BRAVITO</span>
                <span className="text-[10px] font-medium text-[#f8b316] tracking-[0.15em]">AFTER SCHOOL</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Școala unde copiii învață jucându-se și cresc împreună.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61566901452196" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#30919f]/20 rounded-lg flex items-center justify-center hover:bg-[#30919f]/40 transition-colors text-[#30919f]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/bravitoaftherschool/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#30919f]/20 rounded-lg flex items-center justify-center hover:bg-[#30919f]/40 transition-colors text-[#30919f]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@bravito.afther.school" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#30919f]/20 rounded-lg flex items-center justify-center hover:bg-[#30919f]/40 transition-colors text-[#30919f]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links - Navigație */}
          <div>
            <h4 className="font-semibold mb-4 text-[#f8b316]">Navigație</h4>
            <ul className="space-y-3">
              {['Home', 'Cursuri', 'About', 'Contact', 'Reviews', 'FAQ'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => scrollToSection(e, `#${item.toLowerCase()}`)}
                    className="text-gray-400 hover:text-[#30919f] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Cursuri */}
          <div>
            <h4 className="font-semibold mb-4 text-[#f8b316]">Cursuri populare</h4>
            <ul className="space-y-3">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <li key={course.id}>
                    <a 
                      href="#cursuri"
                      onClick={(e) => scrollToSection(e, '#cursuri')}
                      className="text-gray-400 hover:text-[#30919f] transition-colors"
                    >
                      {course.title}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">Se încarcă...</li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-[#f8b316]">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a 
                  href="https://www.google.com/maps/place/Platinum+Business+Center/@47.030129,28.8349256,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#30919f] transition-colors"
                >
                  <MapPinIcon className="w-5 h-5 text-[#30919f] flex-shrink-0" />
                  <span>Str. M.V. Bănulescu Bodoni 57/1, of. 316A</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.google.com/maps/search/Strada+Miron+Costin+7%2Fa+Chi%C8%99in%C4%83u"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#30919f] transition-colors"
                >
                  <MapPinIcon className="w-5 h-5 text-[#30919f] flex-shrink-0" />
                  <span>Râșcani, Str. Miron Costin 7/a</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+37369352282"
                  className="flex items-center gap-2 hover:text-[#30919f] transition-colors"
                >
                  <PhoneIcon className="w-5 h-5 text-[#30919f] flex-shrink-0" />
                  <span>+373 69 352 282</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:bravito.after.school@gmail.com"
                  className="flex items-center gap-2 hover:text-[#30919f] transition-colors"
                >
                  <EnvelopeIcon className="w-5 h-5 text-[#30919f] flex-shrink-0" />
                  <span>bravito.after.school@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#1e3d44] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Bravito After School. Toate drepturile rezervate.
          </p>
          <div className="flex gap-6 text-sm">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="text-gray-400 hover:text-[#30919f] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
