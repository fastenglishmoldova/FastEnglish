'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CoursesSection() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/public/courses')
        if (res.ok) {
          const data = await res.json()
          setCourses(data)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Auto-rotate featured course
  useEffect(() => {
    if (courses.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % courses.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [courses.length])

  const levelConfig = {
    'începător': { gradient: 'from-emerald-500 to-teal-500', label: 'Începător' },
    'intermediar': { gradient: 'from-amber-500 to-orange-500', label: 'Intermediar' },
    'avansat': { gradient: 'from-rose-500 to-pink-500', label: 'Avansat' },
  }

  const featuredCourse = courses[activeIndex]
  const otherCourses = courses.filter((_, i) => i !== activeIndex)

  return (
    <section ref={sectionRef} id="cursuri" className="py-20 lg:py-32 bg-[#030303] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[200px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className={`mb-10 sm:mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4 sm:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 text-xs sm:text-sm font-medium">Programe educaționale</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight">
                Explorează
                <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                  cursurile
                </span>
              </h2>
            </div>
            
            <p className="text-gray-400 text-sm sm:text-lg max-w-md leading-relaxed lg:text-right">
              Fiecare curs este creat pentru a transforma modul în care înveți matematica.
            </p>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-7 h-[500px] bg-white/5 rounded-3xl animate-pulse" />
            <div className="lg:col-span-5 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[150px] bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : courses.length > 0 ? (
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              
              {/* Featured Course - Large */}
              {featuredCourse && (
                <div className="lg:col-span-7">
                  <div 
                    className="group block relative h-[350px] sm:h-[450px] lg:h-[600px] rounded-2xl sm:rounded-[2rem] overflow-hidden cursor-pointer"
                    onClick={() => window.location.href = `/curs/${featuredCourse.slug}`}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      {featuredCourse.mainImageUrl || featuredCourse.imageUrl ? (
                        <Image
                          src={featuredCourse.mainImageUrl || featuredCourse.imageUrl}
                          alt={featuredCourse.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${levelConfig[featuredCourse.level?.toLowerCase()]?.gradient || 'from-emerald-600 to-teal-600'}`} />
                      )}
                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-4 sm:p-8 lg:p-10 flex flex-col justify-between">
                      {/* Top */}
                      <div className="flex items-start justify-between">
                        <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r ${levelConfig[featuredCourse.level?.toLowerCase()]?.gradient || 'from-emerald-500 to-teal-500'} text-white`}>
                          {levelConfig[featuredCourse.level?.toLowerCase()]?.label || 'Curs'}
                        </div>
                        
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Bottom */}
                      <div>
                        <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
                          {featuredCourse.title}
                        </h3>
                        
                        <p className="text-gray-300 text-sm sm:text-lg mb-3 sm:mb-6 line-clamp-2 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {featuredCourse.descriptionShort || featuredCourse.description || 'Descoperă acest curs și dezvoltă-ți abilitățile.'}
                        </p>
                        
                        <div className="flex items-center gap-3 sm:gap-6 mb-3 sm:mb-6">
                          {featuredCourse.price ? (
                            <div className="flex items-baseline gap-1 sm:gap-2">
                              <span className="text-xl sm:text-3xl font-bold text-white">{featuredCourse.discountPrice || featuredCourse.price}</span>
                              <span className="text-gray-400 text-xs sm:text-base">lei/lună</span>
                              {featuredCourse.discountPrice && (
                                <span className="text-gray-500 line-through text-sm sm:text-lg">{featuredCourse.price}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-lg sm:text-2xl font-bold text-emerald-400">Gratuit</span>
                          )}
                          
                          <div className="hidden sm:flex items-center gap-4 text-gray-400 text-sm">
                            {featuredCourse.lessonsCount && (
                              <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {featuredCourse.lessonsCount} lecții
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Buttons */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="px-3 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base hover:bg-white/20 transition-all flex items-center gap-1.5 sm:gap-2">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Detalii
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              window.location.href = '/inscriere'
                            }}
                            className="px-3 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base hover:bg-emerald-400 transition-all flex items-center gap-1.5 sm:gap-2 hover:shadow-lg hover:shadow-emerald-500/25"
                          >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Înscrie-te
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress indicators */}
                    <div className="absolute bottom-8 lg:bottom-10 right-8 lg:right-10 flex gap-2">
                      {courses.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveIndex(idx)
                          }}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            idx === activeIndex 
                              ? 'w-8 bg-emerald-400' 
                              : 'w-2 bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Course List - Right Side */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {otherCourses.slice(0, 4).map((course, index) => {
                  const level = levelConfig[course.level?.toLowerCase()] || levelConfig['începător']
                  const isHovered = hoveredIndex === index
                  
                  return (
                    <Link
                      key={course.id}
                      href={`/curs/${course.slug}`}
                      className="group relative"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
                        isHovered ? 'bg-white/10' : 'bg-white/5'
                      }`}>
                        <div className="flex items-stretch">
                          {/* Image/Color Block */}
                          <div className={`relative w-16 sm:w-24 lg:w-32 shrink-0 overflow-hidden`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${level.gradient} opacity-80`} />
                            {(course.mainImageUrl || course.imageUrl) && (
                              <Image
                                src={course.mainImageUrl || course.imageUrl}
                                alt={course.title}
                                fill
                                className="object-cover mix-blend-overlay"
                              />
                            )}
                            {/* Number */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-2xl sm:text-4xl font-black text-white/30">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 p-3 sm:p-5 flex flex-col justify-center min-w-0">
                            <div className="flex items-center gap-2 mb-1 sm:mb-2">
                              <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${level.gradient} text-white`}>
                                {level.label}
                              </span>
                            </div>
                            
                            <h4 className="text-sm sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1">
                              {course.title}
                            </h4>
                            
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-emerald-400 font-semibold text-xs sm:text-base whitespace-nowrap">
                                {course.price ? `${course.discountPrice || course.price} lei` : 'Gratuit'}
                              </span>
                              
                              <div className="hidden sm:flex items-center gap-2">
                                <span className={`px-3 py-1.5 text-xs font-medium bg-white/10 text-white rounded-lg transition-all duration-300 ${
                                  isHovered ? 'opacity-100' : 'opacity-0'
                                }`}>
                                  Detalii
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.location.href = '/inscriere'
                                  }}
                                  className={`px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 transition-all duration-300 ${
                                    isHovered ? 'opacity-100' : 'opacity-0'
                                  }`}
                                >
                                  Înscrie-te
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover border effect */}
                        <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
                          isHovered ? 'border-emerald-500/50' : 'border-transparent'
                        }`} />
                      </div>
                    </Link>
                  )
                })}
                
                {/* View All Button */}
                {courses.length > 5 && (
                  <Link
                    href="/inscriere"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300"
                  >
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <span className="text-white font-semibold">Vezi toate cursurile</span>
                        <span className="block text-sm text-gray-500">{courses.length} programe disponibile</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                        <svg className="w-5 h-5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
            
            {/* Bottom CTA */}
            <div className={`mt-10 sm:mt-16 text-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <Link
                href="/inscriere"
                className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-full hover:bg-emerald-400 transition-all duration-300 text-sm sm:text-base"
              >
                <span>Începe călătoria</span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/10 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">Prima consultație este gratuită</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Cursurile vin în curând</h3>
            <p className="text-gray-400">Pregătim ceva special pentru tine.</p>
          </div>
        )}
      </div>
    </section>
  )
}
