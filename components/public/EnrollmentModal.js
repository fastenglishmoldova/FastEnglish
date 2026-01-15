'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline'

export default function EnrollmentModal({ isOpen, onClose, course }) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentAge: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    city: '',
    observations: ''
  })
  const [loading, setLoading] = useState(false)

  if (!isOpen || !course) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/public/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          courseId: course.id,
          studentAge: formData.studentAge ? parseInt(formData.studentAge) : null
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Înscrierea a fost trimisă cu succes! Vă vom contacta în curând.')
        setFormData({
          studentName: '',
          studentAge: '',
          parentName: '',
          parentPhone: '',
          parentEmail: '',
          city: '',
          observations: ''
        })
        onClose()
      } else {
        toast.error(data.error || 'A apărut o eroare. Vă rugăm încercați din nou.')
      }
    } catch (error) {
      toast.error('A apărut o eroare. Vă rugăm încercați din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
      <div 
        className="bg-[#15292e] rounded-xl xs:rounded-2xl shadow-2xl w-full max-w-lg mx-3 xs:mx-4 max-h-[90vh] overflow-y-auto border border-[#1e3d44]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#15292e] border-b border-[#1e3d44] px-4 xs:px-6 py-3 xs:py-4 flex items-center justify-between rounded-t-xl xs:rounded-t-2xl">
          <h2 className="text-lg xs:text-xl font-bold text-white">Înscriere la curs</h2>
          <button 
            onClick={onClose}
            className="cursor-pointer p-1.5 xs:p-2 hover:bg-[#1e3d44] rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
          </button>
        </div>

        {/* Course Info */}
        <div className="px-4 xs:px-6 py-3 xs:py-4 bg-[#136976]/20 border-b border-[#1e3d44]">
          <div className="flex items-center gap-2 xs:gap-3">
            <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-to-br from-[#30919f] to-[#136976] rounded-lg xs:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <BookOpenIcon className="w-5 h-5 xs:w-6 xs:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm xs:text-base text-white leading-tight">{course.title}</h3>
              <p className="text-xs xs:text-sm text-gray-400"><span className="text-[#f8b316] font-medium">{course.price} MDL</span> • {course.lessonsCount} lecții</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 xs:p-6 space-y-3 xs:space-y-4">
          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              Nume elev *
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base bg-[#0c1a1d] border border-[#1e3d44] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f] transition-all"
              placeholder="Numele complet al copilului"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              Vârsta elev
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="studentAge"
              value={formData.studentAge}
              onChange={handleChange}
              className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base bg-[#0c1a1d] border border-[#1e3d44] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f] transition-all"
              placeholder="Vârsta în ani"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              Nume părinte *
            </label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
              className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base bg-[#0c1a1d] border border-[#1e3d44] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f] transition-all"
              placeholder="Numele părintelui/tutorelui"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              Telefon *
            </label>
            <input
              type="tel"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              required
              className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base bg-[#0c1a1d] border border-[#1e3d44] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f] transition-all"
              placeholder="06XX XXX XX"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              required
              className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base bg-[#0c1a1d] border border-[#1e3d44] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f] transition-all"
              placeholder="email@exemplu.com"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              Oraș
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base bg-[#0c1a1d] border border-[#1e3d44] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f] transition-all"
              placeholder="Orașul de reședință"
            />
          </div>

          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1">
              Observații
            </label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base bg-[#0c1a1d] border border-[#1e3d44] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f] transition-all"
              placeholder="Alte informații relevante..."
            />
          </div>

          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 pt-2 xs:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer w-full xs:flex-1 px-3 xs:px-4 py-2.5 xs:py-3 border border-[#1e3d44] text-gray-300 rounded-lg text-sm xs:text-base font-medium hover:bg-[#1e3d44] transition-colors order-2 xs:order-1"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full xs:flex-1 px-3 xs:px-4 py-2.5 xs:py-3 bg-gradient-to-r from-[#f8b316] to-[#e5a30e] text-[#231f20] rounded-lg text-sm xs:text-base font-bold hover:from-[#e5a30e] hover:to-[#d4940d] transition-all shadow-lg hover:shadow-[#f8b316]/25 disabled:opacity-50 disabled:cursor-not-allowed order-1 xs:order-2"
            >
              {loading ? 'Se trimite...' : 'Trimite înscrierea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
