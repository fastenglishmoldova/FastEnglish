'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  AcademicCapIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const CLASE = [
  { id: 'pregatitoare', name: 'Clasa pregătitoare' },
  { id: '1', name: 'Clasa I' },
  { id: '2', name: 'Clasa a II-a' },
  { id: '3', name: 'Clasa a III-a' },
  { id: '4', name: 'Clasa a IV-a' },
  { id: '5', name: 'Clasa a V-a' },
  { id: '6', name: 'Clasa a VI-a' },
  { id: '7', name: 'Clasa a VII-a' },
  { id: '8', name: 'Clasa a VIII-a' },
  { id: '9', name: 'Clasa a IX-a' },
  { id: '10', name: 'Clasa a X-a' },
  { id: '11', name: 'Clasa a XI-a' }
]

export default function InscrieriPage() {
  const [cursuri, setCursuri] = useState([])
  const [loadingCursuri, setLoadingCursuri] = useState(true)
  const [formData, setFormData] = useState({
    numeParinte: '',
    numeCopil: '',
    email: '',
    telefon: '',
    clasa: '',
    cursuriSelectate: '',
    mesaj: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCursuri()
  }, [])

  const fetchCursuri = async () => {
    try {
      const res = await fetch('/api/public/courses')
      if (res.ok) {
        const data = await res.json()
        setCursuri(data)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoadingCursuri(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCursChange = (cursId) => {
    setFormData(prev => ({
      ...prev,
      cursuriSelectate: cursId
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/inscrieri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'A apărut o eroare. Vă rugăm încercați din nou.')
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-2.5 xs:p-3 md:p-4">
        <div className="max-w-md w-full bg-[var(--card-bg)] rounded-xl xs:rounded-2xl md:rounded-3xl p-4 xs:p-6 sm:p-8 text-center border border-[var(--border-color)] shadow-2xl">
          <div className="w-14 h-14 xs:w-16 xs:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#30919f] to-[#136976] rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4 md:mb-6">
            <CheckCircleIcon className="w-7 h-7 xs:w-8 xs:h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-lg xs:text-xl md:text-2xl font-bold text-[var(--foreground)] mb-2 xs:mb-3 md:mb-4 px-2">Mulțumim pentru înscriere!</h1>
          <p className="text-xs xs:text-sm md:text-base text-[var(--text-muted)] mb-4 xs:mb-6 md:mb-8 px-2">
            Am primit cererea dumneavoastră de înscriere. Vă vom contacta în cel mai scurt timp posibil pentru confirmare și detalii.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 xs:gap-2 px-4 xs:px-5 md:px-6 py-2 xs:py-2.5 md:py-3 bg-gradient-to-r from-[#30919f] to-[#136976] text-white rounded-lg xs:rounded-xl text-xs xs:text-sm md:text-base font-semibold hover:from-[#136976] hover:to-[#0f5460] transition-all duration-300"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5" />
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[#136976]/50 backdrop-blur-sm border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-2.5 xs:px-4 sm:px-6 lg:px-8 py-2.5 xs:py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1.5 xs:gap-2 md:gap-3 group">
              <div className="relative w-7 h-7 xs:w-8 xs:h-8 md:w-10 md:h-10 rounded-full overflow-hidden ring-2 ring-[#30919f]/50 group-hover:ring-[#f8b316] transition-all">
                <Image
                  src="/pi.png"
                  alt="PI School"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm xs:text-base md:text-lg font-bold text-[var(--foreground)]">PI SCHOOL</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1 xs:gap-1.5 md:gap-2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeftIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 md:w-4 md:h-4" />
              <span className="text-[10px] xs:text-xs md:text-sm">Înapoi</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-2.5 xs:px-4 sm:px-6 lg:px-8 py-5 xs:py-6 sm:py-8 md:py-12">
        {/* Title */}
        <div className="text-center mb-5 xs:mb-6 sm:mb-8 md:mb-12">
          <div className="inline-flex items-center px-2.5 xs:px-3 md:px-4 py-1 xs:py-1.5 md:py-2 bg-[#f8b316]/10 border border-[#f8b316]/20 rounded-full mb-3 xs:mb-4 md:mb-6">
            <SparklesIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 md:w-4 md:h-4 text-[#f8b316] mr-1 xs:mr-1.5 md:mr-2" />
            <span className="text-[10px] xs:text-xs md:text-sm font-medium text-[#f8b316]">Înscrieri 2025</span>
          </div>
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2 xs:mb-3 md:mb-4 px-2">
            Formular de <span className="text-[#30919f]">Înscriere</span>
          </h1>
          <p className="text-xs xs:text-sm md:text-base text-[var(--text-muted)] max-w-2xl mx-auto px-2">
            Completați formularul de mai jos pentru a înscrie copilul dumneavoastră la cursurile PI School.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[var(--card-bg)] rounded-xl xs:rounded-2xl md:rounded-3xl p-3 xs:p-4 sm:p-6 md:p-8 border border-[var(--border-color)] shadow-2xl">
          {error && (
            <div className="mb-3 xs:mb-4 md:mb-6 p-2.5 xs:p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-lg xs:rounded-xl text-red-400 text-[10px] xs:text-xs md:text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
            {/* Nume Părinte */}
            <div>
              <label className="block text-[var(--foreground)] text-[10px] xs:text-xs md:text-sm font-medium mb-1 xs:mb-1.5 md:mb-2">
                Numele părintelui/tutorelui *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-2.5 xs:left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-[#30919f]" />
                <input
                  type="text"
                  name="numeParinte"
                  value={formData.numeParinte}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 xs:pl-10 md:pl-12 pr-2.5 xs:pr-3 md:pr-4 py-2 xs:py-2.5 md:py-3 text-xs xs:text-sm md:text-base bg-[var(--background)] border border-[var(--border-color)] rounded-lg xs:rounded-xl text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#30919f] transition-colors"
                  placeholder="Ex: Maria Popescu"
                />
              </div>
            </div>

            {/* Nume Copil */}
            <div>
              <label className="block text-[var(--foreground)] text-[10px] xs:text-xs md:text-sm font-medium mb-1 xs:mb-1.5 md:mb-2">
                Numele copilului *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-2.5 xs:left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-[#f8b316]" />
                <input
                  type="text"
                  name="numeCopil"
                  value={formData.numeCopil}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 xs:pl-10 md:pl-12 pr-2.5 xs:pr-3 md:pr-4 py-2 xs:py-2.5 md:py-3 text-xs xs:text-sm md:text-base bg-[var(--background)] border border-[var(--border-color)] rounded-lg xs:rounded-xl text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#30919f] transition-colors"
                  placeholder="Ex: Alex Popescu"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[var(--foreground)] text-[10px] xs:text-xs md:text-sm font-medium mb-1 xs:mb-1.5 md:mb-2">
                Email *
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-2.5 xs:left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-[#30919f]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 xs:pl-10 md:pl-12 pr-2.5 xs:pr-3 md:pr-4 py-2 xs:py-2.5 md:py-3 text-xs xs:text-sm md:text-base bg-[var(--background)] border border-[var(--border-color)] rounded-lg xs:rounded-xl text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#30919f] transition-colors"
                  placeholder="email@exemplu.com"
                />
              </div>
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-[var(--foreground)] text-[10px] xs:text-xs md:text-sm font-medium mb-1 xs:mb-1.5 md:mb-2">
                Telefon *
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-2.5 xs:left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-[#30919f]" />
                <input
                  type="tel"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 xs:pl-10 md:pl-12 pr-2.5 xs:pr-3 md:pr-4 py-2 xs:py-2.5 md:py-3 text-xs xs:text-sm md:text-base bg-[var(--background)] border border-[var(--border-color)] rounded-lg xs:rounded-xl text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#30919f] transition-colors"
                  placeholder="06XX XXX XX"
                />
              </div>
            </div>

            {/* Clasa */}
            <div className="md:col-span-2">
              <label className="block text-[var(--foreground)] text-[10px] xs:text-xs md:text-sm font-medium mb-1 xs:mb-1.5 md:mb-2">
                Clasa copilului *
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-2.5 xs:left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-[#30919f]" />
                <select
                  name="clasa"
                  value={formData.clasa}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 xs:pl-10 md:pl-12 pr-6 xs:pr-8 md:pr-4 py-2 xs:py-2.5 md:py-3 text-xs xs:text-sm md:text-base bg-[var(--background)] border border-[var(--border-color)] rounded-lg xs:rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[#30919f] transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Selectează clasa</option>
                  {CLASE.map(clasa => (
                    <option key={clasa.id} value={clasa.id}>{clasa.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cursuri */}
            <div className="md:col-span-2">
              <label className="block text-[var(--foreground)] text-[10px] xs:text-xs md:text-sm font-medium mb-1.5 xs:mb-2 md:mb-3">
                Cursuri dorite *
              </label>
              {loadingCursuri ? (
                <div className="flex items-center justify-center py-5 xs:py-6 md:py-8">
                  <div className="animate-spin rounded-full h-5 w-5 xs:h-6 xs:w-6 md:h-8 md:w-8 border-b-2 border-[#30919f]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-1.5 xs:gap-2 md:gap-3">
                  {/* Opțiunea "Selectăm împreună" */}
                  <label
                    className={`flex items-center gap-1.5 xs:gap-2 md:gap-3 p-2.5 xs:p-3 md:p-4 rounded-lg xs:rounded-xl border cursor-pointer transition-all duration-300 ${
                      formData.cursuriSelectate === 'selectam-impreuna'
                        ? 'bg-[#f8b316]/20 border-[#f8b316] text-[var(--foreground)]'
                        : 'bg-[var(--background)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[#f8b316]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="curs"
                      checked={formData.cursuriSelectate === 'selectam-impreuna'}
                      onChange={() => handleCursChange('selectam-impreuna')}
                      className="sr-only"
                    />
                    <div className={`w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.cursuriSelectate === 'selectam-impreuna'
                        ? 'bg-[#f8b316] border-[#f8b316]'
                        : 'border-[var(--border-color)]'
                    }`}>
                      {formData.cursuriSelectate === 'selectam-impreuna' && (
                        <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 md:w-2.5 md:h-2.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-[10px] xs:text-xs md:text-sm font-medium">Selectăm împreună</span>
                  </label>

                  {/* Cursurile din baza de date */}
                  {cursuri.map(curs => (
                    <label
                      key={curs.id}
                      className={`flex items-center gap-1.5 xs:gap-2 md:gap-3 p-2.5 xs:p-3 md:p-4 rounded-lg xs:rounded-xl border cursor-pointer transition-all duration-300 ${
                        formData.cursuriSelectate === curs.id
                          ? 'bg-[#30919f]/20 border-[#30919f] text-[var(--foreground)]'
                          : 'bg-[var(--background)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[#30919f]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="curs"
                        checked={formData.cursuriSelectate === curs.id}
                        onChange={() => handleCursChange(curs.id)}
                        className="sr-only"
                      />
                      <div className={`w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.cursuriSelectate === curs.id
                          ? 'bg-[#30919f] border-[#30919f]'
                          : 'border-[var(--border-color)]'
                      }`}>
                        {formData.cursuriSelectate === curs.id && (
                          <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 md:w-2.5 md:h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-[10px] xs:text-xs md:text-sm font-medium leading-tight">{curs.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Mesaj */}
            <div className="md:col-span-2">
              <label className="block text-[var(--foreground)] text-[10px] xs:text-xs md:text-sm font-medium mb-1 xs:mb-1.5 md:mb-2">
                Mesaj suplimentar (opțional)
              </label>
              <div className="relative">
                <ChatBubbleBottomCenterTextIcon className="absolute left-2.5 xs:left-3 md:left-4 top-2.5 xs:top-3 md:top-4 w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-[#30919f]" />
                <textarea
                  name="mesaj"
                  value={formData.mesaj}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-8 xs:pl-10 md:pl-12 pr-2.5 xs:pr-3 md:pr-4 py-2 xs:py-2.5 md:py-3 text-xs xs:text-sm md:text-base bg-[var(--background)] border border-[var(--border-color)] rounded-lg xs:rounded-xl text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#30919f] transition-colors resize-none"
                  placeholder="Menționați orice informații suplimentare relevante..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 xs:mt-5 sm:mt-6 md:mt-8">
            <button
              type="submit"
              disabled={isSubmitting || formData.cursuriSelectate.length === 0}
              className="w-full py-2.5 xs:py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-[#30919f] to-[#136976] text-white rounded-lg xs:rounded-xl font-bold text-xs xs:text-sm sm:text-base md:text-lg hover:from-[#136976] hover:to-[#0f5460] transition-all duration-300 shadow-lg shadow-[#30919f]/25 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 xs:gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Se trimite...</span>
                </>
              ) : (
                <>
                  <AcademicCapIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5" />
                  <span className="hidden xs:inline">Trimite cererea de înscriere</span>
                  <span className="xs:hidden">Trimite înscriere</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[var(--text-muted)] text-[9px] xs:text-[10px] md:text-xs text-center mt-2.5 xs:mt-3 md:mt-4 px-2">
            Prin trimiterea formularului, sunteți de acord cu procesarea datelor personale conform GDPR.
          </p>
        </form>
      </div>
    </div>
  )
}
