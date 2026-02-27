'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const heroRef = useRef(null)

  const phrases = [
    'Learn Fast',
    'Speak Confident', 
    'Start Today',
    'Join Us'
  ]

  // Parallax effect on scroll - disabled on mobile for performance
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 640) {
        setScrollY(window.scrollY)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load animation
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Phrase rotation with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [phrases.length])

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Big Ben Background - Full Screen */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: scrollY > 0 ? `translateY(${scrollY * 0.3}px)` : 'none',
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1543832923-44667a44c804?auto=format&fit=crop&w=2560&q=95"
          alt="Big Ben London"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient Overlays - stronger on mobile for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 sm:from-black/60 sm:via-black/40 sm:to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-red-900/20" />
      </div>

      {/* Animated Particles - reduced on mobile */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none hidden sm:block">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              background: i % 3 === 0 
                ? 'rgba(200, 16, 46, 0.6)' 
                : i % 3 === 1 
                  ? 'rgba(255, 255, 255, 0.8)' 
                  : 'rgba(1, 33, 105, 0.6)',
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 15 + 10}s`,
            }}
          />
        ))}
      </div>
      {/* Fewer particles on mobile */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none sm:hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: i % 3 === 0 
                ? 'rgba(200, 16, 46, 0.5)' 
                : i % 3 === 1 
                  ? 'rgba(255, 255, 255, 0.6)' 
                  : 'rgba(1, 33, 105, 0.5)',
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 15 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Union Jack Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-white to-blue-900 z-20" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-white to-red-600 z-20" />

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-0">
        {/* Logo */}
        <div 
          className={`mb-6 sm:mb-12 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 xs:gap-3 sm:gap-4 px-4 xs:px-5 sm:px-8 py-3 xs:py-4 sm:py-5 bg-white/15 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 sm:border-2 sm:border-white/30 shadow-2xl hover:bg-white/20 sm:hover:scale-105 transition-all duration-500 group">
            {/* Logo glow effect - hidden on very small screens */}
            <div className="absolute -inset-2 bg-gradient-to-r from-red-500/30 via-white/20 to-blue-600/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity hidden sm:block" />
            
            <div className="relative flex-shrink-0">
              <Image
                src="/FastEnglish-logo.png"
                alt="Fast English Logo"
                width={70}
                height={70}
                className="w-10 h-10 xs:w-12 xs:h-12 sm:w-[70px] sm:h-[70px] rounded-xl sm:rounded-2xl shadow-lg group-hover:rotate-3 transition-transform duration-500"
              />
            </div>
            
            <div className="relative flex flex-col min-w-0">
              <span className="text-white font-black text-lg xs:text-xl sm:text-3xl lg:text-4xl tracking-tight drop-shadow-lg group-hover:text-red-100 transition-colors whitespace-nowrap">
                Fast English
              </span>
              <span className="text-white/80 font-medium text-[10px] xs:text-xs sm:text-sm lg:text-base tracking-wider uppercase">
                Learn English Fast
              </span>
            </div>
          </div>
        </div>

        {/* Main Heading with Typewriter */}
        <div 
          className={`transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-3xl xs:text-4xl sm:text-6xl lg:text-8xl font-black text-white mb-4 sm:mb-6 leading-tight">
            <span className="block text-white/90 text-lg xs:text-xl sm:text-4xl lg:text-5xl font-medium mb-2 sm:mb-4">
              Welcome to
            </span>
            <div className="relative h-12 xs:h-14 sm:h-24 lg:h-32 overflow-hidden">
              {phrases.map((phrase, index) => (
                <span
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                    index === currentPhrase
                      ? 'opacity-100 translate-y-0'
                      : index < currentPhrase
                      ? 'opacity-0 -translate-y-full'
                      : 'opacity-0 translate-y-full'
                  }`}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-600 drop-shadow-2xl text-[1.75rem] xs:text-3xl sm:text-5xl lg:text-7xl">
                    {phrase}
                  </span>
                </span>
              ))}
            </div>
          </h1>

          <p className="text-sm xs:text-base sm:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed font-light px-2">
            Cursuri de engleză pentru toate nivelurile. 
            <span className="text-red-400 font-medium"> Învață</span>, 
            <span className="text-white font-medium"> practică</span>, 
            <span className="text-blue-400 font-medium"> excelează</span>.
          </p>
        </div>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-16 px-2 transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Link
            href="/inscriere"
            className="group relative w-full sm:w-auto px-6 xs:px-8 sm:px-10 py-3.5 xs:py-4 sm:py-5 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/40 sm:hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
              Începe Acum
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <a
            href="#cursuri"
            className="group w-full sm:w-auto px-6 xs:px-8 sm:px-10 py-3.5 xs:py-4 sm:py-5 bg-white/10 backdrop-blur-md text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl border border-white/20 sm:border-2 sm:border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 active:scale-95"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Vezi Cursurile
          </a>
        </div>
      </div>

      {/* Scroll Indicator - smaller on mobile */}
      <div 
        className={`absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 delay-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <a 
          href="#cursuri" 
          className="flex flex-col items-center gap-1 sm:gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <span className="text-xs sm:text-sm font-medium hidden xs:block">Descoperă mai mult</span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5 sm:p-2 group-hover:border-white/60 transition-colors">
            <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-white/70 rounded-full animate-bounce group-hover:bg-white" />
          </div>
        </a>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          50% { transform: translateY(-10px) translateX(-10px) rotate(-5deg); }
          75% { transform: translateY(-30px) translateX(5px) rotate(3deg); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
