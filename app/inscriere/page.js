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
  ArrowLeftIcon
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
  { id: '11', name: 'Clasa a XI-a' },
  { id: '12', name: 'Clasa a XII-a' }
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Mulțumim pentru înscriere!</h1>
          <p className="text-gray-400 mb-8">
            Am primit cererea dumneavoastră de înscriere. Vă vom contacta în cel mai scurt timp posibil pentru confirmare și detalii.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-emerald-900/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/pi.png"
                  alt="Pi School"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Pi School</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm">Înapoi</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Înscrieri deschise 2025-2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Formular de <span className="text-emerald-400">Înscriere</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Completați formularul de mai jos pentru a înscrie copilul dumneavoastră la cursurile Pi School.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Nume Părinte */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Numele părintelui/tutorelui *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  name="numeParinte"
                  value={formData.numeParinte}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="Ex: Maria Popescu"
                />
              </div>
            </div>

            {/* Nume Copil */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Numele copilului *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  name="numeCopil"
                  value={formData.numeCopil}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="Ex: Alex Popescu"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email *
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="email@exemplu.com"
                />
              </div>
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Telefon *
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="tel"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="07XX XXX XXX"
                />
              </div>
            </div>

            {/* Clasa */}
            <div className="md:col-span-2">
              <label className="block text-white text-sm font-medium mb-2">
                Clasa copilului *
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <select
                  name="clasa"
                  value={formData.clasa}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-gray-900">Selectează clasa</option>
                  {CLASE.map(clasa => (
                    <option key={clasa.id} value={clasa.id} className="bg-gray-900">{clasa.name}</option>
                  ))}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Cursuri */}
            <div className="md:col-span-2">
              <label className="block text-white text-sm font-medium mb-3">
                Cursul dorit *
              </label>
              {loadingCursuri ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Opțiunea "Selectăm împreună" */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      formData.cursuriSelectate === 'selectam-impreuna'
                        ? 'bg-amber-500/20 border-amber-500 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-amber-500/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="curs"
                      checked={formData.cursuriSelectate === 'selectam-impreuna'}
                      onChange={() => handleCursChange('selectam-impreuna')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.cursuriSelectate === 'selectam-impreuna'
                        ? 'bg-amber-500 border-amber-500'
                        : 'border-gray-600'
                    }`}>
                      {formData.cursuriSelectate === 'selectam-impreuna' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm font-medium">Selectăm împreună</span>
                  </label>

                  {/* Cursurile din baza de date */}
                  {cursuri.map(curs => (
                    <label
                      key={curs.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        formData.cursuriSelectate === curs.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-emerald-500/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="curs"
                        checked={formData.cursuriSelectate === curs.id}
                        onChange={() => handleCursChange(curs.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.cursuriSelectate === curs.id
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-600'
                      }`}>
                        {formData.cursuriSelectate === curs.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-sm font-medium leading-tight">{curs.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Mesaj */}
            <div className="md:col-span-2">
              <label className="block text-white text-sm font-medium mb-2">
                Mesaj suplimentar (opțional)
              </label>
              <div className="relative">
                <ChatBubbleBottomCenterTextIcon className="absolute left-4 top-4 w-5 h-5 text-emerald-500" />
                <textarea
                  name="mesaj"
                  value={formData.mesaj}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
                  placeholder="Menționați orice informații suplimentare relevante..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting || !formData.cursuriSelectate}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-emerald-500/25 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Se trimite...
                </>
              ) : (
                <>
                  <AcademicCapIcon className="w-5 h-5" />
                  Trimite cererea de înscriere
                </>
              )}
            </button>
          </div>

          <p className="text-gray-500 text-xs text-center mt-4">
            Prin trimiterea formularului, sunteți de acord cu procesarea datelor personale conform{' '}
            <Link href="/gdpr" className="text-emerald-400 hover:underline">GDPR</Link>.
          </p>
        </form>
      </div>
    </div>
  )
}
