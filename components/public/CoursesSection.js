'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CoursesSection() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [hoveredCourse, setHoveredCourse] = useState(null)
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

  const levelConfig = {
    'începător': { color: 'emerald', gradient: 'from-emerald-500 to-teal-500', label: 'Începător', icon: '🌱' },
    'intermediar': { color: 'amber', gradient: 'from-amber-500 to-orange-500', label: 'Intermediar', icon: '📈' },
    'avansat': { color: 'rose', gradient: 'from-rose-500 to-pink-500', label: 'Avansat', icon: '🚀' },
  }

  const filters = [
    { id: 'all', label: 'Toate', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { id: 'începător', label: 'Începător', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { id: 'intermediar', label: 'Intermediar', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )},
    { id: 'avansat', label: 'Avansat', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )},
  ]

  const filteredCourses = activeFilter === 'all' 
    ? courses 
    : courses.filter(c => c.level?.toLowerCase() === activeFilter)

  return (
    <section ref={sectionRef} id="cursuri" className="py-20 lg:py-32 bg-[#030303] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Descoperă programele noastre</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Cursuri care
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              transformă
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            De la fundamentele matematicii până la pregătirea pentru examene, 
            avem cursul perfect pentru tine.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <div className="bg-white/5 rounded-3xl h-[420px] animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => {
              const level = levelConfig[course.level?.toLowerCase()] || levelConfig['începător']
              const isHovered = hoveredCourse === course.id
              
              return (
                <Link
                  key={course.id}
                  href={`/curs/${course.slug}`}
                  className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                  onMouseEnter={() => setHoveredCourse(course.id)}
                  onMouseLeave={() => setHoveredCourse(null)}
                >
                  {/* Card Glow Effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${level.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500`} />
                  
                  {/* Card */}
                  <div className="relative bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden group-hover:border-white/20 transition-all duration-500">
                    {/* Image Container */}
                    <div className="relative h-52 overflow-hidden">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${level.gradient} opacity-20`} />
                      
                      {course.mainImageUrl || course.imageUrl ? (
                        <Image
                          src={course.mainImageUrl || course.imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${level.gradient} opacity-20 flex items-center justify-center`}>
                            <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                      
                      {/* Level Badge */}
                      <div className="absolute top-4 left-4">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${level.gradient} text-white shadow-lg flex items-center gap-1.5`}>
                          <span>{level.label}</span>
                        </div>
                      </div>
                      
                      {/* Floating Action Button */}
                      <div className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category Tag */}
                      {course.category && (
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                          {course.category}
                        </div>
                      )}
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300 line-clamp-1">
                        {course.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-400 text-sm line-clamp-2 mb-5 leading-relaxed">
                        {course.descriptionShort || course.description || 'Descoperă acest curs și dezvoltă-ți abilitățile matematice.'}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mb-5">
                        {course.lessonsCount && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>{course.lessonsCount} lecții</span>
                          </div>
                        )}
                        {course.duration && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{course.duration}</span>
                          </div>
                        )}
                        {(course.ageMin || course.ageMax) && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{course.ageMin || '?'}-{course.ageMax || '?'} ani</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-5 border-t border-white/5">
                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          {course.discountPrice ? (
                            <>
                              <span className="text-2xl font-bold text-white">{course.discountPrice} lei</span>
                              <span className="text-sm text-gray-500 line-through">{course.price} lei</span>
                            </>
                          ) : course.price ? (
                            <span className="text-2xl font-bold text-white">{course.price} lei</span>
                          ) : (
                            <span className="text-lg font-medium text-emerald-400">Gratuit</span>
                          )}
                        </div>
                        
                        {/* CTA */}
                        <div className={`flex items-center gap-2 text-emerald-400 font-medium text-sm transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-70'}`}>
                          <span>Detalii</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Niciun curs găsit</h3>
            <p className="text-gray-400">
              {activeFilter !== 'all' 
                ? 'Nu există cursuri pentru acest nivel. Încearcă alt filtru.'
                : 'Cursurile vor fi disponibile în curând.'}
            </p>
          </div>
        )}

        {/* View All CTA */}
        {filteredCourses.length > 0 && (
          <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <Link
              href="/inscriere"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
            >
              <span>Începe acum</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
            
            <p className="mt-4 text-sm text-gray-500">
              Prima consultație este gratuită
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
