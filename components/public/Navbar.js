'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { 
  HomeIcon, 
  AcademicCapIcon, 
  InformationCircleIcon, 
  PhoneIcon, 
  StarIcon, 
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const navLinks = [
  { href: '#home', label: 'Home', icon: HomeIcon },
  { href: '#cursuri', label: 'Cursuri', icon: AcademicCapIcon },
  { href: '#about', label: 'About', icon: InformationCircleIcon },
  { href: '#contact', label: 'Contact', icon: PhoneIcon },
  { href: '#reviews', label: 'Reviews', icon: StarIcon },
  { href: '#faq', label: 'FAQ', icon: ChatBubbleLeftRightIcon }
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'MANAGER'
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    navLinks.forEach(link => {
      const section = document.querySelector(link.href)
      if (section) observer.observe(section)
    })

    window.addEventListener('scroll', handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const sectionId = href.slice(1) // Remove the # from href
    setActiveSection(sectionId) // Immediately update active section
    setIsMobileMenuOpen(false)
    
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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-[#136976]/95 backdrop-blur-md shadow-xl shadow-black/10 border-b border-[#30919f]/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105 rounded-full overflow-hidden ring-2 ring-[#30919f]/50 group-hover:ring-[#f8b316] shadow-lg">
              <Image
                src="/bravito.png"
                alt="Bravito After School"
                fill
                className="object-cover drop-shadow-lg"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight leading-tight">
                BRAVITO
              </span>
              <span className="text-[10px] font-medium text-[#f8b316] tracking-[0.2em] uppercase">
                After School
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-full p-1.5 border border-white/10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeSection === link.href.slice(1)
                      ? 'text-[#136976] bg-white shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <link.icon className={`w-4 h-4 transition-colors ${
                    activeSection === link.href.slice(1) ? 'text-[#30919f]' : ''
                  }`} />
                  <span>{link.label}</span>
                  {activeSection === link.href.slice(1) && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#f8b316] rounded-full" />
                  )}
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 ml-6">
              {/* Înscrie-te Button - for everyone */}
              <Link
                href="/inscriere"
                className="relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-[#f8b316] to-[#e5a310] text-[#231f20] rounded-full text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#f8b316]/30 hover:scale-105 group flex items-center gap-2"
              >
                <PencilSquareIcon className="w-4 h-4" />
                <span className="relative z-10">Înscrie-te</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#e5a310] to-[#f8b316] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              {/* Admin Button - only for admins */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="relative overflow-hidden px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-[#30919f] group flex items-center gap-2"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile: Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:bg-white/20"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-1 bg-[#136976]/90 backdrop-blur-lg rounded-2xl mb-4 border border-white/10">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`flex items-center gap-3 mx-2 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeSection === link.href.slice(1)
                    ? 'text-[#136976] bg-white shadow-lg'
                    : 'text-white/90 hover:bg-white/10'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <link.icon className={`w-5 h-5 ${
                  activeSection === link.href.slice(1) ? 'text-[#30919f]' : 'text-[#f8b316]'
                }`} />
                <span>{link.label}</span>
                {activeSection === link.href.slice(1) && (
                  <span className="ml-auto w-2 h-2 bg-[#f8b316] rounded-full animate-pulse" />
                )}
              </a>
            ))}
            <div className="mx-2 pt-2 space-y-2">
              <Link
                href="/inscriere"
                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-[#f8b316] to-[#e5a310] text-[#231f20] rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#f8b316]/30"
              >
                <PencilSquareIcon className="w-5 h-5" />
                Înscrie-te acum
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white/10 text-white rounded-xl text-sm font-semibold border border-white/20 transition-all duration-300 hover:bg-white/20"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}