'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// Animated counter hook
function useCounter(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (!isVisible) return
    
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * (end - start) + start))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, start, duration])
  
  return [count, setIsVisible]
}

// Particle component
function Particle({ delay, duration, size, startX, startY }) {
  return (
    <div
      className="absolute rounded-full bg-emerald-500/30 animate-particle"
      style={{
        width: size,
        height: size,
        left: `${startX}%`,
        top: `${startY}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  )
}

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const sectionRef = useRef(null)
  
  const words = ['o aventură', 'mai ușoară', 'fascinantă', 'accesibilă']
  const fullText = words[currentWordIndex]
  
  const [studentsCount, setStudentsVisible] = useCounter(1000, 2500)
  const [teachersCount, setTeachersVisible] = useCounter(50, 2000)
  const [successCount, setSuccessVisible] = useCounter(99, 2200)
  const [yearsCount, setYearsVisible] = useCounter(10, 1500)

  // Typing effect
  useEffect(() => {
    if (!isLoaded) return
    
    let timeout
    if (typedText.length < fullText.length) {
      timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 100)
    } else {
      timeout = setTimeout(() => {
        setTypedText('')
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      }, 2000)
    }
    return () => clearTimeout(timeout)
  }, [typedText, fullText, isLoaded, words.length])

  useEffect(() => {
    setIsLoaded(true)
    setStudentsVisible(true)
    setTeachersVisible(true)
    setSuccessVisible(true)
    setYearsVisible(true)
    
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 30
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Generate particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 4,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
  }))

  const stats = [
    { value: studentsCount, suffix: '+', label: 'Elevi activi', color: 'from-emerald-400 to-teal-400' },
    { value: teachersCount, suffix: '+', label: 'Profesori dedicați', color: 'from-cyan-400 to-emerald-400' },
    { value: successCount, suffix: '%', label: 'Rată de succes', color: 'from-emerald-400 to-lime-400' },
    { value: yearsCount, suffix: '+', label: 'Ani de experiență', color: 'from-teal-400 to-emerald-400' },
  ]

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at ${50 + mousePosition.x * 0.5}% ${50 + mousePosition.y * 0.5}%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at ${30 - mousePosition.x * 0.3}% ${70 - mousePosition.y * 0.3}%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse 50% 60% at ${70 + mousePosition.x * 0.2}% ${30 + mousePosition.y * 0.2}%, rgba(52, 211, 153, 0.1) 0%, transparent 50%)
            `,
            transition: 'background 0.3s ease-out'
          }}
        />
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            transform: `perspective(500px) rotateX(60deg) translateY(-50%)`,
            transformOrigin: 'center top',
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Rotating ring */}
        <div 
          className="absolute top-1/4 -left-20 w-96 h-96 border border-emerald-500/20 rounded-full animate-spin-slow"
          style={{ animationDuration: '30s' }}
        />
        <div 
          className="absolute top-1/4 -left-20 w-80 h-80 border border-emerald-500/10 rounded-full animate-spin-slow"
          style={{ animationDuration: '25s', animationDirection: 'reverse' }}
        />
        
        {/* Floating hexagons */}
        <svg className="absolute top-20 right-20 w-32 h-32 text-emerald-500/10 animate-float-slow" viewBox="0 0 100 100">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg className="absolute bottom-32 left-32 w-24 h-24 text-emerald-500/10 animate-float-slow" style={{ animationDelay: '2s' }} viewBox="0 0 100 100">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        
        {/* Orbiting dots */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 animate-orbit">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
          </div>
          <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '20s', animationDelay: '-5s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
          </div>
          <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '25s', animationDelay: '-10s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50" />
          </div>
        </div>
      </div>

      {/* Glowing center orb */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Animated Badge */}
          <div className={`inline-flex items-center gap-2 mb-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95'}`}>
            <div className="relative group cursor-pointer">
              {/* Glow behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
              
              <div className="relative flex items-center gap-3 px-5 py-2.5 bg-[#0d0d0d] border border-emerald-500/30 rounded-full">
                {/* Live indicator */}
                <div className="flex items-center gap-2 pr-3 border-r border-white/10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Live</span>
                </div>
                
                {/* Text */}
                <span className="text-white/90 text-sm">Înscrieri deschise</span>
                
                {/* Year badge */}
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                  2026
                </span>
              </div>
            </div>
          </div>

          {/* Main Heading with Typing Effect */}
          <div className={`mb-10 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter">
              <span className="block mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Matematica
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-7xl font-light text-gray-500">
                devine
              </span>
              <span className="relative block mt-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 animate-gradient">
                  {typedText}
                </span>
                <span className="inline-block w-[3px] h-[0.9em] bg-emerald-400 ml-1 animate-blink align-middle" />
              </span>
            </h1>
          </div>

          {/* Subtitle with reveal animation */}
          <p className={`text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto mb-14 leading-relaxed font-light transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            Lecții personalizate pentru elevii din clasele <span className="text-emerald-400 font-medium">I-XII</span>.
            <br className="hidden sm:block" />
            Online sau fizic, adaptate <span className="text-white font-medium">stilului tău</span> de învățare.
          </p>

          {/* CTA Buttons with glow */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-5 mb-24 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <Link
              href="/inscriere"
              className="group relative w-full sm:w-auto"
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden">
                <span className="relative z-10">Înscrie-te acum</span>
                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                {/* Animated shine */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
              </div>
            </Link>
            
            <button
              onClick={() => document.getElementById('cursuri')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative w-full sm:w-auto px-10 py-5 bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all duration-500 backdrop-blur-xl flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <svg className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Explorează cursurile</span>
            </button>
          </div>

          {/* Stats Grid with animated counters */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="group relative p-8 lg:p-10 rounded-3xl overflow-hidden cursor-default"
              >
                {/* Background with glassmorphism */}
                <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Animated border on hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-3xl border border-emerald-500/30 animate-border-pulse" />
                </div>
                
                <div className="relative">
                  <div className={`text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-gray-500 text-sm lg:text-base font-medium tracking-wide">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-medium">Descoperă mai mult</span>
        <div className="relative w-6 h-10 rounded-full border border-gray-700/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full animate-scroll-indicator" />
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes particle {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0);
            opacity: 0;
          }
        }
        .animate-particle {
          animation: particle linear infinite;
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit {
          animation: orbit 15s linear infinite;
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        @keyframes scroll-indicator {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-scroll-indicator {
          animation: scroll-indicator 2s ease-in-out infinite;
        }
        
        @keyframes border-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .animate-border-pulse {
          animation: border-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
