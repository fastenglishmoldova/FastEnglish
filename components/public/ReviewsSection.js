'use client'

import { useState, useEffect, useRef } from 'react'

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/public/reviews')
        if (res.ok) {
          const data = await res.json()
          setReviews(data.slice(0, 9))
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  // Auto-scroll for mobile carousel
  useEffect(() => {
    if (reviews.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [reviews.length])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Astăzi'
    if (diffDays === 1) return 'Ieri'
    if (diffDays < 7) return `Acum ${diffDays} zile`
    if (diffDays < 30) return `Acum ${Math.floor(diffDays / 7)} săptămâni`
    if (diffDays < 365) return `Acum ${Math.floor(diffDays / 30)} luni`
    return `Acum ${Math.floor(diffDays / 365)} ani`
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-white/10'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  const defaultReviews = [
    {
      id: '1',
      message: 'Copilul meu a făcut progrese remarcabile în doar câteva luni. Profesorii sunt foarte dedicați și metodele lor de predare sunt eficiente.',
      authorName: 'Maria P.',
      roleLabel: 'Părinte',
      rating: 5,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      message: 'Am învățat să-mi placă matematica! Explicațiile sunt clare și exercițiile sunt interesante. Recomand tuturor colegilor mei!',
      authorName: 'Andrei M.',
      roleLabel: 'Elev',
      rating: 5,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      message: 'Atmosfera este plăcută și profesorii au răbdare să explice de câte ori este nevoie. Nota la matematică a crescut de la 6 la 9!',
      authorName: 'Elena T.',
      roleLabel: 'Părinte',
      rating: 5,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews

  const ReviewCard = ({ review, index, featured = false }) => (
    <div
      className={`group relative ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`relative h-full p-6 ${featured ? 'lg:p-10' : 'p-6'} bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 hover:border-amber-500/30 transition-all duration-500 overflow-hidden`}>
        {/* Background Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
        
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className={`${featured ? 'w-24 h-24' : 'w-16 h-16'} text-amber-400`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        <div className="relative flex flex-col h-full">
          {/* Header with Rating & Date */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-0.5">
              {renderStars(review.rating || 5)}
            </div>
            {review.createdAt && (
              <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
            )}
          </div>

          {/* Review Text */}
          <p className={`text-gray-300 leading-relaxed flex-grow ${featured ? 'text-lg lg:text-xl' : 'text-sm'} ${!featured && 'line-clamp-4'}`}>
            "{review.message || review.content || review.text}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
            <div className={`${featured ? 'w-14 h-14' : 'w-12 h-12'} rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20`}>
              {review.avatarUrl ? (
                <img src={review.avatarUrl} alt={review.authorName} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <span className={`text-white font-bold ${featured ? 'text-xl' : 'text-lg'}`}>
                  {(review.authorName || 'A')[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className={`text-white font-semibold ${featured ? 'text-lg' : ''}`}>{review.authorName}</p>
              {review.roleLabel && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    review.roleLabel === 'Părinte' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {review.roleLabel === 'Părinte' ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                    {review.roleLabel}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section id="recenzii" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030303]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-400 text-sm">Recenzii verificate</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">
            Ce spun{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400">
              familiile noastre
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Succesul nostru se măsoară în zâmbetele elevilor și recunoștința părinților.
          </p>
        </div>

        {/* Reviews Grid - Desktop */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-3xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Bento Grid Layout for Desktop */}
            <div className={`hidden lg:grid grid-cols-3 gap-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {displayReviews.slice(0, 5).map((review, index) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  index={index}
                  featured={index === 0}
                />
              ))}
            </div>

            {/* Carousel for Mobile/Tablet */}
            <div className="lg:hidden">
              <div className="relative overflow-hidden">
                <div 
                  ref={scrollRef}
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {displayReviews.map((review, index) => (
                    <div key={review.id} className="w-full flex-shrink-0 px-2">
                      <ReviewCard review={review} index={index} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {displayReviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      activeIndex === index 
                        ? 'w-8 h-2 bg-amber-400' 
                        : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Bottom Stats */}
        <div className={`mt-16 flex flex-wrap justify-center gap-8 lg:gap-16 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-2xl font-bold text-white">4.9/5</p>
            <p className="text-sm text-gray-500">Rating mediu</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-1">{displayReviews.length}+</p>
            <p className="text-sm text-gray-500">Recenzii pozitive</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-1">100%</p>
            <p className="text-sm text-gray-500">Ar recomanda</p>
          </div>
        </div>
      </div>
    </section>
  )
}
