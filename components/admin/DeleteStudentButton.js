'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import TwoFactorModal from './TwoFactorModal'

export default function DeleteStudentButton({ id, name, className = '' }) {
  const [loading, setLoading] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Ești sigur că vrei să ștergi elevul "${name}"? Aceasta va șterge și toate înregistrările asociate.`)) return
    setShow2FA(true)
  }

  const executeDelete = async (actionToken) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/students/${id}`, { 
        method: 'DELETE',
        headers: {
          'x-action-token': actionToken || ''
        }
      })
      
      const data = await res.json()
      
      if (res.status === 403 && data.requires2FA) {
        // User doesn't have 2FA - proceed without token
        const retryRes = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' })
        if (retryRes.ok) {
          toast.success('Elevul a fost șters')
          router.refresh()
        } else {
          toast.error('Eroare la ștergerea elevului')
        }
        return
      }
      
      if (res.ok) {
        toast.success('Elevul a fost șters')
        router.refresh()
      } else {
        toast.error(data.error || 'Eroare la ștergerea elevului')
      }
    } catch (error) {
      toast.error('Eroare la ștergerea elevului')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={loading}
        className={className || 'text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50'}
      >
        {loading ? '...' : 'Șterge'}
      </button>
      
      <TwoFactorModal
        isOpen={show2FA}
        onClose={() => setShow2FA(false)}
        onVerify={executeDelete}
        title="Confirmare ștergere"
        description={`Confirmă identitatea pentru a șterge elevul "${name}".`}
      />
    </>
  )
}
