'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import TwoFactorModal from './TwoFactorModal'

export default function TeacherForm({ teacher }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [formData, setFormData] = useState({
    name: teacher?.name || '',
    email: teacher?.email || '',
    password: '',
    role: teacher?.role || 'TEACHER',
    active: teacher?.active ?? true,
    twoFactorAllowed: teacher?.twoFactorAllowed ?? false
  })

  // Only SUPERADMIN can create ADMINs
  const canCreateAdmin = session?.user?.role === 'SUPERADMIN' || session?.user?.role === 'ADMIN'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShow2FA(true)
  }

  const executeSubmit = async (actionToken) => {
    setLoading(true)

    try {
      const url = teacher ? `/api/admin/teachers/${teacher.id}` : '/api/admin/teachers'
      const method = teacher ? 'PUT' : 'POST'

      const payload = { ...formData, actionToken }
      if (teacher && !payload.password) {
        delete payload.password
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.status === 403 && data.requires2FA) {
        // User doesn't have 2FA set up - proceed without token
        delete payload.actionToken
        const retryRes = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        if (retryRes.ok) {
          toast.success(teacher ? 'Contul a fost actualizat' : 'Contul a fost creat')
          router.push('/admin/teachers')
          router.refresh()
        } else {
          const retryData = await retryRes.json()
          toast.error(retryData.error || 'A apărut o eroare')
        }
        return
      }

      if (res.ok) {
        toast.success(teacher ? 'Contul a fost actualizat' : 'Contul a fost creat')
        router.push('/admin/teachers')
        router.refresh()
      } else {
        toast.error(data.error || 'A apărut o eroare')
      }
    } catch (error) {
      toast.error('A apărut o eroare')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>

          {/* Role selector - only for SUPERADMIN/ADMIN */}
          {canCreateAdmin && !teacher && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="TEACHER">Profesor</option>
                <option value="ADMIN">Administrator</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {formData.role === 'ADMIN' 
                  ? '⚠️ Administratorul va avea acces complet la panoul de administrare'
                  : 'Profesorul va avea acces doar la portalul de profesor'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={!!teacher}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 text-gray-900"
            />
            {!teacher && (
              <p className="mt-1 text-xs text-green-600 font-medium">
                ✓ Profesorul se va putea conecta cu Google folosind acest email
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {teacher ? 'Parolă nouă (opțional)' : 'Parolă (opțional)'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-700"
              placeholder={teacher ? 'Lasă gol pentru a păstra parola curentă' : 'Opțional - pentru login cu email/parolă'}
            />
            <p className="mt-1 text-xs text-gray-500">
              {teacher 
                ? 'Lasă gol pentru a păstra parola curentă' 
                : 'Dacă nu setezi parolă, profesorul va folosi doar Google pentru autentificare'}
            </p>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Cont activ</span>
            </label>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="twoFactorAllowed"
                checked={formData.twoFactorAllowed}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Permite 2FA</span>
                <p className="text-xs text-gray-500">Utilizatorul va putea activa autentificarea în doi pași</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            Anulează
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg font-medium disabled:opacity-50 ${
              formData.role === 'ADMIN' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Se salvează...' : (teacher ? 'Actualizează' : `Creează ${formData.role === 'ADMIN' ? 'administrator' : 'profesor'}`)}
          </button>
        </div>
      </form>

      <TwoFactorModal
        isOpen={show2FA}
        onClose={() => setShow2FA(false)}
        onVerify={executeSubmit}
        title="Verificare 2FA"
        description={teacher ? 'Confirmă identitatea pentru a actualiza contul.' : `Confirmă identitatea pentru a crea ${formData.role === 'ADMIN' ? 'administratorul' : 'profesorul'}.`}
      />
    </>
  )
}
