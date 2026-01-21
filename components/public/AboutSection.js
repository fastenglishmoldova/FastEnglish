'use client'

import { useState, useEffect, useRef } from 'react'

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const values = [
    {
      title: 'Învățare prin înțelegere',
      description: 'Nu memorare mecanică. Fiecare concept este explicat până când devine intuitiv și natural pentru elev.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'emerald'
    },
    {
      title: 'Atenție individualizată',
      description: 'Grupe mici care permit profesorului să observe și să ghideze fiecare elev în parte.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'teal'
    },
    {
      title: 'Pasiune pentru predare',
      description: 'Profesori care iubesc ceea ce fac și știu să transmită această pasiune elevilor.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'rose'
    },
    {
      title: 'Rezultate măsurabile',
      description: 'Progres vizibil și documentat. Fiecare elev își vede evoluția la fiecare pas.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'amber'
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % values.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [values.length])

  const getColorClasses = (color) => {
    const colors = {
      emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
      teal: { bg: 'bg-teal-500/20', border: 'border-teal-500/30', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
      rose: { bg: 'bg-rose-500/20', border: 'border-rose-500/30', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
      amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    }
    return colors[color]
  }

  return (
    <section id="despre" ref={sectionRef} className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030303]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 lg:mb-20">
          <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-full mb-4 sm:mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-gray-400 text-xs sm:text-sm">Despre noi</span>
          </div>
          
          <h2 className={`text-2xl sm:text-4xl lg:text-6xl font-black text-white mb-4 sm:mb-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Mai mult decât o{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 animate-gradient">
                școală
              </span>
              <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 2 150 2 198 10" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#10b981"/>
                    <stop offset="0.5" stopColor="#14b8a6"/>
                    <stop offset="1" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          
          <p className={`text-gray-400 text-sm sm:text-lg lg:text-xl max-w-3xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Suntem o comunitate dedicată transformării modului în care copiii percep matematica — 
            de la frică la fascinație, de la confuzie la claritate.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          {/* Left - Values Showcase */}
          <div className={`space-y-3 sm:space-y-4 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {values.map((value, index) => {
              const colors = getColorClasses(value.color)
              const isActive = activeIndex === index
              
              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-500 ${
                    isActive 
                      ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}` 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors ${isActive ? colors.bg : 'bg-white/10'}`}>
                      <div className={`transition-colors ${isActive ? colors.text : 'text-gray-400'} [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-8 sm:[&>svg]:h-8`}>
                        {value.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-base sm:text-lg mb-1 transition-colors ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {value.title}
                      </h3>
                      <p className={`text-xs sm:text-sm transition-all duration-500 ${isActive ? 'text-gray-300 max-h-20 opacity-100' : 'text-gray-500 max-h-0 opacity-0 overflow-hidden'}`}>
                        {value.description}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${isActive ? `${colors.text} scale-100` : 'bg-gray-600 scale-75'}`} style={{ backgroundColor: isActive ? 'currentColor' : undefined }} />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right - Visual Card */}
          <div className={`relative transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent rounded-2xl sm:rounded-[3rem] blur-3xl" />
              
              {/* Main Card */}
              <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl sm:rounded-[3rem] border border-white/20 p-5 sm:p-8 lg:p-12 overflow-hidden">
                {/* Pi Symbol Background */}
                <div className="absolute -right-10 -bottom-10 text-[12rem] sm:text-[20rem] font-black text-white/[0.03] select-none">π</div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-500/20 rounded-full mb-4 sm:mb-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span className="text-emerald-400 text-[10px] sm:text-xs font-medium">Misiunea noastră</span>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                      Facem matematica <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                        accesibilă tuturor
                      </span>
                    </h3>
                    
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      Credem că fiecare copil are potențialul de a excela la matematică. 
                      Rolul nostru este să descoperim și să cultivăm acest potențial 
                      prin metode care inspiră și motivează.
                    </p>
                  </div>

                  {/* Floating Badges */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8">
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full border border-white/10 flex items-center gap-1.5 sm:gap-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-white text-[10px] sm:text-sm font-medium">Obiective clare</span>
                    </div>
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full border border-white/10 flex items-center gap-1.5 sm:gap-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-white text-[10px] sm:text-sm font-medium">Progres rapid</span>
                    </div>
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full border border-white/10 flex items-center gap-1.5 sm:gap-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-white text-[10px] sm:text-sm font-medium">Metodă unică</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-14 sm:w-20 h-14 sm:h-20 border border-emerald-500/20 rounded-full" />
                <div className="absolute top-7 sm:top-10 right-7 sm:right-10 w-8 sm:w-12 h-8 sm:h-12 border border-teal-500/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`mt-10 sm:mt-16 lg:mt-24 text-center transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-2 bg-white/5 rounded-2xl sm:rounded-full border border-white/10">
            <div className="flex -space-x-3 px-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border-2 border-[#030303] flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              ))}
            </div>
            <div className="text-center sm:text-left px-2">
              <p className="text-white font-semibold text-sm sm:text-base">Alătură-te comunității noastre</p>
              <p className="text-gray-500 text-xs sm:text-sm">Peste 1000 de elevi ne-au ales deja</p>
            </div>
            <a 
              href="#cursuri"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white text-sm sm:text-base font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
            >
              Vezi cursurile
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}
