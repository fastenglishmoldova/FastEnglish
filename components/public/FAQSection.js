'use client'

import { useState } from 'react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'Care este mărimea grupelor?',
      answer: 'Grupele noastre au maximum 8 elevi pentru a asigura atenție individualizată. Acest lucru permite profesorului să lucreze eficient cu fiecare elev și să adapteze ritmul în funcție de nevoile grupei.'
    },
    {
      question: 'Cum pot să mă înscriu?',
      answer: 'Poți să te înscrii completând formularul de înscriere de pe site sau contactându-ne direct. După înscriere, vom programa o evaluare gratuită pentru a determina nivelul și a te repartiza în grupa potrivită.'
    },
    {
      question: 'Ce se întâmplă dacă lipsesc de la o ședință?',
      answer: 'Oferim posibilitatea de recuperare a ședințelor pierdute. Trebuie să anunțați absența cu cel puțin 24 de ore înainte, iar noi vom programa o ședință de recuperare într-o altă grupă de același nivel.'
    },
    {
      question: 'Cât costă cursurile?',
      answer: 'Prețurile variază în funcție de tipul cursului și frecvența ședințelor. Contactați-ne pentru o ofertă personalizată și informații despre reducerile disponibile pentru plata în avans sau pentru frați.'
    },
    {
      question: 'Ce materiale sunt necesare?',
      answer: 'Elevii au nevoie doar de caiet, instrumente de scris și calculator (pentru clasele mai mari). Toate materialele didactice și fișele de lucru sunt furnizate de noi.'
    },
    {
      question: 'Oferiți pregătire pentru examene?',
      answer: 'Da, avem cursuri specializate pentru pregătirea Evaluării Naționale și Bacalaureat. Acestea includ rezolvarea subiectelor din anii anteriori, simulări și strategii pentru gestionarea timpului.'
    }
  ]

  return (
    <section id="faq" className="py-20 lg:py-32 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-emerald-400 text-sm font-medium">Întrebări frecvente</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Ai întrebări?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Găsește răspunsuri la cele mai frecvente întrebări despre cursurile noastre.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-white font-medium pr-4">{faq.question}</span>
                <div className={`flex-shrink-0 p-2 rounded-lg bg-emerald-500/10 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-6 text-gray-400">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20">
          <svg className="w-12 h-12 text-emerald-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-white text-xl font-semibold mb-2">Nu ai găsit răspunsul?</h3>
          <p className="text-gray-400 mb-4">
            Contactează-ne și îți vom răspunde în cel mai scurt timp.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
          >
            Contactează-ne
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
