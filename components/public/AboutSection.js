'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { 
  CheckIcon, 
  HeartIcon, 
  AcademicCapIcon, 
  StarIcon, 
  UserGroupIcon,
  SparklesIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { CheckBadgeIcon, QuoteIcon } from '@heroicons/react/24/solid'

// Stats data
const STATS = [
  { value: '500+', label: 'Elevi fericiți', color: 'from-[#30919f] to-[#136976]' },
  { value: '8+', label: 'Ani experiență', color: 'from-[#f8b316] to-[#e5a310]' },
  { value: '15+', label: 'Cursuri active', color: 'from-[#30919f] to-[#136976]' },
  { value: '98%', label: 'Satisfacție', color: 'from-[#f8b316] to-[#e5a310]' }
]

// Values data
const VALUES = [
  { 
    icon: HeartIcon, 
    title: 'Pasiune', 
    desc: 'Iubim ceea ce facem și se vede în rezultatele copiilor noștri',
    gradient: 'from-rose-500 to-pink-600'
  },
  { 
    icon: AcademicCapIcon, 
    title: 'Excelență', 
    desc: 'Standarde înalte și metode moderne de predare certificate',
    gradient: 'from-[#30919f] to-[#136976]'
  },
  { 
    icon: StarIcon, 
    title: 'Creativitate', 
    desc: 'Învățare prin joc și explorare liberă a curiozității',
    gradient: 'from-[#f8b316] to-[#e5a310]'
  },
  { 
    icon: UserGroupIcon, 
    title: 'Comunitate', 
    desc: 'O familie caldă de părinți, copii și profesori dedicați',
    gradient: 'from-purple-500 to-indigo-600'
  }
]

// Founder credentials
const CREDENTIALS = [
  'Absolventă a Liceului Teoretic „Alexei Mateevici"',
  'Absolventă a Școlii de Muzică, specialitatea Pian',
  'Licențiată în Pedagogia Învățământului Primar (UPS „Ion Creangă")',
  'Master în Management și Consiliere în Învățământul Primar',
  '8 ani experiență ca învățător de clasele primare (2017-2025)'
]

// Animated counter hook
function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasStarted, startOnView])

  useEffect(() => {
    if (!hasStarted) return

    const startTime = Date.now()
    const endValue = parseInt(end)
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * endValue))
      
      if (progress === 1) clearInterval(timer)
    }, 16)

    return () => clearInterval(timer)
  }, [hasStarted, end, duration])

  return { count, ref }
}

// Stat Card Component
const StatCard = ({ stat, index }) => {
  const numericValue = stat.value.replace(/\D/g, '')
  const suffix = stat.value.replace(/\d/g, '')
  const { count, ref } = useCountUp(numericValue)

  return (
    <div 
      ref={ref}
      className="group relative overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] hover:border-[#30919f]/50 transition-all duration-500 overflow-hidden">
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
        
        <div className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
          {count}{suffix}
        </div>
        <div className="text-sm text-[var(--text-muted)] font-medium">{stat.label}</div>
      </div>
    </div>
  )
}

// Value Card Component
const ValueCard = ({ value, index }) => (
  <div 
    className="group relative"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="h-full bg-[var(--card-bg)] rounded-3xl p-8 lg:p-10 border border-[var(--border-color)] hover:border-[#30919f]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#30919f]/20">
      {/* Icon with gradient background */}
      <div className={`w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
        <value.icon className="w-10 h-10 text-white" />
      </div>
      
      <h4 className="text-xl lg:text-2xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[#30919f] transition-colors">
        {value.title}
      </h4>
      <p className="text-base text-[var(--text-muted)] leading-relaxed">
        {value.desc}
      </p>
    </div>
  </div>
)

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="relative py-32 lg:py-40 overflow-hidden bg-[var(--background)]"
    >
      {/* Large background decorations */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#30919f]/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[#f8b316]/8 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#136976]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 lg:mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-3 bg-[#30919f]/10 border border-[#30919f]/20 px-6 py-3 rounded-full text-base font-medium mb-8 backdrop-blur-sm">
            <HeartIcon className="w-5 h-5 text-[#30919f]" />
            <span className="text-[#30919f]">Despre noi</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--foreground)] mb-8">
            Despre <span className="text-[#30919f]">Bravito</span>{' '}
            <span className="text-[#f8b316]">After School</span>
          </h2>
          <p className="text-xl lg:text-2xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
            Mai mult decât o școală - suntem o comunitate dedicată dezvoltării armonioase a fiecărui copil
          </p>
        </div>

        {/* Main Content Grid */}
        <div className={`grid lg:grid-cols-5 gap-12 lg:gap-16 items-start mb-28 lg:mb-32 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Left Column - Founder Image */}
          <div className="lg:col-span-2 relative">
            <div className="relative">
              {/* Gradient background shape */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#30919f]/20 via-[#136976]/10 to-[#f8b316]/20 rounded-[3rem] blur-2xl" />
              
              {/* Image container */}
              <div className="relative">
                <Image
                  src="/platinum_owner.png"
                  alt="Stelina Croitoru - Fondator Bravito After School"
                  width={400}
                  height={500}
                  className="w-full max-w-sm mx-auto h-auto object-contain relative z-10"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(48, 145, 159, 0.25))'
                  }}
                />
                
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent z-20" />
                
                {/* Floating badges */}
                <div className="absolute top-8 -right-4 lg:right-0 bg-gradient-to-br from-[#30919f] to-[#136976] text-white rounded-2xl px-4 py-3 shadow-2xl z-30">
                  <CheckBadgeIcon className="w-6 h-6" />
                </div>
                
                <div className="absolute bottom-24 -left-4 lg:left-0 bg-gradient-to-r from-[#f8b316] to-[#e5a310] text-white rounded-2xl px-5 py-3 shadow-2xl z-30">
                  <div className="text-2xl font-bold leading-none">8+</div>
                  <div className="text-xs opacity-90">ani experiență</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Info */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#30919f]/10 text-[#30919f] text-sm font-medium rounded-full mb-4">
                <SparklesIcon className="w-4 h-4" />
                Fondator & Director
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-2">
                Stelina Croitoru
              </h3>
              <p className="text-lg text-[var(--text-muted)]">
                Pedagog cu pasiune pentru educația copiilor
              </p>
            </div>
            
            {/* Credentials Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {CREDENTIALS.map((credential, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] hover:border-[#30919f]/30 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#30919f] to-[#136976] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {credential}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Quote */}
            <div className="relative bg-gradient-to-br from-[#30919f]/5 to-[#f8b316]/5 rounded-2xl p-6 border-l-4 border-[#f8b316]">
              <p className="text-[var(--text-muted)] italic leading-relaxed">
                "Cred cu tărie că fiecare copil este unic și are nevoie de un mediu în care să se simtă 
                în siguranță pentru a explora și a-și descoperi pasiunile. La Bravito, construim acest 
                mediu cu dragoste și dedicare."
              </p>
            </div>
            
            {/* Story section moved here */}
            <div className="pt-8 border-t border-[var(--border-color)]">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#f8b316]/10 border border-[#f8b316]/20 rounded-full mb-6">
                <SparklesIcon className="w-4 h-4 text-[#f8b316]" />
                <span className="text-sm font-medium text-[#f8b316]">Povestea noastră</span>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-[var(--foreground)] leading-tight mb-4">
                O școală creată cu suflet pentru 
                <span className="text-[#30919f]"> copii curioși</span> și
                <span className="text-[#f8b316]"> părinți implicați</span>
              </h3>

            {/* Story Paragraphs */}
            <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
              <p>
                Bravito After School s-a născut din dorința de a oferi copiilor un spațiu sigur și 
                stimulant unde pot explora, învăța și crește.
                <strong className="text-[var(--foreground)]"> Educația trebuie să fie o aventură</strong>, 
                nu o corvoadă.
              </p>
            </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {STATS.map((stat, idx) => (
                <StatCard key={idx} stat={stat} index={idx} />
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-6">
              Valorile care ne <span className="text-[#f8b316]">definesc</span>
            </h3>
            <p className="text-lg lg:text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
              Principiile fundamentale care ghidează tot ceea ce facem la Bravito
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, idx) => (
              <ValueCard key={idx} value={value} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
