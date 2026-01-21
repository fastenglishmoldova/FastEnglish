'use client'

import { useState, useEffect } from 'react'

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/public/reviews')
        if (res.ok) {
          const data = await res.json()
          setReviews(data.slice(0, 6)) // Show max 6 reviews
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section id="recenzii" className="py-20 lg:py-32 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-amber-400 text-sm font-medium">Recenzii</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Ce spun părinții și elevii
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Succesul nostru se măsoară în rezultatele elevilor și satisfacția familiilor lor.
          </p>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="group p-6 bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all duration-300"
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <svg className="w-8 h-8 text-amber-500/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {renderStars(review.rating || 5)}
                </div>

                {/* Review Text */}
                <p className="text-gray-300 mb-6 line-clamp-4">
                  "{review.content || review.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold">
                    {(review.authorName || review.author || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{review.authorName || review.author}</p>
                    {review.relation && (
                      <p className="text-gray-500 text-sm">{review.relation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Default reviews when no data */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                content: 'Copilul meu a făcut progrese remarcabile în doar câteva luni. Profesorii sunt foarte dedicați și metodele lor de predare sunt eficiente.',
                author: 'Maria P.',
                relation: 'Părinte'
              },
              {
                content: 'Am învățat să-mi placă matematica! Explicațiile sunt clare și exercițiile sunt interesante. Recomand tuturor colegilor!',
                author: 'Andrei M.',
                relation: 'Elev clasa a 8-a'
              },
              {
                content: 'Atmosfera este plăcută și profesorii au răbdare să explice de câte ori este nevoie. Nota la matematică a crescut de la 6 la 9!',
                author: 'Elena T.',
                relation: 'Părinte'
              }
            ].map((review, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="mb-4">
                  <svg className="w-8 h-8 text-amber-500/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div className="flex gap-1 mb-4">
                  {renderStars(5)}
                </div>
                <p className="text-gray-300 mb-6">"{review.content}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium">{review.author}</p>
                    <p className="text-gray-500 text-sm">{review.relation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
