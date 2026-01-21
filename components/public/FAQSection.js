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
    general: { bg: 'bg-blue-500/20', text: 'text-blue-400', activeBg: 'bg-blue-500' },
    cursuri: { bg: 'bg-purple-500/20', text: 'text-purple-400', activeBg: 'bg-purple-500' },
    organizare: { bg: 'bg-amber-500/20', text: 'text-amber-400', activeBg: 'bg-amber-500' },
    inscriere: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', activeBg: 'bg-emerald-500' },
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
      question: 'Ce este Pi School?',
      answer: 'Pi School este un centru educațional specializat în cursuri de matematică și programare pentru copii și adolescenți. Oferim un mediu de învățare modern, interactiv și adaptat nevoilor fiecărui elev, cu focus pe dezvoltarea gândirii logice și a abilităților practice.'
    },
    {
      category: 'cursuri',
      question: 'Pentru ce clase sunt destinate cursurile?',
      answer: 'Cursurile noastre sunt structurate pe niveluri de vârstă: cursuri pentru clasele primare (I-IV), gimnaziu (V-VIII) și liceu (IX-XII). Fiecare program este adaptat curriculumului școlar și extins cu noțiuni avansate pentru cei care doresc să exceleze.'
    },
    {
      category: 'inscriere',
      question: 'Elevul trebuie să fie foarte bun la matematică ca să se înscrie?',
      answer: 'Nu! La Pi School primim elevi de toate nivelurile. Scopul nostru este să ajutăm fiecare copil să progreseze de la nivelul său actual. Avem grupe pentru începători, nivel mediu și avansat, astfel încât fiecare elev să învețe în ritmul propriu.'
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
      answer: 'Elevii dezvoltă gândire logică și analitică, îmbunătățesc notele școlare, câștigă încredere în propriile abilități, învață să rezolve probleme complexe și se pregătesc pentru examene și olimpiade. Pentru programare, dobândesc abilități tehnice valoroase pentru viitor.'
    },
    {
      category: 'organizare',
      question: 'Cum sunt organizate grupele?',
      answer: 'Grupele sunt formate din maximum 8 elevi de același nivel și vârstă similară. Acest lucru permite atenție individualizată și un ritm de învățare optim pentru toți participanții. Evaluăm fiecare elev înainte de a-l repartiza într-o grupă potrivită.'
    },
    {
      category: 'general',
      question: 'Profesorii sunt calificați?',
      answer: 'Da, toți profesorii noștri sunt specialiști cu experiență în predare și pasiune pentru educație. Mulți dintre ei sunt absolvenți de matematică, informatică sau inginerie, cu experiență în lucrul cu copiii și rezultate dovedite.'
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
      question: 'De ce să aleg Pi School?',
      answer: 'Pi School oferă o combinație unică de profesori dedicați, grupe mici, metodă modernă de predare și rezultate demonstrate. Avem 7 locații convenabile, flexibilitate în programare și un mediu prietenos unde copiii învață cu plăcere. Rezultatele elevilor noștri la examene și olimpiade vorbesc de la sine!'
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
      <div className="absolute inset-0 bg-[#030303]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-teal-900/5 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-40 left-10 w-20 h-20 border border-emerald-500/10 rounded-2xl rotate-12 opacity-50" />
      <div className="absolute bottom-40 right-20 w-32 h-32 border border-white/5 rounded-full opacity-30" />
      <div className="absolute top-1/3 right-10 w-2 h-2 bg-emerald-500/50 rounded-full animate-pulse" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-lg">💡</span>
            <span className="text-gray-400 text-sm font-medium">Întrebări frecvente</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-4">
            Ai{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 animate-gradient">
                întrebări?
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 4 150 4 198 10" stroke="url(#faq-underline)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="faq-underline" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#10b981" />
                    <stop offset="1" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-6">
            Găsește răspunsuri rapide la cele mai frecvente întrebări despre Pi School
          </p>
        </div>

        {/* Search Bar */}
        <div className={`max-w-xl mx-auto mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Caută întrebări..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
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
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
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
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    openIndex === index 
                      ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/30 shadow-lg shadow-emerald-500/5' 
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
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
                        openIndex === index ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openIndex === index 
                        ? 'bg-emerald-500/20 rotate-180' 
                        : 'bg-white/10'
                    }`}>
                      <svg className={`w-4 h-4 transition-colors ${openIndex === index ? 'text-emerald-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-5 pb-5 pl-[4.25rem] text-gray-400 leading-relaxed text-sm">
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
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400">Nu am găsit întrebări pentru căutarea ta.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Resetează filtrele
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className={`mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative p-8 rounded-3xl overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/10 to-emerald-600/20" />
            <div className="absolute inset-0 backdrop-blur-xl" />
            <div className="absolute inset-[1px] rounded-3xl bg-[#030303]/80" />
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-3xl border border-emerald-500/20" />
            
            {/* Content */}
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full" />
                </div>
                <div>
                  <h3 className="text-white text-2xl font-bold mb-1">Nu ai găsit răspunsul?</h3>
                  <p className="text-gray-400">
                    Echipa noastră îți răspunde în mai puțin de 24 de ore!
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:069113314"
                  className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-all border border-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Sună-ne
                </a>
                <a
                  href="#contact"
                  className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/25"
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
