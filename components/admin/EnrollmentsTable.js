'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { 
  PlusIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  TrashIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { usePermissions } from '@/hooks/usePermissions'

const statusColors = {
  NEW: 'bg-yellow-100 text-yellow-800',
  CONTACTED: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800'
}

const statusLabels = {
  NEW: 'Nou',
  CONTACTED: 'Contactat',
  CONFIRMED: 'Confirmat',
  REJECTED: 'Respins'
}

const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({
  value,
  label,
  color: statusColors[value]
}))

export default function EnrollmentsTable({ enrollments: initialEnrollments, courses = [] }) {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const canEdit = hasPermission('inscrieri.edit')
  const canDelete = hasPermission('inscrieri.delete')
  
  const [enrollments, setEnrollments] = useState(initialEnrollments)
  const [search, setSearch] = useState('')
  const [openStatusDropdown, setOpenStatusDropdown] = useState(null)
  const [openNotesPanel, setOpenNotesPanel] = useState(null)
  const [newNoteText, setNewNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const dropdownRef = useRef(null)
  const notesPanelRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenStatusDropdown(null)
      }
      if (notesPanelRef.current && !notesPanelRef.current.contains(event.target)) {
        // Don't close if clicking on the notes button or inside the panel
        if (!event.target.closest('[data-notes-button]') && !event.target.closest('[data-notes-panel]')) {
          setOpenNotesPanel(null)
          setNewNoteText('')
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredEnrollments = enrollments.filter(e => 
    e.studentName.toLowerCase().includes(search.toLowerCase()) ||
    e.parentName.toLowerCase().includes(search.toLowerCase()) ||
    e.parentEmail.toLowerCase().includes(search.toLowerCase()) ||
    e.parentPhone.includes(search)
  )

  // Quick status update
  const updateStatusQuick = async (enrollment, newStatus) => {
    try {
      const endpoint = enrollment.source === 'formular' 
        ? `/api/admin/inscrieri/${enrollment.id}`
        : `/api/admin/enrollments/${enrollment.id}`
      
      const statusForApi = enrollment.source === 'formular'
        ? (newStatus === 'NEW' ? 'NOU' : 
           newStatus === 'CONTACTED' ? 'CONTACTAT' : 
           newStatus === 'CONFIRMED' ? 'CONFIRMAT' : 
           newStatus === 'REJECTED' ? 'RESPINS' : 'NOU')
        : newStatus

      const res = await fetch(endpoint, {
        method: enrollment.source === 'formular' ? 'PATCH' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusForApi })
      })

      if (res.ok) {
        toast.success('Status actualizat!')
        setEnrollments(prev => prev.map(e => 
          e.id === enrollment.id ? { ...e, status: newStatus } : e
        ))
        setOpenStatusDropdown(null)
      } else {
        toast.error('Eroare la actualizare')
      }
    } catch (error) {
      toast.error('Eroare la actualizare')
    }
  }

  // Add new note
  const addNote = async (enrollment) => {
    if (!newNoteText.trim()) return
    
    setSavingNote(true)
    try {
      const res = await fetch('/api/admin/enrollment-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: enrollment.source === 'modal' ? enrollment.id : undefined,
          inscriereId: enrollment.source === 'formular' ? enrollment.id : undefined,
          content: newNoteText.trim()
        })
      })

      if (res.ok) {
        const newNote = await res.json()
        toast.success('Notiță adăugată!')
        
        // Update local state
        setEnrollments(prev => prev.map(e => {
          if (e.id === enrollment.id) {
            return {
              ...e,
              enrollmentNotes: [newNote, ...(e.enrollmentNotes || [])]
            }
          }
          return e
        }))
        setNewNoteText('')
      } else {
        const err = await res.json()
        toast.error(err.error || 'Eroare la adăugare')
      }
    } catch (error) {
      toast.error('Eroare la adăugare')
    } finally {
      setSavingNote(false)
    }
  }

  // Delete note
  const deleteNote = async (enrollment, noteId) => {
    if (!confirm('Sigur vrei să ștergi această notiță?')) return
    
    try {
      const res = await fetch(`/api/admin/enrollment-notes/${noteId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('Notiță ștearsă!')
        
        // Update local state
        setEnrollments(prev => prev.map(e => {
          if (e.id === enrollment.id) {
            return {
              ...e,
              enrollmentNotes: (e.enrollmentNotes || []).filter(n => n.id !== noteId)
            }
          }
          return e
        }))
      } else {
        const err = await res.json()
        toast.error(err.error || 'Eroare la ștergere')
      }
    } catch (error) {
      toast.error('Eroare la ștergere')
    }
  }

  // Add new enrollment
  const handleAddEnrollment = async (data) => {
    try {
      const res = await fetch('/api/admin/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Eroare la adăugare')
      }

      const newInscriere = await res.json()
      
      // Transform to enrollment format
      const newEnrollment = {
        id: newInscriere.id,
        studentName: newInscriere.numeCopil,
        studentAge: null,
        parentName: newInscriere.numeParinte,
        parentPhone: newInscriere.telefon,
        parentEmail: newInscriere.email,
        city: null,
        observations: newInscriere.mesaj,
        status: newInscriere.status === 'NOU' ? 'NEW' : 
                newInscriere.status === 'CONTACTAT' ? 'CONTACTED' : 
                newInscriere.status === 'CONFIRMAT' ? 'CONFIRMED' : 
                newInscriere.status === 'REJECTED' ? 'REJECTED' : 'NEW',
        notes: newInscriere.notes,
        enrollmentNotes: [],
        createdAt: newInscriere.createdAt,
        updatedAt: newInscriere.updatedAt,
        course: null,
        source: 'formular',
        clasa: newInscriere.clasa,
        cursuri: newInscriere.cursuri
      }

      setEnrollments(prev => [newEnrollment, ...prev])
      setShowAddModal(false)
      toast.success('Înscriere adăugată!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Notes panel component
  const NotesPanel = ({ enrollment }) => {
    const notes = enrollment.enrollmentNotes || []
    
    return (
      <div 
        ref={notesPanelRef}
        data-notes-panel
        onClick={(e) => e.stopPropagation()}
        className="absolute z-30 bottom-full mb-1 right-0 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
      >
        <div className="p-3 border-b border-gray-100 bg-gray-50">
          <h4 className="font-semibold text-sm text-gray-900">Notițe ({notes.length})</h4>
        </div>
        
        {/* Add new note */}
        {canEdit && (
          <div className="p-3 border-b border-gray-100">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Adaugă o notiță..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#30919f] focus:border-transparent resize-none"
              rows={2}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => addNote(enrollment)}
                disabled={savingNote || !newNoteText.trim()}
                className="flex-1 px-3 py-1.5 bg-[#30919f] text-white rounded-lg text-xs font-medium hover:bg-[#247a86] transition-colors disabled:opacity-50"
              >
                {savingNote ? 'Se salvează...' : 'Salvează'}
              </button>
              <button
                onClick={() => {
                  setNewNoteText('')
                  setOpenNotesPanel(null)
                }}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                Anulează
              </button>
            </div>
          </div>
        )}
        
        {/* Notes list */}
        <div className="max-h-60 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Nu există notițe
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-700 flex-1">{note.content}</p>
                  {canDelete && (
                    <button
                      onClick={() => deleteNote(enrollment, note.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      title="Șterge notiță"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(note.createdAt).toLocaleDateString('ro-RO', { 
                    day: 'numeric', 
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search and Add button */}
      <div className="p-3 xs:p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Caută..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 xs:px-4 py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400"
        />
        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#30919f] text-white rounded-lg hover:bg-[#247a86] transition-colors text-sm font-medium whitespace-nowrap"
          >
            <PlusIcon className="h-5 w-5" />
            Adaugă înscriere
          </button>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sursă</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Curs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Elev</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Părinte</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Notițe</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  Nu există înscrieri
                </td>
              </tr>
            ) : (
              filteredEnrollments.map((enrollment) => {
                const notesCount = (enrollment.enrollmentNotes || []).length
                
                return (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(enrollment.createdAt).toLocaleDateString('ro-RO')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        enrollment.source === 'formular' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {enrollment.source === 'formular' ? 'Formular' : 'Modal'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {enrollment.source === 'formular' ? (
                        <div className="flex flex-wrap gap-1">
                          {enrollment.cursuri?.map((curs, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                              {curs}
                            </span>
                          ))}
                          {enrollment.clasa && (
                            <span className="text-xs text-gray-500">Clasa {enrollment.clasa}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {enrollment.course?.title || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{enrollment.studentName}</p>
                        {enrollment.studentAge && (
                          <p className="text-xs text-gray-500">{enrollment.studentAge} ani</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{enrollment.parentName}</td>
                    <td className="px-6 py-4">
                      <div>
                        <a href={`tel:${enrollment.parentPhone}`} className="text-sm text-gray-900 hover:text-[#30919f]">{enrollment.parentPhone}</a>
                        <a href={`mailto:${enrollment.parentEmail}`} className="text-xs text-gray-500 block hover:text-[#30919f]">{enrollment.parentEmail}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* Status dropdown - clickable only if can edit */}
                      {canEdit ? (
                        <div className="relative" ref={openStatusDropdown === enrollment.id ? dropdownRef : null}>
                          <button
                            onClick={() => setOpenStatusDropdown(openStatusDropdown === enrollment.id ? null : enrollment.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${statusColors[enrollment.status]}`}
                          >
                            {statusLabels[enrollment.status]}
                            <ChevronDownIcon className="h-3 w-3" />
                          </button>
                          
                          {openStatusDropdown === enrollment.id && (
                            <div className="absolute z-20 bottom-full mb-1 left-0 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                              {statusOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => updateStatusQuick(enrollment, option.value)}
                                  className={`w-full px-3 py-2 text-left text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50 ${
                                    enrollment.status === option.value ? 'bg-gray-50 font-medium' : ''
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`}></span>
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[enrollment.status]}`}>
                          {statusLabels[enrollment.status]}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          data-notes-button
                          onClick={() => setOpenNotesPanel(openNotesPanel === enrollment.id ? null : enrollment.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                            notesCount > 0 
                              ? 'bg-[#30919f]/10 text-[#30919f] hover:bg-[#30919f]/20' 
                              : 'text-gray-500 hover:bg-gray-100'
                          }`}
                          title={`${notesCount} notițe`}
                        >
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                          {notesCount > 0 && (
                            <span className="font-medium">{notesCount}</span>
                          )}
                        </button>
                        
                        {openNotesPanel === enrollment.id && (
                          <NotesPanel enrollment={enrollment} />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {filteredEnrollments.length === 0 ? (
          <div className="px-3 xs:px-4 py-8 xs:py-12 text-center text-sm xs:text-base text-gray-500">
            Nu există înscrieri
          </div>
        ) : (
          filteredEnrollments.map((enrollment) => {
            const notesCount = (enrollment.enrollmentNotes || []).length

            return (
              <div key={enrollment.id} className="p-3 xs:p-4 hover:bg-gray-50">
                <div className="space-y-2 xs:space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm xs:text-base text-gray-900 leading-tight">{enrollment.studentName}</h3>
                      {enrollment.source === 'formular' ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {enrollment.cursuri?.map((curs, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                              {curs}
                            </span>
                          ))}
                          {enrollment.clasa && (
                            <span className="text-xs text-gray-500">Clasa {enrollment.clasa}</span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs xs:text-sm text-gray-500">{enrollment.course?.title || '-'}</p>
                      )}
                    </div>
                    
                    {/* Status dropdown for mobile - only if can edit */}
                    {canEdit ? (
                      <div className="relative" ref={openStatusDropdown === enrollment.id ? dropdownRef : null}>
                        <button
                          onClick={() => setOpenStatusDropdown(openStatusDropdown === enrollment.id ? null : enrollment.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-medium whitespace-nowrap flex-shrink-0 ${statusColors[enrollment.status]}`}
                        >
                          {statusLabels[enrollment.status]}
                          <ChevronDownIcon className="h-3 w-3" />
                        </button>
                        
                        {openStatusDropdown === enrollment.id && (
                          <div className="absolute z-20 bottom-full mb-1 right-0 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                            {statusOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => updateStatusQuick(enrollment, option.value)}
                                className={`w-full px-3 py-2 text-left text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50 ${
                                  enrollment.status === option.value ? 'bg-gray-50 font-medium' : ''
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`}></span>
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-medium whitespace-nowrap flex-shrink-0 ${statusColors[enrollment.status]}`}>
                        {statusLabels[enrollment.status]}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs xs:text-sm">
                    <div>
                      <span className="text-gray-500 block mb-0.5">Părinte</span>
                      <span className="text-gray-900 font-medium">{enrollment.parentName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-0.5">Vârstă</span>
                      <span className="text-gray-900 font-medium">{enrollment.studentAge ? `${enrollment.studentAge} ani` : '-'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block mb-0.5">Contact</span>
                      <div className="space-y-0.5">
                        <a href={`tel:${enrollment.parentPhone}`} className="text-gray-900 font-medium block hover:text-[#30919f]">{enrollment.parentPhone}</a>
                        <a href={`mailto:${enrollment.parentEmail}`} className="text-gray-500 text-xs break-all hover:text-[#30919f]">{enrollment.parentEmail}</a>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block mb-0.5">Data</span>
                      <span className="text-gray-900">{new Date(enrollment.createdAt).toLocaleDateString('ro-RO')}</span>
                    </div>
                  </div>

                  {/* Notes button for mobile */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="relative">
                      <button
                        data-notes-button
                        onClick={() => setOpenNotesPanel(openNotesPanel === enrollment.id ? null : enrollment.id)}
                        className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          notesCount > 0 
                            ? 'bg-[#30919f]/10 text-[#30919f] hover:bg-[#30919f]/20' 
                            : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                        Notițe {notesCount > 0 && `(${notesCount})`}
                      </button>
                      
                      {openNotesPanel === enrollment.id && (
                        <NotesPanel enrollment={enrollment} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddEnrollmentModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={handleAddEnrollment}
          courses={courses}
        />
      )}
    </div>
  )
}

function AddEnrollmentModal({ onClose, onAdd, courses }) {
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                <input
                  type="tel"
                  required
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
              >
                <option value="NOU">Nou</option>
                <option value="CONTACTAT">Contactat</option>
                <option value="CONFIRMAT">Confirmat</option>
                <option value="RESPINS">Respins</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
              <textarea
                value={formData.mesaj}
                onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#30919f] focus:border-transparent resize-none"
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
