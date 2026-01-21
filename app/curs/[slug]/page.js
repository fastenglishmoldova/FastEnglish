'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import EnrollmentModal from '@/components/public/EnrollmentModal'

const LEVEL_CONFIG = {
  'începător': { gradient: 'from-emerald-500 to-teal-500', label: 'Începător' },
  'intermediar': { gradient: 'from-amber-500 to-orange-500', label: 'Intermediar' },
  'avansat': { gradient: 'from-rose-500 to-pink-500', label: 'Avansat' },
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

  const images = course?.images?.length > 0 
    ? course.images 
    : (course?.mainImageUrl || course?.imageUrl ? [course.mainImageUrl || course.imageUrl] : [])

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1 || isLightboxOpen) return
    const interval = setInterval(() => nextImage(), 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, images.length, isLightboxOpen, nextImage])

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

  const levelConfig = LEVEL_CONFIG[course?.level?.toLowerCase()] || LEVEL_CONFIG['începător']
  
  const hasAgeRange = course?.ageMin || course?.ageMax
  const ageText = hasAgeRange 
    ? `${course.ageMin || '?'}${course.ageMax ? `-${course.ageMax}` : '+'} ani`
    : null

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#030303] pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="h-5 w-32 bg-white/5 rounded mb-8 animate-pulse" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-[4/3] rounded-3xl bg-white/5 animate-pulse" />
              <div className="space-y-6">
                <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse" />
                <div className="h-12 bg-white/5 rounded animate-pulse" />
                <div className="h-24 bg-white/5 rounded animate-pulse" />
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
        <main className="min-h-screen bg-[#030303] pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
              <Link 
                href="/#cursuri"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
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
      <main className="min-h-screen bg-[#030303] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[500px] lg:h-[800px] bg-emerald-500/5 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] lg:w-[600px] h-[200px] sm:h-[400px] lg:h-[600px] bg-teal-500/5 rounded-full blur-[200px]" />
        </div>

        {/* Hero Section with Image */}
        <div className="relative pt-16 sm:pt-20">
          {/* Full-width Image Background */}
          <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
            {images.length > 0 ? (
              <>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ${
                      currentImageIndex === idx ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={course.title}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </div>
                ))}
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/80 via-transparent to-[#030303]/80" />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${levelConfig.gradient} opacity-20`} />
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => { setIsAutoPlaying(false); prevImage() }}
                  className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white transition-all hover:scale-110 z-10"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => { setIsAutoPlaying(false); nextImage() }}
                  className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white transition-all hover:scale-110 z-10"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Progress Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentImageIndex(idx); setIsAutoPlaying(false) }}
                    className={`transition-all duration-300 rounded-full ${
                      currentImageIndex === idx 
                        ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-emerald-400' 
                        : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Expand Button */}
            {images.length > 0 && (
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-8 lg:right-8 p-2 sm:p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white transition-all hover:scale-110 z-10"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            )}

            {/* Back Button */}
            <Link 
              href="/#cursuri"
              className="absolute top-2 left-2 sm:top-4 sm:left-4 lg:top-8 lg:left-8 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white transition-all z-10"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Înapoi</span>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-20 sm:-mt-32 pb-12 sm:pb-20">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-8">
              {/* Title Card */}
              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-10">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {course.level && (
                    <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r ${levelConfig.gradient} text-white`}>
                      {levelConfig.label}
                    </span>
                  )}
                  {course.category && (
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/5 text-gray-400 border border-white/10">
                      {course.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-3 sm:mb-6 leading-tight">
                  {course.title}
                </h1>

                {/* Short Description */}
                <p className="text-gray-400 text-sm sm:text-lg leading-relaxed">
                  {course.descriptionShort}
                </p>

                {/* Meta Info */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8">
                  {ageText && (
                    <div className="text-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Vârstă</p>
                      <p className="text-white font-semibold text-xs sm:text-base">{ageText}</p>
                    </div>
                  )}
                  {course.duration && (
                    <div className="text-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Durată</p>
                      <p className="text-white font-semibold text-xs sm:text-base">{course.duration}</p>
                    </div>
                  )}
                  {course.lessonsCount && (
                    <div className="text-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Lecții</p>
                      <p className="text-white font-semibold text-xs sm:text-base">{course.lessonsCount}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Long Description */}
              {course.descriptionLong && (
                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-10">
                  <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Despre acest curs
                  </h2>
                  <div className="prose prose-invert prose-emerald max-w-none">
                    <p className="text-gray-400 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {course.descriptionLong}
                    </p>
                  </div>
                </div>
              )}

              {/* Image Gallery Thumbnails */}
              {images.length > 1 && (
                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-3 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Galerie</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setCurrentImageIndex(idx); setIsLightboxOpen(true) }}
                        className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                          currentImageIndex === idx 
                            ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#0a0a0a]' 
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${course.title} - ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Price Card */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-8">
                  {/* Price */}
                  <div className="text-center mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Preț curs</p>
                    {course.discountPrice ? (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          <span className="text-3xl sm:text-4xl font-black text-white">{course.discountPrice}</span>
                          <span className="text-base sm:text-lg text-gray-500">lei</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-base sm:text-lg text-gray-500 line-through">{course.price} lei</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/20 text-emerald-400">
                            -{Math.round((1 - course.discountPrice / course.price) * 100)}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-white">{course.price || 'Gratuit'}</span>
                        {course.price && <span className="text-base sm:text-lg text-gray-500">lei</span>}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:scale-105" />
                    <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Înscrie-te acum
                    </span>
                  </button>

                  {/* Features List */}
                  <div className="mt-4 sm:mt-8 space-y-2 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-400">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm">Acces la toate materialele</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-400">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm">Suport personalizat</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-400">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm">Certificat de absolvire</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-400">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm">Grup mic de elevi</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
                    <p className="text-center text-xs sm:text-sm text-gray-500">
                      Ai întrebări?{' '}
                      <Link href="/#contact" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        Contactează-ne
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 text-white/80 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="relative w-full h-full max-w-6xl max-h-[90vh] m-2 sm:m-4"
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
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage() }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-white text-sm sm:text-base">
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
