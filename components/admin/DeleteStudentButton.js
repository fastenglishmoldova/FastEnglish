'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DeleteStudentButton({ id, name, className = '' }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Ești sigur că vrei să ștergi elevul "${name}"? Aceasta va șterge și toate înregistrările asociate.`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Elevul a fost șters')
        router.refresh()
      } else {
        toast.error('Eroare la ștergerea elevului')
      }
    } catch (error) {
      toast.error('Eroare la ștergerea elevului')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={className || 'text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50'}
    >
      {loading ? '...' : 'Șterge'}
    </button>
  )
}
