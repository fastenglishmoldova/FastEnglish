'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const navRef = useRef(null)
  const linksRef = useRef({})

  // On non-homepage, always use dark navbar styling (as if scrolled)
  const useDarkNav = isScrolled || !isHomePage
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      const sections = ['home', 'cursuri', 'despre', 'recenzii', 'faq', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update indicator position when active section changes
  useEffect(() => {
    const activeLink = linksRef.current[activeSection]
    if (activeLink && !isHovering) {
      const rect = activeLink.getBoundingClientRect()
      const navRect = navRef.current?.getBoundingClientRect()
      if (navRect) {
        setIndicatorStyle({
          width: rect.width,
          left: rect.left - navRect.left,
          opacity: 1
        })
      }
    }
  }, [activeSection, isHovering])

  const handleMouseMove = (e) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleLinkHover = (linkId) => {
    setIsHovering(true)
    const link = linksRef.current[linkId]
    if (link && navRef.current) {
      const rect = link.getBoundingClientRect()
      const navRect = navRef.current.getBoundingClientRect()
      setIndicatorStyle({
        width: rect.width,
        left: rect.left - navRect.left,
        opacity: 1
      })
    }
  }

  const handleNavLeave = () => {
    setIsHovering(false)
    const activeLink = linksRef.current[activeSection]
    if (activeLink && navRef.current) {
      const rect = activeLink.getBoundingClientRect()
      const navRect = navRef.current.getBoundingClientRect()
      setIndicatorStyle({
        width: rect.width,
        left: rect.left - navRect.left,
        opacity: 1
      })
    }
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { id: 'home', label: 'Acasă', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    )},
    { id: 'cursuri', label: 'Cursuri', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    )},
    { id: 'despre', label: 'Despre', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    )},
    { id: 'recenzii', label: 'Recenzii', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    )},
    { id: 'faq', label: 'FAQ', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    )},
    { id: 'contact', label: 'Contact', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    )},
  ]

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          useDarkNav 
            ? 'py-2' 
            : 'py-4'
        }`}
        onMouseMove={handleMouseMove}
      >
        {/* Background with blur */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          useDarkNav 
            ? 'bg-white/90 backdrop-blur-2xl border-b border-gray-200 shadow-sm' 
            : 'bg-transparent'
        }`} />

        {/* Spotlight effect following mouse */}
        {useDarkNav && (
          <div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(200, 16, 46, 0.03), transparent 40%)`
            }}
          />
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-3 group relative"
            >
              {/* Logo glow */}
              <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/FastEnglish-logo.png"
                  alt="Fast English Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative flex flex-col">
                <span className={`text-lg lg:text-xl font-bold transition-colors duration-300 ${useDarkNav ? 'text-gray-900 group-hover:text-red-600' : 'text-white group-hover:text-red-400 drop-shadow-lg'}`}>
                  Fast English
                </span>
                <span className={`text-[10px] font-medium tracking-wider uppercase hidden sm:block transition-colors duration-300 ${useDarkNav ? 'text-gray-500' : 'text-white/80'}`}>
                  Learn English Fast
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div 
              ref={navRef}
              className="hidden lg:flex items-center relative"
              onMouseLeave={handleNavLeave}
            >
              {/* Sliding indicator */}
              <div 
                className={`absolute h-9 rounded-xl border transition-all duration-300 ease-out ${useDarkNav ? 'bg-gradient-to-r from-red-500/20 to-blue-800/20 border-red-500/20' : 'bg-white/10 backdrop-blur-sm border-white/20'}`}
                style={{
                  width: indicatorStyle.width || 0,
                  left: indicatorStyle.left || 0,
                  opacity: indicatorStyle.opacity || 0,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  ref={(el) => linksRef.current[link.id] = el}
                  onClick={() => scrollToSection(link.id)}
                  onMouseEnter={() => handleLinkHover(link.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeSection === link.id
                      ? useDarkNav ? 'text-red-600' : 'text-red-400 drop-shadow-lg'
                      : useDarkNav ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white drop-shadow-md'
                  }`}
                >
                  <span className={`transition-transform duration-300 ${activeSection === link.id ? 'scale-110' : ''}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/inscriere"
                className="group relative px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 overflow-hidden"
              >
                <span>Înscrie-te</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                useDarkNav 
                  ? 'bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                  : 'bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30'
              }`}
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white border-l border-gray-200 transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-gray-900 font-semibold">Meniu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Links */}
          <div className="p-4 space-y-2">
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                  activeSection === link.id
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className={`p-2 rounded-xl ${activeSection === link.id ? 'bg-red-100' : 'bg-gray-100'}`}>
                  {link.icon}
                </span>
                <span className="font-medium">{link.label}</span>
                <svg className={`w-4 h-4 ml-auto transition-transform ${activeSection === link.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
          
          {/* CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <Link
              href="/inscriere"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Înscrie-te acum
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
