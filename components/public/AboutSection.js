'use client'

import { useState, useEffect, useRef } from 'react'

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const values = [
    {
      title: 'Vorbitori nativi',
      description: 'Profesori britanici și americani cu experiență, care te ajută să vorbești natural și fără accent.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      color: 'red'
    },
    {
      title: 'Conversații reale',
      description: 'Nu doar gramatică! Învățăm prin discuții interactive, roleplay-uri și situații de zi cu zi.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      title: 'Grupe mici',
      description: 'Maximum 8 cursanți per grupă pentru atenție personalizată și timp de vorbire maxim.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'rose'
    },
    {
      title: 'Progres rapid',
      description: 'Metodă intensivă care te face să vorbești fluent în 6 luni. Rezultate garantate!',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'indigo'
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
      red: { bg: 'bg-red-600/10', border: 'border-red-600/20', text: 'text-red-600', glow: 'shadow-red-500/20' },
      blue: { bg: 'bg-blue-900/10', border: 'border-blue-900/20', text: 'text-blue-900', glow: 'shadow-blue-500/20' },
      rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-600', glow: 'shadow-rose-500/20' },
      indigo: { bg: 'bg-indigo-600/10', border: 'border-indigo-600/20', text: 'text-indigo-600', glow: 'shadow-indigo-500/20' },
    }
    return colors[color]
  }

  return (
    <section id="despre" ref={sectionRef} className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-[#FFFBF5] via-white to-[#FFFBF5]">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-br from-red-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-blue-900/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 lg:mb-20">
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600/10 via-white to-blue-900/10 border border-red-600/20 rounded-full mb-6 backdrop-blur-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-900 text-sm font-semibold">Despre Fast English</span>
          </div>
          
          <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            De ce Fast English este
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-blue-900">
              alegerea ta perfectă
            </span>
          </h2>
          
          <p className={`text-gray-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Nu suntem doar o școală de limbi străine. Suntem o comunitate pasionată care te ajută să vorbești engleza cu încredere și fluență.
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
                      : 'bg-white/80 border-gray-200 hover:bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors ${isActive ? colors.bg : 'bg-gray-100'}`}>
                      <div className={`transition-colors ${isActive ? colors.text : 'text-gray-400'} [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-8 sm:[&>svg]:h-8`}>
                        {value.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-base sm:text-lg mb-1 transition-colors ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                        {value.title}
                      </h3>
                      <p className={`text-xs sm:text-sm transition-all duration-500 ${isActive ? 'text-gray-600 max-h-20 opacity-100' : 'text-gray-500 max-h-0 opacity-0 overflow-hidden'}`}>
                        {value.description}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${isActive ? `${colors.text} scale-100` : 'bg-gray-300 scale-75'}`} style={{ backgroundColor: isActive ? 'currentColor' : undefined }} />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right - Visual Card */}
          <div className={`relative transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-blue-900/5 to-transparent rounded-[3rem] blur-3xl" />
              
              {/* Main Card */}
              <div className="relative h-full bg-white rounded-[3rem] border-2 border-gray-100 shadow-2xl p-8 lg:p-12 overflow-hidden">
                {/* UK Flag Colors Background */}
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-red-600/10 to-blue-900/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 -bottom-10 text-[16rem] font-black text-gray-900/5 select-none leading-none">UK</div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600/10 to-blue-900/10 rounded-2xl mb-6 border border-red-600/20">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                      </svg>
                      <span className="text-gray-900 text-xs font-bold uppercase tracking-wide">Misiunea noastră</span>
                    </div>
                    
                    <h3 className="text-2xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                      Vorbește engleza
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-900">
                        ca un nativ
                      </span>
                    </h3>
                    
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Credem că oricine poate învăța să vorbească engleza fluent. 
                      Metoda noastră intensivă și interactivă te face să comunici natural 
                      și cu încredere în orice situație.
                    </p>
                  </div>

                  {/* Achievement Badges */}
                  <div className="grid grid-cols-2 gap-3 mt-8">
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                      <div className="text-3xl font-black text-red-600 mb-1">500+</div>
                      <div className="text-xs text-gray-600 font-medium">Studenți activi</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="text-3xl font-black text-blue-900 mb-1">98%</div>
                      <div className="text-xs text-gray-600 font-medium">Rată succes</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    <div className="px-3 py-2 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white text-xs font-bold shadow-lg">
                      🇬🇧 Nativi UK/US
                    </div>
                    <div className="px-3 py-2 bg-gray-900 rounded-xl text-white text-xs font-bold">
                      💬 Conversații live
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl text-white text-xs font-bold shadow-lg">
                      📈 Progres rapid
                    </div>
                  </div>
                </div>

                {/* Decorative UK Elements */}
                <div className="absolute top-6 right-6 w-16 h-16 border-2 border-red-600/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-blue-900 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 lg:mt-24 text-center transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex flex-col lg:flex-row items-center gap-6 p-8 bg-gradient-to-r from-red-50 via-white to-blue-50 rounded-3xl border-2 border-red-100 shadow-2xl max-w-4xl mx-auto">
            <div className="flex -space-x-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-blue-900 border-3 border-white flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              ))}
            </div>
            <div className="flex-1 text-center lg:text-left">
              <p className="text-gray-900 font-black text-xl mb-1">Alătură-te celor 500+ cursanți</p>
              <p className="text-gray-600 text-sm">care au ales Fast English pentru a învăța engleza rapid și eficient</p>
            </div>
            <a 
              href="#cursuri"
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105 flex items-center gap-3"
            >
              <span>Începe acum</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
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
