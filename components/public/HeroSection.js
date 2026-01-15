'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  LanguageIcon,
  CalculatorIcon,
  AcademicCapIcon,
  SparklesIcon,
  CheckBadgeIcon,
  BookOpenIcon,
  UserGroupIcon,
  ArrowRightIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline'

// Course data - easily maintainable (fallback if no courses from DB)
const FALLBACK_COURSES = [
  { id: 'german', title: 'Germană', icon: LanguageIcon, color: 'accent' },
  { id: 'english', title: 'Engleză', icon: AcademicCapIcon, color: 'primary' },
  { id: 'math', title: 'Matematică', icon: CalculatorIcon, color: 'primary' },
  { id: 'french', title: 'Franceză', icon: SparklesIcon, color: 'accent' }
]

const STATS = [
  { value: '500+', label: 'Elevi fericiți' },
  { value: '15+', label: 'Cursuri active' },
  { value: '98%', label: 'Satisfacție' }
]

const BENEFITS = [
  {
    icon: CheckBadgeIcon,
    title: 'Profesori Calificați',
    description: 'Echipa noastră este formată din profesori cu experiență și pasiune pentru educație.',
    colorClass: 'primary'
  },
  {
    icon: BookOpenIcon,
    title: 'Curriculum Național',
    description: 'Programe actualizate care combină teoria cu practica într-un mod interactiv.',
    colorClass: 'accent'
  },
  {
    icon: UserGroupIcon,
    title: 'Grupe Mici',
    description: 'Atenție individualizată pentru fiecare copil în grupe de maximum 5 elevi.',
    colorClass: 'primary'
  }
]

const STEPS = [
  { step: '1', title: 'Alege cursul', desc: 'Explorează cursurile disponibile și alege-l pe cel potrivit' },
  { step: '2', title: 'Completează formularul', desc: 'Înscrie-te online în câteva minute' },
  { step: '3', title: 'Confirmă prezența', desc: 'Te contactăm pentru confirmare și detalii' },
  { step: '4', title: 'Începe aventura', desc: 'Participă la cursuri și bucură-te de învățare' }
]

// Reusable components
const Badge = ({ children, pulse = false }) => (
  <div className="inline-flex items-center px-4 py-2 bg-[#30919f]/10 dark:bg-[#30919f]/10 light:bg-[#30919f]/5 border border-[#30919f]/20 rounded-full backdrop-blur-sm">
    {pulse && <span className="w-2 h-2 bg-[#f8b316] rounded-full mr-2 animate-pulse" />}
    <span className="text-sm font-medium text-[#30919f]">{children}</span>
  </div>
)

const StatItem = ({ value, label }) => (
  <div className="text-center sm:text-left">
    <div className="text-3xl font-bold stat-value">{value}</div>
    <div className="text-sm text-[#30919f] font-medium">{label}</div>
  </div>
)

const CourseCard = ({ course, index }) => {
  const IconComponent = course.icon
  const isAccent = index % 2 === 0
  
  return (
    <Link 
      href={course.slug ? `/curs/${course.slug}` : '#cursuri'}
      className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background Image or Gradient */}
      {course.imageUrl ? (
        <Image 
          src={course.imageUrl} 
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4a54] via-[#15292e] to-[#0d1f23]">
          <div className="absolute inset-0 flex items-center justify-center">
            {IconComponent ? (
              <IconComponent className={`w-12 h-12 ${isAccent ? 'text-[#f8b316]/30' : 'text-[#30919f]/30'}`} />
            ) : (
              <BookOpenIcon className={`w-12 h-12 ${isAccent ? 'text-[#f8b316]/30' : 'text-[#30919f]/30'}`} />
            )}
          </div>
        </div>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-[#30919f]/0 group-hover:bg-[#30919f]/20 transition-colors duration-300" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="font-bold text-white text-sm md:text-base leading-tight truncate">
          {course.title}
        </h4>
        {course.price && (
          <p className="text-[#f8b316] text-xs font-semibold mt-1">
            {course.discountPrice || course.price} MDL
          </p>
        )}
      </div>
      
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isAccent ? 'bg-[#f8b316]' : 'bg-[#30919f]'} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
    </Link>
  )
}

const BenefitCard = ({ benefit }) => {
  const IconComponent = benefit.icon
  const isAccent = benefit.colorClass === 'accent'
  
  return (
    <div className="hero-card rounded-2xl p-6 border hero-border card-hover group">
      <div className={`w-14 h-14 ${isAccent ? 'bg-[#f8b316]/20' : 'bg-[#30919f]/20'} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <IconComponent className={`w-7 h-7 ${isAccent ? 'text-[#f8b316]' : 'text-[#30919f]'}`} />
      </div>
      <h3 className="text-lg font-semibold hero-text mb-2">{benefit.title}</h3>
      <p className="hero-text-muted leading-relaxed">{benefit.description}</p>
    </div>
  )
}

const StepItem = ({ item, isLast }) => (
  <div className="text-center group relative">
    <div className="w-12 h-12 bg-gradient-to-br from-[#30919f] to-[#136976] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#30919f]/30 transition-all duration-300 relative z-10">
      {item.step}
    </div>
    {!isLast && (
      <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#30919f]/50 to-transparent" />
    )}
    <h3 className="font-semibold hero-text mb-2">{item.title}</h3>
    <p className="text-sm hero-text-muted">{item.desc}</p>
  </div>
)

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    setIsVisible(true)
    
    // Fetch real courses from API
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/public/courses')
        if (res.ok) {
          const data = await res.json()
          // Take first 4 courses
          setCourses(data.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }
    fetchCourses()
  }, [])

  // Use real courses or fallback
  const displayCourses = courses.length > 0 ? courses : FALLBACK_COURSES

  const scrollToSection = (sectionId) => {
    document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section 
      id="home" 
      className="hero-section pt-20 min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 hero-bg" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#30919f]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#136976]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Left Content */}
          <div className="space-y-8">
            <Badge pulse>Înscrieri deschise pentru 2026</Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold hero-text leading-tight">
              Învățăm{' '}
              <span className="text-[#30919f] relative whitespace-nowrap">
                jucându-ne
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C47.6667 2.16667 141 -1.9 199 5.5" stroke="#30919f" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>,
              <br />
              creștem{' '}
              <span className="text-[#f8b316]">împreună</span>
            </h1>
            
            <p className="text-lg hero-text-muted max-w-lg leading-relaxed">
              La Bravito After School, fiecare copil descoperă bucuria de a învăța prin activități creative, 
              cursuri interactive și o comunitate prietenoasă.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('#cursuri')}
                className="cursor-pointer group px-8 py-4 bg-gradient-to-r from-[#30919f] to-[#136976] rounded-xl font-semibold hover:from-[#136976] hover:to-[#0f5460] transition-all duration-300 shadow-lg shadow-[#30919f]/25 hover:shadow-xl hover:shadow-[#30919f]/30 flex items-center justify-center gap-2"
              >
                <span className="keep-white" style={{ color: '#ffffff' }}>Vezi cursurile</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: '#ffffff' }} />
              </button>
              <Link
                href="/inscriere"
                className="cursor-pointer group px-8 py-4 bg-transparent text-[#f8b316] rounded-xl font-semibold border-2 border-[#f8b316]/30 hover:border-[#f8b316] hover:bg-[#f8b316]/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <PlayCircleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Înscrie-te acum</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-[#30919f]/20">
              {STATS.map((stat, idx) => (
                <StatItem key={idx} {...stat} />
              ))}
            </div>
          </div>

          {/* Right Content - Course Grid */}
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#30919f]/20 to-[#136976]/10 rounded-[2rem] blur-xl" />
            
            {/* Main Card */}
            <div className="relative bg-[#0c1a1d]/95 backdrop-blur-xl rounded-3xl p-6 border border-[#30919f]/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">Cursuri populare</h3>
                <span className="px-3 py-1 bg-[#f8b316]/20 text-[#f8b316] text-xs font-semibold rounded-full">
                  {displayCourses.length} cursuri
                </span>
              </div>
              
              {/* Course Grid */}
              <div className="grid grid-cols-2 gap-3">
                {displayCourses.map((course, idx) => (
                  <CourseCard key={course.id} course={course} index={idx} />
                ))}
              </div>
              
              {/* Footer */}
              <div className="mt-5 pt-5 border-t border-white/10">
                <Link 
                  href="/inscriere"
                  className="cursor-pointer w-full py-3 bg-gradient-to-r from-[#f8b316] to-[#e5a310] text-[#231f20] rounded-xl font-bold text-sm hover:from-[#e5a310] hover:to-[#d4940d] transition-all shadow-lg hover:shadow-[#f8b316]/30 flex items-center justify-center gap-2"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  Înscrie-te acum
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className={`mt-24 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold hero-text mb-4">
              De ce să alegi <span className="text-[#f8b316]">Bravito</span>?
            </h2>
            <p className="hero-text-muted max-w-2xl mx-auto">
              Suntem dedicați să oferim cea mai bună experiență educațională pentru copilul tău
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, idx) => (
              <BenefitCard key={idx} benefit={benefit} />
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className={`mt-24 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold hero-text mb-4">
              Cum funcționează?
            </h2>
            <p className="hero-text-muted max-w-2xl mx-auto">
              În doar 4 pași simpli, copilul tău poate începe aventura educațională
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((item, idx) => (
              <StepItem key={idx} item={item} isLast={idx === STEPS.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
