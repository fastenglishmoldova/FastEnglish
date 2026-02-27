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
    'începător': { 
      gradient: 'from-blue-500 to-blue-700', 
      label: 'Beginner',
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    'intermediar': { 
      gradient: 'from-red-500 to-red-600', 
      label: 'Intermediate',
      color: 'red',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    'avansat': { 
      gradient: 'from-blue-900 to-indigo-900', 
      label: 'Advanced',
      color: 'indigo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
  }

  const featuredCourse = courses[activeIndex]
  const otherCourses = courses.filter((_, i) => i !== activeIndex)

  return (
    <section ref={sectionRef} id="cursuri" className="py-24 lg:py-36 bg-gradient-to-b from-white via-[#FFFBF5] to-white relative overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0">
        {/* Animated gradients */}
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-red-600/8 via-red-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-blue-900/8 via-blue-800/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-red-500/10 rounded-full" />
        <div className="absolute bottom-40 right-20 w-24 h-24 border border-blue-900/10 rounded-full" />
        
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-white border-2 border-red-500/20 rounded-full mb-8 shadow-lg shadow-red-500/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-gray-900 font-bold tracking-wide">Cursurile Noastre</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Alege nivelul 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-blue-900">
              potrivit pentru tine
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
            De la începător la avansat, fiecare curs este creat pentru a-ți oferi rezultate reale în limba engleză.
          </p>
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
                    className="group block relative h-[380px] sm:h-[480px] lg:h-[640px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl shadow-gray-900/10 hover:shadow-3xl hover:shadow-red-500/20 transition-all duration-700"
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
                        <div className={`absolute inset-0 bg-gradient-to-br ${levelConfig[featuredCourse.level?.toLowerCase()]?.gradient || 'from-red-600 to-blue-900'}`} />
                      )}
                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    {/* UK Flag Accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-white to-blue-900" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-5 sm:p-8 lg:p-12 flex flex-col justify-between">
                      {/* Top */}
                      <div className="flex items-start justify-between">
                        <div className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r ${levelConfig[featuredCourse.level?.toLowerCase()]?.gradient || 'from-red-500 to-blue-900'} text-white shadow-lg flex items-center gap-2`}>
                          {levelConfig[featuredCourse.level?.toLowerCase()]?.icon}
                          {levelConfig[featuredCourse.level?.toLowerCase()]?.label || 'Curs'}
                        </div>
                        
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-red-500 group-hover:scale-110 transition-all duration-500 border border-white/20">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Bottom */}
                      <div>
                        <h3 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight">
                          {featuredCourse.title}
                        </h3>
                        
                        <p className="text-gray-300 text-sm sm:text-lg mb-4 sm:mb-6 line-clamp-2 hidden sm:block max-w-lg">
                          {featuredCourse.descriptionShort || featuredCourse.description || 'Descoperă acest curs și dezvoltă-ți abilitățile în limba engleză.'}
                        </p>
                        
                        <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-8">
                          {featuredCourse.price ? (
                            <div className="flex items-baseline gap-1 sm:gap-2">
                              <span className="text-2xl sm:text-4xl font-black text-white">{featuredCourse.discountPrice || featuredCourse.price}</span>
                              <span className="text-gray-400 text-sm sm:text-base">lei/lună</span>
                              {featuredCourse.discountPrice && (
                                <span className="text-gray-500 line-through text-base sm:text-xl ml-2">{featuredCourse.price}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-2xl sm:text-3xl font-black text-red-500">Gratuit</span>
                          )}
                          
                          <div className="hidden sm:flex items-center gap-4 text-gray-400 text-sm">
                            {featuredCourse.lessonsCount && (
                              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {featuredCourse.lessonsCount} lecții
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Buttons */}
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="px-4 sm:px-8 py-2.5 sm:py-4 bg-white/10 backdrop-blur-md text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base hover:bg-white/20 transition-all flex items-center gap-2 sm:gap-3 border border-white/10">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Vezi detalii
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              window.location.href = '/inscriere'
                            }}
                            className="px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base hover:from-red-500 hover:to-red-400 transition-all flex items-center gap-2 sm:gap-3 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Înscrie-te acum
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
                              ? 'w-8 bg-red-500' 
                              : 'w-2 bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Course List - Right Side */}
              <div className="lg:col-span-5 flex flex-col gap-5">
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
                        isHovered ? 'bg-white shadow-xl shadow-gray-900/10' : 'bg-white/95 shadow-lg shadow-gray-900/5'
                      }`}>
                        {/* Hover accent line */}
                        <div className={`absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-red-500 to-blue-900 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                        
                        <div className="flex items-stretch">
                          {/* Image/Color Block */}
                          <div className={`relative w-20 sm:w-28 lg:w-36 shrink-0 overflow-hidden`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${level.gradient}`} />
                            {(course.mainImageUrl || course.imageUrl) && (
                              <Image
                                src={course.mainImageUrl || course.imageUrl}
                                alt={course.title}
                                fill
                                className="object-cover mix-blend-overlay opacity-60"
                              />
                            )}
                            {/* Level Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                {level.icon}
                              </div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${level.gradient} text-white shadow-sm`}>
                                {level.label}
                              </span>
                            </div>
                            
                            <h4 className="text-sm sm:text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-2">
                              {course.title}
                            </h4>
                            
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-red-600 font-bold text-sm sm:text-lg whitespace-nowrap">
                                {course.price ? `${course.discountPrice || course.price} lei` : 'Gratuit'}
                              </span>
                              
                              <div className="hidden sm:flex items-center gap-2">
                                <span className={`px-4 py-2 text-xs font-semibold bg-gray-100 text-gray-700 rounded-xl transition-all duration-300 ${
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
                                  className={`px-4 py-2 text-xs font-semibold bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-sm hover:shadow-md ${
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
                        <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
                          isHovered ? 'border-red-500/30' : 'border-transparent'
                        }`} />
                      </div>
                    </Link>
                  )
                })}
                
                {/* View All Button */}
                {courses.length > 5 && (
                  <Link
                    href="/inscriere"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50 via-white to-blue-50 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="p-6 flex items-center justify-between">
                      <div>
                        <span className="text-gray-900 font-bold text-lg">Vezi toate cursurile</span>
                        <span className="block text-sm text-gray-500 mt-1">{courses.length} programe disponibile</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-red-500/30">
                        <svg className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
            
            {/* Bottom CTA */}
            <div className={`mt-16 sm:mt-24 text-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="inline-flex flex-col items-center">
                <Link
                  href="/inscriere"
                  className="group inline-flex items-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-full hover:from-red-500 hover:to-red-400 transition-all duration-300 text-base sm:text-lg shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 hover:scale-105"
                >
                  <span>Începe călătoria ta</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
                <p className="mt-5 sm:mt-6 text-sm sm:text-base text-gray-500 font-medium">🎁 Prima consultație este <span className="text-red-600 font-bold">gratuită</span></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cursurile vin în curând</h3>
            <p className="text-gray-600">Pregătim ceva special pentru tine.</p>
          </div>
        )}
      </div>
    </section>
  )
}
