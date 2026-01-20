'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'

const allDays = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']

export default function EditGroupDetailsButton({ group, branches }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    scheduleTime: group.scheduleTime || '',
    scheduleDays: group.scheduleDays || [],
    locationDetails: group.locationDetails || '',
    branchId: group.branchId || '',
    locationType: group.locationType || 'physical'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/teacher/groups/${group.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success('Grupa a fost actualizată!')
        setShowModal(false)
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Eroare la actualizare')
      }
    } catch (error) {
      toast.error('Eroare la actualizare')
    } finally {
      setLoading(false)
    }
  }

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      scheduleDays: prev.scheduleDays.includes(day)
        ? prev.scheduleDays.filter(d => d !== day)
        : [...prev.scheduleDays, day]
    }))
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <PencilIcon className="w-4 h-4" />
        <span>Editează detalii</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Editează Detalii Grupă</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Zilele cursului */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zilele cursului *
                </label>
                <div className="flex flex-wrap gap-2">
                  {allDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.scheduleDays.includes(day)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ora cursului */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ora cursului *
                </label>
                <input
                  type="time"
                  value={formData.scheduleTime}
                  onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Format 24h (ex: 16:00)
                </p>
              </div>

              {/* Tip locație */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip locație *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="physical"
                      checked={formData.locationType === 'physical'}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                      className="mr-2"
                    />
                    <span>Fizic</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="online"
                      checked={formData.locationType === 'online'}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                      className="mr-2"
                    />
                    <span>Online</span>
                  </label>
                </div>
              </div>

              {/* Filiala */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filiala
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Fără filială</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>

              {/* Sala/Locația */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sala / Link Zoom / Detalii locație
                </label>
                <textarea
                  value={formData.locationDetails}
                  onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                  rows={3}
                  placeholder="ex: Sala 12, https://zoom.us/j/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.scheduleDays.length === 0 || !formData.scheduleTime}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Se salvează...' : 'Salvează modificările'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
