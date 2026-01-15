'use client'

import { useState, useEffect, useRef } from 'react'
import { StarIcon, ChatBubbleBottomCenterTextIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

// Component pentru un singur review cu expand/collapse
const ReviewCard = ({ review, formatDate }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsExpand, setNeedsExpand] = useState(false)
  const textRef = useRef(null)

  useEffect(() => {
    if (textRef.current) {
      // Verifică dacă textul depășește 4 linii
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight)
      const maxHeight = lineHeight * 4
      setNeedsExpand(textRef.current.scrollHeight > maxHeight + 10)
    }
  }, [review.message])

  return (
    <div className="bg-gradient-to-br from-[#15292e] to-[#0f2025] rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-8 border border-[#1e3d44] hover:border-[#30919f]/50 transition-all duration-500 h-full relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-[#30919f]/10 group-hover:-translate-y-1">
      {/* Quote decoration */}
      <div className="absolute top-2 xs:top-4 right-2 xs:right-4 text-[#30919f]/10 text-5xl xs:text-6xl sm:text-8xl font-serif leading-none select-none">"</div>
      
      {/* Rating */}
      <div className="flex items-center gap-0.5 xs:gap-1 mb-4 xs:mb-6">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-4 h-4 xs:w-5 xs:h-5 ${i < review.rating ? 'text-amber-400' : 'text-gray-600'}`}
            />
          ))}
        </div>
        <span className="ml-1.5 xs:ml-2 text-xs xs:text-sm text-gray-500">({review.rating}.0)</span>
      </div>

      {/* Message */}
      <div className="relative z-10 mb-5 xs:mb-8">
        <p 
          ref={textRef}
          className={`text-gray-300 leading-relaxed text-sm xs:text-[15px] transition-all duration-300 ${
            !isExpanded && needsExpand ? 'line-clamp-4' : ''
          }`}
        >
          "{review.message}"
        </p>
        {needsExpand && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer mt-2 text-[#30919f] hover:text-[#4db8c7] text-sm font-medium transition-colors"
          >
            {isExpanded ? 'Vezi mai puțin ↑' : 'Vezi mai mult ↓'}
          </button>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-2.5 xs:gap-4 pt-4 xs:pt-6 border-t border-[#1e3d44]">
        {review.avatarUrl ? (
          <img 
            src={review.avatarUrl} 
            alt={review.authorName}
            className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-[#30919f]/30 ring-offset-1 xs:ring-offset-2 ring-offset-[#15292e] flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#30919f] to-[#136976] rounded-full flex items-center justify-center ring-2 ring-[#30919f]/30 ring-offset-1 xs:ring-offset-2 ring-offset-[#15292e] flex-shrink-0">
            <span className="text-base xs:text-lg sm:text-xl text-white font-bold">
              {review.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm xs:text-base sm:text-lg truncate">{review.authorName}</h4>
          <div className="flex items-center gap-1 xs:gap-2 flex-wrap">
            {review.roleLabel && (
              <span className="text-xs xs:text-sm text-[#30919f] font-medium truncate max-w-[80px] xs:max-w-none">{review.roleLabel}</span>
            )}
            {review.roleLabel && <span className="text-gray-600 hidden xs:inline">•</span>}
            <span className="text-xs xs:text-sm text-gray-500">{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Course badge */}
      {review.course && (
        <div className="mt-3 xs:mt-4 inline-flex items-center gap-1.5 xs:gap-2 bg-[#1e3d44]/50 px-2 xs:px-3 py-1 xs:py-1.5 rounded-full max-w-full">
          <span className="text-[10px] xs:text-xs text-gray-400">Curs:</span>
          <span className="text-[10px] xs:text-xs text-[#30919f] font-medium truncate">{review.course.title}</span>
        </div>
      )}
    </div>
  )
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/public/reviews')
      const data = await res.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-gray-600'}`}
      />
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long'
    })
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="reviews" className="py-12 xs:py-16 sm:py-24 bg-gradient-to-b from-[#0a1416] via-[#0c1a1d] to-[#0a1416] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#30919f]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f8b316]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 xs:mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 xs:gap-2 bg-gradient-to-r from-[#f8b316]/20 to-[#f8b316]/10 text-[#f8b316] px-3 xs:px-5 py-2 xs:py-2.5 rounded-full text-xs xs:text-sm font-semibold mb-4 xs:mb-6 border border-[#f8b316]/20">
            <StarIcon className="w-3 h-3 xs:w-4 xs:h-4" />
            Testimoniale verificate
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 xs:mb-6">
            Ce spun <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#30919f] to-[#4db8c7]">părinții și elevii</span>
          </h2>
          <p className="text-sm xs:text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed px-2 xs:px-0">
            Feedback-ul comunității noastre ne motivează să fim mai buni în fiecare zi. 
            Iată ce spun cei care au ales Bravito.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-[#15292e] to-[#0f2025] rounded-2xl xs:rounded-3xl p-4 xs:p-6 sm:p-8 animate-pulse border border-[#1e3d44]">
                <div className="flex items-center gap-3 xs:gap-4 mb-4 xs:mb-6">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-[#1e3d44] rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-3 xs:h-4 bg-[#1e3d44] rounded w-20 xs:w-28"></div>
                    <div className="h-2 xs:h-3 bg-[#1e3d44] rounded w-16 xs:w-20"></div>
                  </div>
                </div>
                <div className="space-y-2 xs:space-y-3">
                  <div className="h-2 xs:h-3 bg-[#1e3d44] rounded"></div>
                  <div className="h-2 xs:h-3 bg-[#1e3d44] rounded w-5/6"></div>
                  <div className="h-2 xs:h-3 bg-[#1e3d44] rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#30919f]/20 to-[#30919f]/10 rounded-full flex items-center justify-center">
              <ChatBubbleBottomCenterTextIcon className="w-12 h-12 text-[#30919f]" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">Încă nu avem recenzii</h3>
            <p className="text-gray-400">Fii primul care ne lasă o recenzie!</p>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            {reviews.length > 3 && (
              <>
                <button
                  onClick={() => scroll('left')}
                  className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-[#15292e] border border-[#1e3d44] rounded-full flex items-center justify-center text-white hover:bg-[#1e3d44] hover:border-[#30919f] transition-all shadow-lg hidden lg:flex"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-[#15292e] border border-[#1e3d44] rounded-full flex items-center justify-center text-white hover:bg-[#1e3d44] hover:border-[#30919f] transition-all shadow-lg hidden lg:flex"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Reviews Grid/Scroll */}
            <div 
              ref={scrollRef}
              className="flex gap-3 xs:gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map((review, index) => (
                <div 
                  key={review.id} 
                  className="min-w-[280px] xs:min-w-[300px] sm:min-w-[320px] lg:min-w-0 snap-center group"
                >
                  <ReviewCard review={review} formatDate={formatDate} />
                </div>
              ))}
            </div>

            {/* Mobile scroll indicator */}
            <div className="flex justify-center gap-2 mt-6 lg:hidden">
              {reviews.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex ? 'bg-[#30919f] w-6' : 'bg-[#1e3d44]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
