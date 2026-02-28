'use client'

import { useState, useRef, useEffect } from 'react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        const data = await res.json()
        setError(data.error || 'A apărut o eroare. Vă rugăm încercați din nou.')
      }
    } catch (err) {
      setError('A apărut o eroare. Vă rugăm încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  const locations = [
    {
      city: 'Chișinău',
      branches: [
        { name: 'Centru', address: 'Nicolae Iorga 22', mapQuery: 'Nicolae+Iorga+22,+Chisinau,+Moldova' },
        { name: 'Botanica', address: 'Decebal 23/2', mapQuery: 'Decebal+23/2,+Chisinau,+Moldova' },
        { name: 'Ciocana', address: 'Mircea cel Bătrân 34/6', mapQuery: 'Mircea+cel+Batran+34/6,+Chisinau,+Moldova' },
        { name: 'Buiucani', address: 'Alba Iulia 89', mapQuery: 'Alba+Iulia+89,+Chisinau,+Moldova' },
        { name: 'Sculeanca', address: 'Calea Ieșilor 16/4', mapQuery: 'Calea+Iesilor+16/4,+Chisinau,+Moldova' },
        { name: 'Râșcani', address: 'Studenților 10/3', mapQuery: 'Studentilor+10/3,+Chisinau,+Moldova' },
      ]
    },
    {
      city: 'Măgdăcești',
      branches: [
        { name: 'Centru', address: 'Str. Petre Magciu 10', mapQuery: '47.145099,28.830158' },
      ]
    }
  ]

  const allBranches = locations.flatMap((loc, cityIndex) => 
    loc.branches.map((branch, branchIndex) => ({
      ...branch,
      city: loc.city,
      index: cityIndex * 10 + branchIndex
    }))
  )

  const currentBranch = allBranches[selectedLocation] || allBranches[0]

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#FFFBF5]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-800/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-600 text-sm">Contact & Locații</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">
            Găsește-ne{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-900">
              aproape de tine
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Locații în Chișinău și Măgdăcești. Alege cea mai convenabilă pentru tine!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Locations & Map */}
          <div className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Location Selector */}
            <div className="bg-white backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg p-6">
              <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Locațiile noastre
              </h3>

              {locations.map((location, cityIndex) => (
                <div key={location.city} className="mb-4 last:mb-0">
                  <p className="text-red-500 text-sm font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    {location.city}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {location.branches.map((branch, branchIndex) => {
                      const globalIndex = allBranches.findIndex(
                        b => b.city === location.city && b.name === branch.name
                      )
                      return (
                        <button
                          key={branch.name}
                          onClick={() => setSelectedLocation(globalIndex)}
                          className={`p-3 rounded-xl text-left transition-all duration-300 ${
                            selectedLocation === globalIndex
                              ? 'bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/10'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          } border`}
                        >
                          <p className={`font-medium text-sm ${selectedLocation === globalIndex ? 'text-red-600' : 'text-gray-900'}`}>
                            {branch.name}
                          </p>
                          <p className="text-gray-500 text-xs truncate">{branch.address}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-lg aspect-[4/3]">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${currentBranch.mapQuery}&zoom=16`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              {/* Map Overlay with Address - pointer-events-none allows clicking through */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{currentBranch.city} - {currentBranch.name}</p>
                    <p className="text-gray-400 text-sm">{currentBranch.address}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${currentBranch.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2 pointer-events-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Deschide în Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Info Row */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <a 
                href="tel:+373060331177"
                className="p-3 sm:p-4 bg-white hover:bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-red-500/30 transition-all group shadow-sm"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-500/20 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1">Telefon</p>
                <p className="text-gray-900 font-semibold text-xs sm:text-base">060 331 177</p>
              </a>
              <a 
                href="mailto:fast.english.moldova@gmail.com"
                className="p-3 sm:p-4 bg-white hover:bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-red-500/30 transition-all group overflow-hidden shadow-sm"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-500/20 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1">Email</p>
                <p className="text-gray-900 font-semibold text-[10px] sm:text-sm truncate">fast.english.moldova@gmail.com</p>
              </a>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="bg-white backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg p-6 lg:p-8">
              <h3 className="text-gray-900 font-bold text-xl mb-2">Trimite-ne un mesaj</h3>
              <p className="text-gray-500 text-sm mb-4">Îți vom răspunde în cel mai scurt timp posibil.</p>

              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Mesaj trimis!</h3>
                  <p className="text-gray-500 mb-6">
                    Mulțumim pentru mesaj. Te vom contacta în cel mai scurt timp.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Trimite alt mesaj
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nume complet
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors"
                      placeholder="Introduceți numele"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors"
                        placeholder="email@exemplu.md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors"
                        placeholder="06X XXX XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesaj
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors resize-none"
                      placeholder="Scrieți mesajul dvs. aici..."
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/25"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Se trimite...
                      </>
                    ) : (
                      <>
                        Trimite mesajul
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-gray-500 text-sm">Urmărește-ne:</span>
              <div className="flex gap-3">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-900 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-900 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
