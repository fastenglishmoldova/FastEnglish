'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DeleteTeacherButton({ id, name, className = '' }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Ești sigur că vrei să ștergi profesorul "${name}"? Aceasta va șterge și toate datele asociate.`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/teachers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Profesorul a fost șters')
        router.refresh()
      } else {
        toast.error('Eroare la ștergerea profesorului')
      }
    } catch (error) {
      toast.error('Eroare la ștergerea profesorului')
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
