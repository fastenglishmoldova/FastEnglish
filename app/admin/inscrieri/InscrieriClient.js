'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  AcademicCapIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  PencilIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const statusConfig = {
  NOU: { label: 'Nou', color: 'bg-blue-100 text-blue-800', hoverColor: 'hover:bg-blue-200', icon: ClockIcon },
  CONTACTAT: { label: 'Contactat', color: 'bg-yellow-100 text-yellow-800', hoverColor: 'hover:bg-yellow-200', icon: PhoneIcon },
  CONFIRMAT: { label: 'Confirmat', color: 'bg-green-100 text-green-800', hoverColor: 'hover:bg-green-200', icon: CheckCircleIcon },
  RESPINS: { label: 'Respins', color: 'bg-red-100 text-red-800', hoverColor: 'hover:bg-red-200', icon: XCircleIcon }
}

const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({
  value,
  ...config
}))

export default function InscrieriClient({ initialInscrieri, initialCourses }) {
  const [inscrieri, setInscrieri] = useState(initialInscrieri)
  const [courses] = useState(initialCourses)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingNotes, setEditingNotes] = useState({}) // { inscriereId: noteValue }
  const [savingNotes, setSavingNotes] = useState({})
  const [openStatusDropdown, setOpenStatusDropdown] = useState(null)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenStatusDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get course title by ID or return the original value if it's already a name
  const getCourseTitle = (cursId) => {
    const course = courses.find(c => c.id === cursId)
    return course ? course.title : cursId
  }

  const stats = {
    total: inscrieri.length,
    noi: inscrieri.filter(i => i.status === 'NOU').length,
    contactati: inscrieri.filter(i => i.status === 'CONTACTAT').length,
    confirmati: inscrieri.filter(i => i.status === 'CONFIRMAT').length
  }

  const updateStatus = async (inscriereId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/inscrieri/${inscriereId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) throw new Error('Eroare la actualizare')

      setInscrieri(prev => prev.map(i => 
        i.id === inscriereId ? { ...i, status: newStatus } : i
      ))
      setOpenStatusDropdown(null)
      toast.success('Status actualizat!')
    } catch (error) {
      toast.error('Eroare la actualizare')
    }
  }

  const handleNotesChange = (inscriereId, value) => {
    setEditingNotes(prev => ({ ...prev, [inscriereId]: value }))
  }

  const saveNotes = async (inscriereId) => {
    const notes = editingNotes[inscriereId]
    if (notes === undefined) return

    setSavingNotes(prev => ({ ...prev, [inscriereId]: true }))
    try {
      const res = await fetch(`/api/admin/inscrieri/${inscriereId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      })

      if (!res.ok) throw new Error('Eroare la salvare')

      setInscrieri(prev => prev.map(i => 
        i.id === inscriereId ? { ...i, notes } : i
      ))
      toast.success('Notă salvată!')
    } catch (error) {
      toast.error('Eroare la salvare')
    } finally {
      setSavingNotes(prev => ({ ...prev, [inscriereId]: false }))
    }
  }

  const handleAddInscriere = async (data) => {
    try {
      const res = await fetch('/api/admin/inscrieri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Eroare la adăugare')
      }

      const newInscriere = await res.json()
      setInscrieri(prev => [newInscriere, ...prev])
      setShowAddModal(false)
      toast.success('Înscriere adăugată!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Înscrieri Formular</h1>
          <p className="text-sm xs:text-base text-gray-600">Înscrierile primite din formularul de pe /inscriere</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#30919f] text-white rounded-lg hover:bg-[#247a86] transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Adaugă înscriere
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Total</p>
          <p className="text-xl xs:text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Noi</p>
          <p className="text-xl xs:text-2xl font-bold text-blue-600">{stats.noi}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Contactați</p>
          <p className="text-xl xs:text-2xl font-bold text-yellow-600">{stats.contactati}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Confirmați</p>
          <p className="text-xl xs:text-2xl font-bold text-green-600">{stats.confirmati}</p>
        </div>
      </div>

      {/* Lista înscrieri */}
      {inscrieri.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nu există înscrieri încă</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inscrieri.map((inscriere) => {
            const status = statusConfig[inscriere.status] || statusConfig.NOU
            const StatusIcon = status.icon
            const currentNotes = editingNotes[inscriere.id] !== undefined 
              ? editingNotes[inscriere.id] 
              : (inscriere.notes || '')
            
            return (
              <div
                key={inscriere.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all"
              >
                <div className="flex flex-col gap-3">
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{inscriere.numeCopil}</h3>
                        
                        {/* Status dropdown */}
                        <div className="relative" ref={openStatusDropdown === inscriere.id ? dropdownRef : null}>
                          <button
                            onClick={() => setOpenStatusDropdown(openStatusDropdown === inscriere.id ? null : inscriere.id)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color} ${status.hoverColor} transition-colors cursor-pointer`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                            <ChevronDownIcon className="h-3 w-3" />
                          </button>
                          
                          {openStatusDropdown === inscriere.id && (
                            <div className="absolute z-20 mt-1 left-0 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                              {statusOptions.map((option) => {
                                const OptionIcon = option.icon
                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => updateStatus(inscriere.id, option.value)}
                                    className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 ${
                                      inscriere.status === option.value ? 'bg-gray-50 font-medium' : ''
                                    }`}
                                  >
                                    <OptionIcon className="h-4 w-4" />
                                    {option.label}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          {inscriere.numeParinte}
                        </span>
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="h-4 w-4" />
                          <a href={`tel:${inscriere.telefon}`} className="hover:text-[#30919f]">{inscriere.telefon}</a>
                        </span>
                        <span className="flex items-center gap-1">
                          <EnvelopeIcon className="h-4 w-4" />
                          <a href={`mailto:${inscriere.email}`} className="hover:text-[#30919f]">{inscriere.email}</a>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Clasa: {inscriere.clasa}
                        </span>
                        {inscriere.cursuri?.map((curs, idx) => (
                          <span key={idx} className="text-xs bg-[#30919f]/10 text-[#30919f] px-2 py-1 rounded">
                            {getCourseTitle(curs)}
                          </span>
                        ))}
                      </div>

                      {inscriere.mesaj && (
                        <p className="mt-2 text-sm text-gray-500 flex items-start gap-1">
                          <ChatBubbleLeftIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{inscriere.mesaj}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right text-xs text-gray-400">
                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                        {new Date(inscriere.createdAt).toLocaleDateString('ro-RO', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <Link
                        href={`/admin/inscrieri/${inscriere.id}`}
                        className="p-2 text-gray-400 hover:text-[#30919f] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editează"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Notes section - always visible */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex gap-2">
                      <textarea
                        value={currentNotes}
                        onChange={(e) => handleNotesChange(inscriere.id, e.target.value)}
                        onBlur={() => {
                          if (editingNotes[inscriere.id] !== undefined && editingNotes[inscriere.id] !== (inscriere.notes || '')) {
                            saveNotes(inscriere.id)
                          }
                        }}
                        placeholder="Adaugă notițe..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent resize-none bg-gray-50 focus:bg-white transition-colors"
                        rows={2}
                      />
                      {editingNotes[inscriere.id] !== undefined && editingNotes[inscriere.id] !== (inscriere.notes || '') && (
                        <button
                          onClick={() => saveNotes(inscriere.id)}
                          disabled={savingNotes[inscriere.id]}
                          className="px-3 py-2 text-sm bg-[#30919f] text-white rounded-lg hover:bg-[#247a86] transition-colors disabled:opacity-50 self-end"
                        >
                          {savingNotes[inscriere.id] ? '...' : 'Salvează'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddInscriereModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={handleAddInscriere}
          courses={courses}
        />
      )}
    </div>
  )
}

function AddInscriereModal({ onClose, onAdd, courses }) {
  const [formData, setFormData] = useState({
    numeCopil: '',
    numeParinte: '',
    email: '',
    telefon: '',
    clasa: '',
    cursuri: [],
    mesaj: '',
    status: 'NOU',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await onAdd(formData)
    setSubmitting(false)
  }

  const toggleCurs = (cursTitle) => {
    setFormData(prev => ({
      ...prev,
      cursuri: prev.cursuri.includes(cursTitle)
        ? prev.cursuri.filter(c => c !== cursTitle)
        : [...prev.cursuri, cursTitle]
    }))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-lg font-semibold text-gray-900">Adaugă înscriere manuală</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nume copil *</label>
                <input
                  type="text"
                  required
                  value={formData.numeCopil}
                  onChange={(e) => setFormData({ ...formData, numeCopil: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clasă *</label>
                <input
                  type="text"
                  required
                  value={formData.clasa}
                  onChange={(e) => setFormData({ ...formData, clasa: e.target.value })}
                  placeholder="ex: Clasa 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nume părinte *</label>
                <input
                  type="text"
                  required
                  value={formData.numeParinte}
                  onChange={(e) => setFormData({ ...formData, numeParinte: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                <input
                  type="tel"
                  required
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
              />
            </div>

            {/* Cursuri selection */}
            {courses.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cursuri</label>
                <div className="flex flex-wrap gap-2">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => toggleCurs(course.title)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.cursuri.includes(course.title)
                          ? 'bg-[#30919f] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {course.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
              <textarea
                value={formData.mesaj}
                onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notițe interne</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                placeholder="Notițe vizibile doar pentru admin..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-[#30919f] text-white rounded-lg hover:bg-[#247a86] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Se adaugă...' : 'Adaugă înscriere'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
