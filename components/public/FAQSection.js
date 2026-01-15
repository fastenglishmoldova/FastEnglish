'use client'

import { useState } from 'react'
import { ChevronDownIcon, QuestionMarkCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const faqItems = [
  {
    question: 'Ce vârstă trebuie să aibă copilul pentru a se înscrie?',
    answer: 'Cursurile noastre sunt disponibile pentru copii cu vârste între 5 și 16 ani. Fiecare curs are limite de vârstă specifice, indicate în descrierea cursului.'
  },
  {
    question: 'Cum funcționează procesul de înscriere?',
    answer: 'Procesul este simplu: completați formularul de înscriere online, iar echipa noastră vă va contacta în maxim 24 de ore pentru confirmare și detalii despre programul ales.'
  },
  {
    question: 'Ce se întâmplă dacă copilul absentează?',
    answer: 'Înțelegem că pot apărea situații neprevăzute. Pentru absențe justificate, oferim posibilitatea de recuperare a lecțiilor, în funcție de disponibilitate. Vă rugăm să ne anunțați cu cel puțin 24 de ore înainte.'
  },
  {
    question: 'Care sunt metodele de plată acceptate?',
    answer: 'Acceptăm plata în numerar la sediul nostru, transfer bancar și plată cu cardul. Oferim și posibilitatea plății în rate pentru pachetele complete.'
  },
  {
    question: 'Părinții pot asista la lecții?',
    answer: 'Prima lecție este deschisă părinților pentru a vedea cum decurg cursurile. După aceea, pentru a asigura un mediu optim de învățare, părinții sunt invitați să participe la sesiunile speciale dedicate lor.'
  },
  {
    question: 'Ce măsuri de siguranță aveți?',
    answer: 'Siguranța copiilor este prioritatea noastră. Avem personal calificat, supraveghere video, acces restricționat și protocoale stricte de predare-preluare a copiilor.'
  },
  {
    question: 'Oferiți reduceri pentru frați?',
    answer: 'Da! Oferim o reducere de 10% pentru al doilea copil înscris din aceeași familie și 15% pentru al treilea copil.'
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-[#112428]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#30919f]/10 text-[#30919f] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <QuestionMarkCircleIcon className="w-4 h-4" />
            Suport
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Întrebări <span className="text-[#f8b316]">frecvente</span>
          </h2>
          <p className="text-lg text-gray-400">
            Găsește răspunsuri la cele mai comune întrebări
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-[#15292e] rounded-2xl border border-[#1e3d44] overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="cursor-pointer w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#1e3d44]/50 transition-colors"
              >
                <span className="font-semibold text-white pr-4">{item.question}</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-[#30919f] flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-5 text-gray-400">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Nu ai găsit răspunsul căutat?</p>
          <a 
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#30919f] to-[#136976] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#30919f]/30 transition-all"
          >
            Contactează-ne
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  )
}
