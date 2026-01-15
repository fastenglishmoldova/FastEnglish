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
  ChatBubbleLeftIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const statusOptions = [
  { value: 'NOU', label: 'Nou', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'CITIT', label: 'Citit', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'RASPUNS', label: 'Răspuns', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'ARHIVAT', label: 'Arhivat', color: 'bg-gray-100 text-gray-800 border-gray-300' }
]

export default function ContactMessageDetailClient({ message: initialMessage }) {
  const router = useRouter()
  const [message, setMessage] = useState(initialMessage)
  const [notes, setNotes] = useState(initialMessage.notes || '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const updateStatus = async (newStatus) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/contact/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) throw new Error('Eroare la actualizare')

      setMessage({ ...message, status: newStatus })
      toast.success('Status actualizat!')
    } catch (error) {
      toast.error('Eroare la actualizare')
    } finally {
      setSaving(false)
    }
  }

  const saveNotes = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/contact/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      })

      if (!res.ok) throw new Error('Eroare la salvare')

      toast.success('Note salvate!')
    } catch (error) {
      toast.error('Eroare la salvare')
    } finally {
      setSaving(false)
    }
  }

  const deleteMessage = async () => {
    if (!confirm('Sigur vrei să ștergi acest mesaj?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/contact/${message.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Eroare la ștergere')

      toast.success('Mesaj șters!')
      router.push('/admin/contact')
    } catch (error) {
      toast.error('Eroare la ștergere')
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/contact"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Mesaj de la {message.name}</h1>
            <p className="text-sm text-gray-500">Primit pe {new Date(message.createdAt).toLocaleDateString('ro-RO')}</p>
          </div>
        </div>

        <button
          onClick={deleteMessage}
          disabled={deleting}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 xs:gap-6">
        {/* Info principale */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact info */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-[#30919f]" />
              Informații Contact
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nume</p>
                <p className="font-medium text-gray-900">{message.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${message.email}`} className="font-medium text-[#30919f] hover:underline flex items-center gap-1">
                  <EnvelopeIcon className="h-4 w-4" />
                  {message.email}
                </a>
              </div>
              {message.phone && (
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <a href={`tel:${message.phone}`} className="font-medium text-[#30919f] hover:underline flex items-center gap-1">
                    <PhoneIcon className="h-4 w-4" />
                    {message.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mesajul */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChatBubbleLeftIcon className="h-5 w-5 text-[#30919f]" />
              Mesaj
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
          </div>

          {/* Acțiuni rapide */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Acțiuni Rapide</h2>
            <div className="flex flex-wrap gap-3">
              <a 
                href={`mailto:${message.email}?subject=Re: Mesajul tău pe Bravito After School`}
                className="px-4 py-2 bg-[#30919f] text-white rounded-lg hover:bg-[#247a86] transition-colors"
              >
                Răspunde prin Email
              </a>
              {message.phone && (
                <a 
                  href={`tel:${message.phone}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Sună
                </a>
              )}
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
                    message.status === option.value
                      ? `${option.color} border-current`
                      : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                  } disabled:opacity-50`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Note interne</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adaugă note despre acest mesaj..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30919f] focus:border-transparent resize-none"
              rows={4}
            />
            <button
              onClick={saveNotes}
              disabled={saving}
              className="mt-3 w-full px-4 py-2 bg-[#30919f] text-white rounded-lg hover:bg-[#247a86] transition-colors disabled:opacity-50"
            >
              {saving ? 'Se salvează...' : 'Salvează note'}
            </button>
          </div>

          {/* Data */}
          <div className="bg-white rounded-xl p-4 xs:p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-2">Data primirii</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {new Date(message.createdAt).toLocaleDateString('ro-RO', {
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
    </div>
  )
}
