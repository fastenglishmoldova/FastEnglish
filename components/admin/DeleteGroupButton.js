'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DeleteGroupButton({ id, name }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Ești sigur că vrei să ștergi grupa "${name}"? Aceasta va șterge și toate înregistrările asociate.`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/groups/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Grupa a fost ștearsă')
        router.refresh()
      } else {
        toast.error('Eroare la ștergerea grupei')
      }
    } catch (error) {
      toast.error('Eroare la ștergerea grupei')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 text-xs xs:text-sm font-medium disabled:opacity-50"
    >
      {loading ? '...' : 'Șterge'}
    </button>
  )
}
