'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import EnrollmentModal from './EnrollmentModal'
import { 
  BookOpenIcon, 
  UserIcon, 
  ClockIcon, 
  ClipboardDocumentListIcon,
  UsersIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

// ============================================================================
// CONSTANTS & CONFIGURATIONS
// ============================================================================

const LEVEL_CONFIG = {
  'începător': { color: '#10b981', label: 'Începător' },
  'intermediar': { color: '#f59e0b', label: 'Intermediar' },
  'avansat': { color: '#ef4444', label: 'Avansat' },
}

const SKELETON_COUNT = 3

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Skeleton loader for course card - beautiful animated skeleton
 */
const CourseCardSkeleton = ({ index }) => (
  <div 
    className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-[#1a2e32] to-[#0f1d20]"
    style={{ animationDelay: `${index * 150}ms` }}
  >
    {/* Shimmer effect overlay */}
    <div 
      className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
      style={{ 
        background: 'linear-gradient(90deg, transparent, rgba(48,145,159,0.08), transparent)',
      }}
    />
    
    {/* Top level indicator skeleton */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-[#30919f]/20" />
    
    {/* Top badges skeleton */}
    <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
      <div className="w-20 h-7 rounded-full bg-white/5 animate-pulse" />
      <div className="w-16 h-7 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: '100ms' }} />
    </div>
    
    {/* Content area at bottom */}
    <div className="absolute bottom-0 left-0 right-0 p-6">
      {/* Price skeleton */}
      <div className="mb-4 flex items-center gap-3">
        <div className="w-24 h-10 rounded-2xl bg-[#f8b316]/10 animate-pulse" />
        <div className="w-16 h-5 rounded-lg bg-white/5 animate-pulse" style={{ animationDelay: '150ms' }} />
      </div>
      
      {/* Title skeleton */}
      <div className="mb-3 space-y-2">
        <div className="w-full h-6 rounded-lg bg-white/10 animate-pulse" style={{ animationDelay: '200ms' }} />
        <div className="w-3/4 h-6 rounded-lg bg-white/10 animate-pulse" style={{ animationDelay: '250ms' }} />
      </div>
      
      {/* Meta info skeleton */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-4 rounded bg-white/5 animate-pulse" style={{ animationDelay: '300ms' }} />
        <div className="w-14 h-4 rounded bg-white/5 animate-pulse" style={{ animationDelay: '350ms' }} />
      </div>
      
      {/* Buttons skeleton */}
      <div className="flex gap-2">
        <div className="flex-1 h-12 rounded-2xl bg-white/5 animate-pulse" style={{ animationDelay: '400ms' }} />
        <div className="flex-1 h-12 rounded-2xl bg-[#30919f]/20 animate-pulse" style={{ animationDelay: '450ms' }} />
      </div>
    </div>
    
    {/* Decorative elements */}
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-20 h-20 rounded-full bg-[#30919f]/5 animate-pulse" />
    </div>
  </div>
)

/**
 * Empty state component
 */
const EmptyState = () => (
  <div className="text-center py-20">
    <div className="relative inline-block mb-8">
      <div className="absolute inset-0 bg-[#30919f]/30 blur-3xl rounded-full animate-pulse" />
      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#30919f] to-[#136976] 
                      flex items-center justify-center">
        <BookOpenIcon className="w-16 h-16 text-white" />
      </div>
    </div>
    <h3 className="text-3xl font-bold mb-4 text-[var(--foreground)]">Cursuri în pregătire</h3>
    <p className="text-[var(--text-muted)] max-w-md mx-auto text-lg">
      Echipa noastră lucrează la programe educaționale captivante.
    </p>
  </div>
)

/**
 * 3D Tilt Course Card - Interactive spotlight effect
 */
const CourseCard = ({ course, onEnroll, index }) => {
  const cardRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  const levelColor = LEVEL_CONFIG[course.level?.toLowerCase()]?.color || '#30919f'
  
  const hasAgeRange = course.ageMin || course.ageMax
  const ageText = hasAgeRange 
    ? `${course.ageMin || '?'}${course.ageMax ? `-${course.ageMax}` : '+'} ani`
    : null

  return (
    <Link 
      href={`/curs/${course.slug}`}
      ref={cardRef}
      className="group relative aspect-[4/5] cursor-pointer block"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      {/* Card Container with 3D effect */}
      <div 
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: isHovered 
            ? `perspective(1000px) rotateY(${(mousePosition.x - 50) / 10}deg) rotateX(${-(mousePosition.y - 50) / 10}deg) scale(1.02)`
            : 'perspective(1000px) rotateY(0) rotateX(0) scale(1)'
        }}
      >
        {/* Inner container with overflow hidden */}
        <div className="absolute inset-0 overflow-hidden" data-keep-white="true" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Background Image */}
          <div className="absolute inset-0">
            {course.imageUrl ? (
              <Image 
                src={course.imageUrl} 
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a4a54] via-[#15292e] to-[#0d1f23]">
                {/* Abstract shapes */}
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#30919f]/10 blur-2xl" />
                <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#f8b316]/10 blur-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpenIcon className="w-24 h-24 text-[#30919f]/20" />
                </div>
              </div>
            )}
          </div>

          {/* Spotlight effect that follows mouse */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(48,145,159,0.25) 0%, transparent 50%)`
            }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1214] via-[#0a1214]/60 to-transparent" />

          {/* Level indicator - colored line at top */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-1.5"
            style={{ backgroundColor: levelColor }}
          />

          {/* Top badges */}
          <div className="absolute top-3 xs:top-5 left-3 xs:left-5 right-3 xs:right-5 flex items-center justify-between">
            {course.level && (
              <span 
                className="px-2 xs:px-3 py-1 xs:py-1.5 rounded-full text-[10px] xs:text-xs font-bold uppercase tracking-wide backdrop-blur-md"
                data-level-badge="true"
                style={{ 
                  backgroundColor: `${levelColor}20`,
                  color: levelColor,
                  border: `1px solid ${levelColor}40`,
                  '--level-color': levelColor
                }}
              >
                {course.level}
              </span>
            )}
            {course.category && (
              <span className="px-2 xs:px-3 py-1 xs:py-1.5 rounded-full text-[10px] xs:text-xs font-medium backdrop-blur-md border border-white/10 text-white/80 bg-white/10 keep-white">
                {course.category}
              </span>
            )}
          </div>

        {/* Content - positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 sm:p-6">
          {/* Price - floating above */}
          <div className="mb-2 xs:mb-3 sm:mb-4 flex items-center gap-2 xs:gap-3 flex-wrap">
            {course.discountPrice ? (
              <>
                <div className="px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 bg-[#f8b316] rounded-xl xs:rounded-2xl inline-flex items-baseline gap-0.5 xs:gap-1 shadow-lg shadow-[#f8b316]/30" data-price="true">
                  <span className="text-lg xs:text-xl sm:text-2xl font-black text-[#112428]">{course.discountPrice}</span>
                  <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[#112428]/70">MDL</span>
                </div>
                <div className="px-2 xs:px-3 py-1 xs:py-1.5 bg-white/10 rounded-lg xs:rounded-xl inline-flex items-baseline gap-0.5 xs:gap-1 backdrop-blur-sm">
                  <span className="text-sm xs:text-base sm:text-lg font-medium text-white/50 line-through keep-white">{course.price}</span>
                  <span className="text-[10px] xs:text-xs font-medium text-white/40 keep-white">MDL</span>
                </div>
              </>
            ) : (
              <div className="px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 bg-[#f8b316] rounded-xl xs:rounded-2xl inline-flex items-baseline gap-0.5 xs:gap-1 shadow-lg shadow-[#f8b316]/30" data-price="true">
                <span className="text-lg xs:text-xl sm:text-2xl font-black text-[#112428]">{course.price}</span>
                <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[#112428]/70">MDL</span>
              </div>
            )}
            {course.lessonsCount && (
              <span className="text-[10px] xs:text-xs sm:text-sm text-white/60 keep-white">• {course.lessonsCount} lecții</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base xs:text-lg sm:text-2xl font-bold mb-1 xs:mb-2 leading-tight text-white keep-white">
            {course.title}
          </h3>

          {/* Description - hidden by default, appears on hover */}
          <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100">
            <p className="text-sm mb-4 line-clamp-2 leading-relaxed text-white/70 keep-white">
              {course.descriptionShort}
            </p>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 mb-2 xs:mb-3 sm:mb-5 text-[10px] xs:text-xs sm:text-sm text-white/50 keep-white">
            {ageText && (
              <span className="flex items-center gap-1">
                <UserIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                {ageText}
              </span>
            )}
            {course.duration && (
              <span className="flex items-center gap-1">
                <ClockIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                {course.duration}
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-1.5 xs:gap-2">
            <span
              className="flex-1 py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl font-medium xs:font-semibold text-xs xs:text-sm sm:text-base relative overflow-hidden
                         bg-white/10 backdrop-blur-sm border border-white/20
                         transition-all duration-300 hover:bg-white/20
                         active:scale-[0.98] text-white keep-white text-center cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 keep-white">
                <EyeIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 keep-white" />
                Detalii
              </span>
            </span>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onEnroll(course)
              }}
              className="flex-1 py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl font-medium xs:font-semibold text-xs xs:text-sm sm:text-base relative overflow-hidden
                         bg-gradient-to-r from-[#30919f] to-[#136976]
                         transition-all duration-300 
                         group-hover:shadow-lg group-hover:shadow-[#30919f]/40
                         active:scale-[0.98] text-white keep-white cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 keep-white">
                <PlayIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 keep-white" />
                <span className="hidden xs:inline">Înscrie-te</span>
                <span className="xs:hidden">Înscrie</span>
              </span>
              {/* Animated shine */}
              <div 
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)' }}
              />
            </button>
          </div>
        </div>

        {/* Subtle inner glow on hover */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ 
            opacity: isHovered ? 1 : 0,
            boxShadow: `inset 0 0 60px ${levelColor}15`
          }}
        />
        </div>
      </div>
    </Link>
  )
}

/**
 * Section header component
 */
const SectionHeader = () => (
  <div className="text-center mb-20">
    {/* Animated accent line */}
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#30919f]" />
      <span className="text-[#30919f] text-sm font-semibold uppercase tracking-[0.3em]">
        Descoperă
      </span>
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#30919f]" />
    </div>
    
    {/* Main title */}
    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-[var(--foreground)]">
      Cursurile
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#f8b316] via-[#ffd700] to-[#f8b316] 
                       animate-gradient bg-[length:200%_auto]">
        Noastre
      </span>
    </h2>
    
    {/* Subtitle */}
    <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
      Programe educaționale create cu pasiune pentru
      <span className="font-medium text-[var(--foreground)]"> dezvoltarea completă </span>
      a copilului tău
    </p>
  </div>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CoursesSection() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/public/courses')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setCourses(data)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCourses()
  }, [])

  // Handlers
  const handleEnroll = useCallback((course) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedCourse(null)
  }, [])

  // Render content based on state
  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <CourseCardSkeleton key={i} index={i} />
          ))}
        </div>
      )
    }

    if (courses.length === 0) {
      return <EmptyState />
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onEnroll={handleEnroll}
            index={index}
          />
        ))}
      </div>
    )
  }, [loading, courses, handleEnroll])

  return (
    <>
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>

      <section 
        id="cursuri" 
        className="relative py-28 md:py-36 bg-[var(--background)] overflow-hidden"
      >
        {/* Background - subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{
               backgroundImage: `linear-gradient(#30919f 1px, transparent 1px), linear-gradient(90deg, #30919f 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }} 
        />
        
        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-[#30919f]/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-[#f8b316]/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#136976]/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader />
          {renderContent}
        </div>
      </section>

      <EnrollmentModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        course={selectedCourse}
      />
    </>
  )
}
