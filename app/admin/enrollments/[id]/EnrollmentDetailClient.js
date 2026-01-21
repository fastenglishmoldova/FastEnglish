'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  CalendarIcon,
  AcademicCapIcon,
  TrashIcon,
  PlusIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { usePermissions } from '@/hooks/usePermissions'

const statusOptions = [
  { value: 'NOU', label: 'Nou', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'CONTACTAT', label: 'Contactat', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'CONFIRMAT', label: 'Confirmat', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'RESPINS', label: 'Respins', color: 'bg-red-100 text-red-800 border-red-300' }
]

export default function EnrollmentDetailClient({ enrollment: initialEnrollment }) {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const canDelete = hasPermission('inscrieri.delete')
  
  const [enrollment, setEnrollment] = useState(initialEnrollment)
  const [enrollmentNotes, setEnrollmentNotes] = useState(initialEnrollment.enrollmentNotes || [])
  const [newNoteText, setNewNoteText] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)

  const updateStatus = async (newStatus) => {
    setSaving(true)
    try {
      const endpoint = enrollment.source === 'formular'
        ? `/api/admin/inscrieri/${enrollment.id}`
        : `/api/admin/enrollments/${enrollment.id}`
      
      const method = enrollment.source === 'formular' ? 'PATCH' : 'PUT'
      const statusForApi = enrollment.source === 'modal'
        ? (newStatus === 'NOU' ? 'NEW' : 
           newStatus === 'CONTACTAT' ? 'CONTACTED' : 
           newStatus === 'CONFIRMAT' ? 'CONFIRMED' : 
           newStatus === 'RESPINS' ? 'REJECTED' : 'NEW')
        : newStatus

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusForApi })
      })

      if (!res.ok) throw new Error('Eroare la actualizare')

      setEnrollment({ ...enrollment, status: newStatus })
      toast.success('Status actualizat!')
    } catch (error) {
      toast.error('Eroare la actualizare')
    } finally {
      setSaving(false)
    }
  }

  const addNote = async () => {
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

      if (!res.ok) throw new Error('Eroare la adăugare')

      const newNote = await res.json()
      setEnrollmentNotes([newNote, ...enrollmentNotes])
      setNewNoteText('')
      toast.success('Notiță adăugată!')
    } catch (error) {
      toast.error('Eroare la adăugare')
    } finally {
      setSavingNote(false)
    }
  }

  const deleteNote = async (noteId) => {
    if (!confirm('Sigur vrei să ștergi această notiță?')) return

    try {
      const res = await fetch(`/api/admin/enrollment-notes/${noteId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Eroare la ștergere')

      setEnrollmentNotes(enrollmentNotes.filter(n => n.id !== noteId))
      toast.success('Notiță ștearsă!')
    } catch (error) {
      toast.error('Eroare la ștergere')
    }
  }

  const handleDeleteEnrollment = () => {
    setShow2FAModal(true)
  }

  const executeDelete = async () => {
    setDeleting(true)
    try {
      const endpoint = enrollment.source === 'formular'
        ? `/api/admin/inscrieri/${enrollment.id}`
        : `/api/admin/enrollments/${enrollment.id}`

      const res = await fetch(endpoint, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Eroare la ștergere')

      toast.success('Înscriere ștearsă!')
      router.push('/admin/enrollments')
    } catch (error) {
      toast.error('Eroare la ștergere')
      setDeleting(false)
    }
  }

  const handle2FAVerify = async (code) => {
    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Cod invalid')
      }

      await executeDelete()
      setShow2FAModal(false)
      return true
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/enrollments"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Înscriere - {enrollment.studentName}</h1>
            <p className="text-sm text-gray-500">Primită pe {new Date(enrollment.createdAt).toLocaleDateString('ro-RO')}</p>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={handleDeleteEnrollment}
            disabled={deleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 xs:gap-6">
        {/* Info principale */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info elev */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AcademicCapIcon className="h-5 w-5 text-[#30919f]" />
              Informații Elev
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nume elev</p>
                <p className="font-medium text-gray-900">{enrollment.studentName}</p>
              </div>
              {enrollment.studentAge && (
                <div>
                  <p className="text-sm text-gray-500">Vârstă</p>
                  <p className="font-medium text-gray-900">{enrollment.studentAge} ani</p>
                </div>
              )}
              {enrollment.clasa && (
                <div>
                  <p className="text-sm text-gray-500">Clasa</p>
                  <p className="font-medium text-gray-900">{enrollment.clasa}</p>
                </div>
              )}
              {enrollment.city && (
                <div>
                  <p className="text-sm text-gray-500">Localitate</p>
                  <p className="font-medium text-gray-900">{enrollment.city}</p>
                </div>
              )}
            </div>
          </div>

          {/* Info părinte */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-[#30919f]" />
              Informații Părinte
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nume</p>
                <p className="font-medium text-gray-900">{enrollment.parentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <a href={`tel:${enrollment.parentPhone}`} className="font-medium text-[#30919f] hover:underline flex items-center gap-1">
                  <PhoneIcon className="h-4 w-4" />
                  {enrollment.parentPhone}
                </a>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${enrollment.parentEmail}`} className="font-medium text-[#30919f] hover:underline flex items-center gap-1">
                  <EnvelopeIcon className="h-4 w-4" />
                  {enrollment.parentEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Cursuri / Curs */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5 text-[#30919f]" />
              {enrollment.source === 'formular' ? 'Cursuri selectate' : 'Curs'}
            </h2>
            {enrollment.source === 'formular' ? (
              <div className="flex flex-wrap gap-2">
                {enrollment.cursuri?.length > 0 ? (
                  enrollment.cursuri.map((curs, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-[#30919f]/10 text-[#30919f] rounded-lg text-sm font-medium">
                      {curs}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Nu sunt cursuri selectate</p>
                )}
              </div>
            ) : (
              <p className="font-medium text-gray-900">{enrollment.course?.title || 'Curs nespecificat'}</p>
            )}
          </div>

          {/* Observații */}
          {enrollment.observations && (
            <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-4">Mesaj / Observații</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{enrollment.observations}</p>
            </div>
          )}

          {/* Acțiuni rapide */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Acțiuni Rapide</h2>
            <div className="flex flex-wrap gap-3">
              <a 
                href={`tel:${enrollment.parentPhone}`}
                className="px-4 py-2 bg-[#30919f] text-white rounded-lg hover:bg-[#247a86] transition-colors"
              >
                Sună
              </a>
              <a 
                href={`mailto:${enrollment.parentEmail}?subject=Înscriere ${enrollment.studentName} - Bravito After School`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Trimite email
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateStatus(option.value)}
                  disabled={saving}
                  className={`w-full px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    enrollment.status === option.value || 
                    (enrollment.status === 'NEW' && option.value === 'NOU') ||
                    (enrollment.status === 'CONTACTED' && option.value === 'CONTACTAT') ||
                    (enrollment.status === 'CONFIRMED' && option.value === 'CONFIRMAT') ||
                    (enrollment.status === 'REJECTED' && option.value === 'RESPINS')
                      ? `${option.color} border-current`
                      : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                  } disabled:opacity-50`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sursă */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-2">Sursă</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              enrollment.source === 'formular' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-teal-100 text-teal-800'
            }`}>
              {enrollment.source === 'formular' ? 'Formular înscriere' : 'Modal curs'}
            </span>
          </div>

          {/* Note interne */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Note interne</h2>
            
            {/* Adaugă notiță nouă */}
            <div className="mb-4">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Adaugă o notiță..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent resize-none text-gray-700"
                rows={3}
              />
              <button
                onClick={addNote}
                disabled={savingNote || !newNoteText.trim()}
                className="mt-2 w-full px-4 py-2 bg-[#30919f] text-white rounded-lg hover:bg-[#247a86] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                {savingNote ? 'Se adaugă...' : 'Adaugă notiță'}
              </button>
            </div>

            {/* Lista de notițe */}
            {enrollmentNotes.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {enrollmentNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap flex-1">{note.content}</p>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        title="Șterge notiță"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(note.createdAt).toLocaleDateString('ro-RO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Nicio notiță încă</p>
            )}
          </div>

          {/* Data */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-2">Data primirii</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {new Date(enrollment.createdAt).toLocaleDateString('ro-RO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <TwoFAModal
          onClose={() => setShow2FAModal(false)}
          onVerify={handle2FAVerify}
          title="Confirmare ștergere"
          description="Introdu codul 2FA pentru a confirma ștergerea înscrierii."
        />
      )}
    </div>
  )
}

function TwoFAModal({ onClose, onVerify, title, description }) {
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setVerifying(true)
    
    try {
      await onVerify(code)
    } catch (err) {
      setError(err.message || 'Cod invalid')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Cod 2FA (6 cifre)"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#30919f] focus:border-transparent"
                autoFocus
                maxLength={6}
              />
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={verifying || code.length !== 6}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {verifying ? 'Se verifică...' : 'Confirmă'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
