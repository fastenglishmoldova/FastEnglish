'use client'

import { useState, useRef, useEffect } from 'react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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

  const categories = [
    { 
      id: 'all', 
      label: 'Toate', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    { 
      id: 'general', 
      label: 'General', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'cursuri', 
      label: 'Cursuri', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: 'organizare', 
      label: 'Organizare', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'inscriere', 
      label: 'Înscriere', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
  ]

  // Category colors for FAQ icons
  const categoryColors = {
    general: { bg: 'bg-blue-900/10', text: 'text-blue-900', activeBg: 'bg-blue-900' },
    cursuri: { bg: 'bg-red-500/10', text: 'text-red-600', activeBg: 'bg-red-500' },
    organizare: { bg: 'bg-blue-600/10', text: 'text-blue-600', activeBg: 'bg-blue-600' },
    inscriere: { bg: 'bg-red-600/10', text: 'text-red-600', activeBg: 'bg-red-600' },
  }

  // Category icons for FAQ items
  const categoryIcons = {
    general: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    cursuri: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    organizare: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    inscriere: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  }

  const faqs = [
    {
      category: 'general',
      question: 'Ce este Fast English?',
      answer: 'Fast English este un centru educațional specializat în cursuri de engleză pentru copii și adolescenți. Oferim un mediu de învățare modern, interactiv și adaptat nevoilor fiecărui elev, cu focus pe comunicare și vorbire fluență.'
    },
    {
      category: 'cursuri',
      question: 'Pentru ce vârste sunt destinate cursurile?',
      answer: 'Cursurile noastre sunt structurate pe niveluri: Beginner, Intermediate și Advanced. Fiecare program este adaptat vârstei și nivelului de cunoștințe ale elevului.'
    },
    {
      category: 'inscriere',
      question: 'Elevul trebuie să știe deja engleză ca să se înscrie?',
      answer: 'Nu! La Fast English primim elevi de toate nivelurile. Scopul nostru este să ajutăm fiecare copil să progreseze de la nivelul său actual. Avem grupe pentru începători, nivel mediu și avansat.'
    },
    {
      category: 'cursuri',
      question: 'Cum se desfășoară lecțiile?',
      answer: 'Lecțiile combină explicații teoretice cu exerciții practice și interactive. Folosim metode moderne de predare, inclusiv vizualizări, jocuri educative și proiecte practice. Profesorii noștri asigură că fiecare elev înțelege conceptele înainte de a trece mai departe.'
    },
    {
      category: 'organizare',
      question: 'Cât durează o lecție?',
      answer: 'Lecțiile din timpul săptămânii durează 60 de minute, iar cele de weekend durează 2 ore cu pauză inclusă. Această structură permite aprofundarea temelor și timp suficient pentru practică și întrebări.'
    },
    {
      category: 'organizare',
      question: 'Cursurile sunt fizice sau online?',
      answer: 'Cursurile se desfășoară fizic la una din cele 7 locații ale noastre din Chișinău și Măgdăcești. Credem că interacțiunea directă profesor-elev și dinamica grupei sunt esențiale pentru o învățare eficientă.'
    },
    {
      category: 'cursuri',
      question: 'Ce beneficii va avea elevul după participarea la cursuri?',
      answer: 'Elevii dezvoltă încredere în vorbirea engleză, îmbunătățesc notele școlare, câștigă abilități de comunicare internațională, și se pregătesc pentru examene Cambridge și IELTS.'
    },
    {
      category: 'organizare',
      question: 'Cum sunt organizate grupele?',
      answer: 'Grupele sunt formate din maximum 8 elevi de același nivel și vârstă similară. Acest lucru permite atenție individualizată și un ritm de învățare optim pentru toți participanții. Evaluăm fiecare elev înainte de a-l repartiza într-o grupă potrivită.'
    },
    {
      category: 'general',
      question: 'Profesorii sunt calificați?',
      answer: 'Da, toți profesorii noștri sunt specialiști cu experiență în predare și pasiune pentru educație. Mulți dintre ei vorbesc engleza nativ sau au certificate internaționale, cu experiență în lucrul cu copiii și rezultate dovedite.'
    },
    {
      category: 'general',
      question: 'Părinții pot urmări progresul elevului?',
      answer: 'Absolut! Oferim feedback regulat părinților despre progresul copilului, prezența la cursuri și recomandări pentru studiu individual. De asemenea, organizăm întâlniri periodice și suntem mereu disponibili pentru discuții.'
    },
    {
      category: 'inscriere',
      question: 'Se oferă lecție de probă?',
      answer: 'Da, oferim o lecție de probă gratuită pentru ca elevul și părinții să se familiarizeze cu stilul nostru de predare și să decidă dacă este potrivit. Este o oportunitate excelentă să ne cunoaștem reciproc!'
    },
    {
      category: 'inscriere',
      question: 'Cât costă cursurile?',
      answer: 'Prețurile variază în funcție de tipul cursului, frecvența lecțiilor și nivelul de studiu. Oferim pachete flexibile și reduceri pentru plata în avans sau pentru frați. Contactează-ne pentru o ofertă personalizată și detalii complete.'
    },
    {
      category: 'inscriere',
      question: 'Cum pot înscrie copilul la cursuri?',
      answer: 'Poți înscrie copilul completând formularul de înscriere de pe site, sunând la numărul nostru de telefon sau vizitându-ne la una din locații. După înscriere, vom programa o evaluare și o lecție de probă gratuită.'
    },
    {
      category: 'general',
      question: 'De ce să aleg Fast English?',
      answer: 'Fast English oferă o combinație unică de profesori dedicați, grupe mici, metodă modernă de predare și rezultate demonstrate. Avem locații convenabile, flexibilitate în programare și un mediu prietenos unde copiii învață cu plăcere. Rezultatele elevilor noștri la examene vorbesc de la sine!'
    }
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="faq" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFFBF5] to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-40 left-10 w-20 h-20 border-2 border-red-500/10 rounded-2xl rotate-12 opacity-50" />
      <div className="absolute bottom-40 right-20 w-32 h-32 border-2 border-blue-900/10 rounded-full opacity-30" />
      <div className="absolute top-1/3 right-10 w-3 h-3 bg-red-500/40 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 left-20 w-2 h-2 bg-blue-900/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border-2 border-red-500/20 rounded-full mb-6 shadow-lg shadow-red-500/5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-900 text-sm font-bold">Întrebări frecvente</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-4">
            Ai{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-blue-900">
                întrebări?
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 4 150 4 198 10" stroke="url(#faq-underline)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="faq-underline" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#dc2626" />
                    <stop offset="1" stopColor="#1e3a8a" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-6">
            Găsește răspunsuri rapide la cele mai frecvente întrebări despre Fast English
          </p>
        </div>

        {/* Search Bar */}
        <div className={`max-w-xl mx-auto mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Caută întrebări..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-2 mb-10 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenIndex(-1); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-2 border-gray-200 shadow-sm hover:border-red-500/30'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ List - Single Column for proper accordion behavior */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredFaqs.map((faq, index) => {
            const colors = categoryColors[faq.category]
            return (
              <div
                key={index}
                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${200 + index * 30}ms` }}
              >
                <div
                  className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                    openIndex === index 
                      ? 'bg-gradient-to-br from-red-50 via-white to-blue-50 border-red-500/30 shadow-xl shadow-red-500/5' 
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-red-500/20 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                    className="w-full p-5 flex items-center justify-between text-left gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        openIndex === index 
                          ? `${colors.activeBg} text-white shadow-lg` 
                          : `${colors.bg} ${colors.text}`
                      }`}>
                        {categoryIcons[faq.category]}
                      </div>
                      <span className={`font-medium transition-colors ${
                        openIndex === index ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openIndex === index 
                        ? 'bg-red-500/20 rotate-180' 
                        : 'bg-gray-100'
                    }`}>
                      <svg className={`w-4 h-4 transition-colors ${openIndex === index ? 'text-red-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-5 pb-5 pl-[4.25rem] text-gray-600 leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">Nu am găsit întrebări pentru căutarea ta.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 text-red-500 hover:text-red-600 font-medium"
            >
              Resetează filtrele
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className={`mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative p-8 lg:p-10 rounded-3xl overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-white to-blue-50" />
            <div className="absolute inset-[1px] rounded-3xl bg-white/90" />
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-red-500/20" />
            
            {/* Content */}
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
                </div>
                <div>
                  <h3 className="text-gray-900 text-2xl font-bold mb-1">Nu ai găsit răspunsul?</h3>
                  <p className="text-gray-600">
                    Echipa noastră îți răspunde în mai puțin de <span className="font-semibold text-red-600">24 de ore</span>!
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+373060331177"
                  className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all border-2 border-gray-200 shadow-sm hover:border-blue-900/30"
                >
                  <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Sună-ne
                </a>
                <a
                  href="#contact"
                  className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
                >
                  Scrie-ne un mesaj
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
