'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  BookOpenIcon, 
  UserIcon, 
  ClockIcon, 
  ArrowLeftIcon,
  PlayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import EnrollmentModal from '@/components/public/EnrollmentModal'

const LEVEL_CONFIG = {
  'începător': { color: '#10b981', label: 'Începător' },
  'intermediar': { color: '#f59e0b', label: 'Intermediar' },
  'avansat': { color: '#ef4444', label: 'Avansat' },
}

export default function CourseDetailPage() {
  const params = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Scroll to top instantly when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/public/courses/${params.slug}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError('Cursul nu a fost găsit')
          } else {
            throw new Error('Failed to fetch')
          }
          return
        }
        const data = await res.json()
        setCourse(data)
      } catch (error) {
        console.error('Error fetching course:', error)
        setError('A apărut o eroare la încărcarea cursului')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchCourse()
    }
  }, [params.slug])

  // Obține imaginile (folosește mainImageUrl/imageUrl dacă images e gol)
  const images = course?.images?.length > 0 
    ? course.images 
    : (course?.mainImageUrl || course?.imageUrl ? [course.mainImageUrl || course.imageUrl] : [])

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Auto-play slideshow
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1 || isLightboxOpen) return
    
    const interval = setInterval(() => {
      nextImage()
    }, 4000) // Schimbă imaginea la fiecare 4 secunde
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, images.length, isLightboxOpen, nextImage])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') setIsLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, nextImage, prevImage])

  const levelColor = LEVEL_CONFIG[course?.level?.toLowerCase()]?.color || '#30919f'
  
  const hasAgeRange = course?.ageMin || course?.ageMax
  const ageText = hasAgeRange 
    ? `${course.ageMin || '?'}${course.ageMax ? `-${course.ageMax}` : '+'} ani`
    : null

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[var(--background)] pt-16 xs:pt-20 sm:pt-24 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 xs:py-5 sm:py-8 md:py-12">
            {/* Back button skeleton */}
            <div className="h-4 xs:h-5 w-24 xs:w-32 bg-[#1e3d44] rounded mb-3 xs:mb-5 sm:mb-8 animate-pulse"></div>
            
            <div className="grid lg:grid-cols-2 gap-3 xs:gap-5 sm:gap-8 lg:gap-12">
              {/* Left side - Image skeleton */}
              <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                <div className="relative aspect-[4/3] lg:aspect-[3/2] rounded-lg xs:rounded-xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a4a54] to-[#15292e] animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpenIcon className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 text-[#30919f]/20" />
                  </div>
                </div>
                {/* Thumbnails skeleton */}
                <div className="flex gap-1 xs:gap-1.5 sm:gap-3 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-11 h-8 xs:w-14 xs:h-10 sm:w-20 sm:h-14 rounded xs:rounded-md sm:rounded-lg bg-[#1e3d44] animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 100}ms` }}></div>
                  ))}
                </div>
              </div>
              
              {/* Right side - Content skeleton */}
              <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                {/* Badge */}
                <div className="h-5 xs:h-6 w-16 xs:w-20 bg-[#1e3d44] rounded-full animate-pulse"></div>
                {/* Title */}
                <div className="space-y-1.5 xs:space-y-2">
                  <div className="h-5 xs:h-6 sm:h-8 bg-[#1e3d44] rounded w-4/5 animate-pulse"></div>
                  <div className="h-5 xs:h-6 sm:h-8 bg-[#1e3d44] rounded w-2/3 animate-pulse" style={{ animationDelay: '100ms' }}></div>
                </div>
                {/* Meta info */}
                <div className="flex gap-1.5 xs:gap-2 sm:gap-4">
                  <div className="h-4 xs:h-5 w-14 xs:w-16 bg-[#1e3d44] rounded animate-pulse"></div>
                  <div className="h-4 xs:h-5 w-16 xs:w-20 bg-[#1e3d44] rounded animate-pulse" style={{ animationDelay: '100ms' }}></div>
                </div>
                {/* Description */}
                <div className="space-y-1 xs:space-y-1.5">
                  <div className="h-3 xs:h-3.5 bg-[#1e3d44] rounded w-full animate-pulse"></div>
                  <div className="h-3 xs:h-3.5 bg-[#1e3d44] rounded w-5/6 animate-pulse" style={{ animationDelay: '50ms' }}></div>
                  <div className="h-3 xs:h-3.5 bg-[#1e3d44] rounded w-4/5 animate-pulse" style={{ animationDelay: '100ms' }}></div>
                </div>
                {/* Price card */}
                <div className="p-2 xs:p-3 sm:p-5 bg-[#15292e] rounded xs:rounded-lg sm:rounded-xl border border-[#1e3d44] space-y-2 xs:space-y-3">
                  <div className="h-5 xs:h-6 w-20 xs:w-24 bg-[#1e3d44] rounded animate-pulse"></div>
                  <div className="h-8 xs:h-10 bg-[#1e3d44] rounded xs:rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[var(--background)] pt-16 xs:pt-20 sm:pt-24 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-10">
            <div className="text-center py-8 xs:py-12 sm:py-16">
              <BookOpenIcon className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 mx-auto mb-3 xs:mb-4 sm:mb-5 text-gray-400" />
              <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2 xs:mb-3">{error}</h1>
              <Link 
                href="/#cursuri"
                className="inline-flex items-center gap-1 xs:gap-1.5 text-xs xs:text-sm sm:text-base text-[#30919f] hover:underline"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                Înapoi la cursuri
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)] pt-16 xs:pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 xs:py-5 sm:py-8 md:py-12 overflow-hidden">
          {/* Back button */}
          <Link 
            href="/#cursuri"
            className="inline-flex items-center gap-1 xs:gap-2 text-xs xs:text-sm sm:text-base text-[var(--text-muted)] hover:text-[#30919f] mb-3 xs:mb-5 sm:mb-8 transition-colors"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            Înapoi la cursuri
          </Link>

          <div className="grid lg:grid-cols-2 gap-3 xs:gap-5 sm:gap-8 lg:gap-12">
            {/* Left side - Images */}
            <div className="space-y-2 xs:space-y-3 sm:space-y-4 min-w-0">
              {/* Main image - larger aspect ratio */}
              <div 
                className="relative aspect-[4/3] sm:aspect-[4/3] lg:aspect-[3/2] rounded-lg xs:rounded-xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a4a54] to-[#0d1f23] cursor-pointer group shadow-md xs:shadow-lg sm:shadow-2xl"
                onClick={() => images.length > 0 && setIsLightboxOpen(true)}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {images.length > 0 ? (
                  <>
                    {/* All images stacked for smooth transition */}
                    {images.map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        alt={course.title}
                        fill
                        className={`object-cover transition-all duration-700 ease-in-out ${
                          currentImageIndex === idx 
                            ? 'opacity-100 scale-100' 
                            : 'opacity-0 scale-105'
                        }`}
                        priority={idx === 0}
                      />
                    ))}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Overlay pe hover - ascuns pe mobil */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                        <span className="text-white font-medium text-sm sm:text-base">Click pentru a mări</span>
                      </div>
                    </div>
                    
                    {/* Navigation arrows - smaller on mobile */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); setIsAutoPlaying(false); prevImage() }}
                          className="cursor-pointer absolute left-1 xs:left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 xs:p-2 sm:p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all hover:scale-110"
                        >
                          <ChevronLeftIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-7 sm:h-7" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setIsAutoPlaying(false); nextImage() }}
                          className="cursor-pointer absolute right-1 xs:right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 xs:p-2 sm:p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-all hover:scale-110"
                        >
                          <ChevronRightIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-7 sm:h-7" />
                        </button>
                      </>
                    )}
                    
                    {/* Progress dots instead of counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 xs:gap-1.5 sm:gap-2">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx) }}
                            className={`cursor-pointer transition-all duration-300 rounded-full ${
                              currentImageIndex === idx 
                                ? 'w-5 xs:w-6 sm:w-8 h-1 xs:h-1.5 sm:h-2 bg-white' 
                                : 'w-1 xs:w-1.5 sm:w-2 h-1 xs:h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Auto-play indicator */}
                    {images.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsAutoPlaying(!isAutoPlaying) }}
                        className="cursor-pointer absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 p-1 xs:p-1.5 sm:p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white transition-colors"
                        title={isAutoPlaying ? 'Oprește auto-play' : 'Pornește auto-play'}
                      >
                        {isAutoPlaying ? (
                          <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpenIcon className="w-24 h-24 text-[#30919f]/30" />
                  </div>
                )}
              </div>

              {/* Thumbnails - smaller on mobile */}
              {images.length > 1 && (
                <div className="w-full max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
                  <div className="flex gap-1.5 xs:gap-2 sm:gap-3 pb-2 min-w-0">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setCurrentImageIndex(idx); setIsAutoPlaying(false) }}
                        className={`cursor-pointer relative flex-shrink-0 w-12 h-9 xs:w-14 xs:h-10 sm:w-20 sm:h-14 md:w-24 md:h-16 rounded xs:rounded-md sm:rounded-lg overflow-hidden transition-all duration-300 ${
                          currentImageIndex === idx 
                            ? 'ring-2 ring-[#30919f] ring-offset-1 ring-offset-[var(--background)] scale-105 shadow-lg' 
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${course.title} - ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        {currentImageIndex === idx && (
                          <div className="absolute inset-0 bg-[#30919f]/20" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Details */}
            <div className="space-y-3 xs:space-y-4 sm:space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3">
                {course.level && (
                  <span 
                    className="px-2 xs:px-3 sm:px-4 py-0.5 xs:py-1 sm:py-1.5 rounded-full text-[10px] xs:text-xs sm:text-sm font-bold uppercase tracking-wide"
                    style={{ 
                      backgroundColor: `${levelColor}20`,
                      color: levelColor,
                      border: `1px solid ${levelColor}40`
                    }}
                  >
                    {course.level}
                  </span>
                )}
                {course.category && (
                  <span className="px-2 xs:px-3 sm:px-4 py-0.5 xs:py-1 sm:py-1.5 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--border-color)]">
                    {course.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--foreground)] leading-tight">
                {course.title}
              </h1>

              {/* Short description */}
              <p className="text-xs xs:text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                {course.descriptionShort}
              </p>

              {/* Price */}
              <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 flex-wrap">
                {course.discountPrice ? (
                  <>
                    <div className="px-2.5 xs:px-3 sm:px-5 py-1 xs:py-1.5 sm:py-2.5 bg-[#f8b316] rounded-md xs:rounded-lg sm:rounded-2xl inline-flex items-baseline gap-0.5 xs:gap-1 shadow-md xs:shadow-lg shadow-[#f8b316]/30">
                      <span className="text-lg xs:text-xl sm:text-3xl font-black text-[#112428]">{course.discountPrice}</span>
                      <span className="text-[10px] xs:text-xs sm:text-base font-semibold text-[#112428]/70">MDL</span>
                    </div>
                    <div className="px-2 xs:px-3 sm:px-4 py-0.5 xs:py-1 sm:py-2 bg-[var(--card-bg)] rounded xs:rounded-md sm:rounded-xl inline-flex items-baseline gap-0.5">
                      <span className="text-sm xs:text-base sm:text-xl font-medium text-[var(--text-muted)] line-through">{course.price}</span>
                      <span className="text-[8px] xs:text-[10px] sm:text-sm font-medium text-[var(--text-muted)]">MDL</span>
                    </div>
                  </>
                ) : (
                  <div className="px-2.5 xs:px-3 sm:px-5 py-1 xs:py-1.5 sm:py-2.5 bg-[#f8b316] rounded-md xs:rounded-lg sm:rounded-2xl inline-flex items-baseline gap-0.5 xs:gap-1 shadow-md xs:shadow-lg shadow-[#f8b316]/30">
                    <span className="text-lg xs:text-xl sm:text-3xl font-black text-[#112428]">{course.price}</span>
                    <span className="text-[10px] xs:text-xs sm:text-base font-semibold text-[#112428]/70">MDL</span>
                  </div>
                )}
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-3 gap-1 xs:gap-1.5 sm:gap-3">
                {ageText && (
                  <div className="flex flex-col items-center gap-0.5 xs:gap-1 p-1.5 xs:p-2 sm:p-3 bg-[var(--card-bg)] rounded xs:rounded-md sm:rounded-lg border border-[var(--border-color)]">
                    <div className="p-1 xs:p-1.5 bg-[#30919f]/10 rounded xs:rounded-md">
                      <UserIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#30919f]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[7px] xs:text-[8px] sm:text-[10px] text-[var(--text-muted)] leading-tight">Vârstă</p>
                      <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--foreground)] leading-tight">{ageText}</p>
                    </div>
                  </div>
                )}
                {course.duration && (
                  <div className="flex flex-col items-center gap-0.5 xs:gap-1 p-1.5 xs:p-2 sm:p-3 bg-[var(--card-bg)] rounded xs:rounded-md sm:rounded-lg border border-[var(--border-color)]">
                    <div className="p-1 xs:p-1.5 bg-[#30919f]/10 rounded xs:rounded-md">
                      <ClockIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#30919f]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[7px] xs:text-[8px] sm:text-[10px] text-[var(--text-muted)] leading-tight">Durată</p>
                      <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--foreground)] leading-tight">{course.duration}</p>
                    </div>
                  </div>
                )}
                {course.lessonsCount && (
                  <div className="flex flex-col items-center gap-0.5 xs:gap-1 p-1.5 xs:p-2 sm:p-3 bg-[var(--card-bg)] rounded xs:rounded-md sm:rounded-lg border border-[var(--border-color)]">
                    <div className="p-1 xs:p-1.5 bg-[#30919f]/10 rounded xs:rounded-md">
                      <BookOpenIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#30919f]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[7px] xs:text-[8px] sm:text-[10px] text-[var(--text-muted)] leading-tight">Lecții</p>
                      <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--foreground)] leading-tight">{course.lessonsCount}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer w-full py-2 xs:py-2.5 sm:py-3.5 rounded-md xs:rounded-lg sm:rounded-xl font-bold text-xs xs:text-sm sm:text-base relative overflow-hidden
                           bg-gradient-to-r from-[#30919f] to-[#136976] text-white
                           transition-all duration-300 hover:shadow-lg hover:shadow-[#30919f]/40
                           active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2">
                  <PlayIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                  Înscrie-te acum
                </span>
              </button>
            </div>
          </div>

          {/* Long description */}
          {course.descriptionLong && (
            <div className="mt-5 xs:mt-6 sm:mt-10 md:mt-14">
              <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-[var(--foreground)] mb-2 xs:mb-3 sm:mb-5">
                Despre acest curs
              </h2>
              <div className="prose prose-sm max-w-none text-[var(--text-muted)]">
                <p className="whitespace-pre-wrap leading-relaxed text-[11px] xs:text-xs sm:text-sm">{course.descriptionLong}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {isLightboxOpen && images.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="cursor-pointer absolute top-2 xs:top-4 right-2 xs:right-4 p-1.5 xs:p-2 text-white/80 hover:text-white transition-colors z-10"
          >
            <XMarkIcon className="w-6 h-6 xs:w-8 xs:h-8" />
          </button>
          
          <div 
            className="relative w-full h-full max-w-6xl max-h-[90vh] m-2 xs:m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentImageIndex]}
              alt={course.title}
              fill
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage() }}
                className="cursor-pointer absolute left-1 xs:left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 xs:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage() }}
                className="cursor-pointer absolute right-1 xs:right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 xs:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8" />
              </button>
              <div className="absolute bottom-2 xs:bottom-4 left-1/2 -translate-x-1/2 px-3 xs:px-4 py-1.5 xs:py-2 bg-white/10 rounded-full text-white text-sm xs:text-base">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}

      <Footer />

      <EnrollmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={course}
      />
    </>
  )
}
