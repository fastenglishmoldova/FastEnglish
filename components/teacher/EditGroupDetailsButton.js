'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PencilIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline'

const allDays = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']

export default function EditGroupDetailsButton({ group, branches }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [schedulePreview, setSchedulePreview] = useState([])
  const [loadingSchedule, setLoadingSchedule] = useState(false)
  const [formData, setFormData] = useState({
    scheduleTime: group.scheduleTime || '',
    scheduleDays: group.scheduleDays || [],
    locationDetails: group.locationDetails || '',
    branchId: group.branchId || '',
    locationType: group.locationType || 'physical'
  })

  // Fetch schedule preview when branch or days change
  useEffect(() => {
    if (!showModal || !formData.branchId || formData.scheduleDays.length === 0) {
      setSchedulePreview([])
      return
    }

    const fetchSchedule = async () => {
      setLoadingSchedule(true)
      try {
        const res = await fetch('/api/teacher/schedule')
        if (res.ok) {
          const data = await res.json()
          
          // Filter groups by selected branch and days
          const filtered = data.groups.filter(g => {
            if (g.id === group.id) return false // Exclude current group
            if (g.branchId !== formData.branchId) return false
            
            // Check if any selected day overlaps
            const hasOverlap = formData.scheduleDays.some(day => 
              g.scheduleDays?.includes(day)
            )
            return hasOverlap
          }).map(g => ({
            name: g.name,
            teacher: data.teachers.find(t => t.id === g.teacherId)?.fullName || 'Necunoscut',
            days: g.scheduleDays,
            time: g.scheduleTime,
            studentCount: g._count?.groupStudents || 0
          }))

          setSchedulePreview(filtered)
        }
      } catch (error) {
        console.error('Failed to fetch schedule:', error)
      } finally {
        setLoadingSchedule(false)
      }
    }

    fetchSchedule()
  }, [formData.branchId, formData.scheduleDays, showModal, group.id])

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

              {/* Schedule Preview */}
              {formData.branchId && formData.scheduleDays.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">
                      Orar {branches.find(b => b.id === formData.branchId)?.name} - {formData.scheduleDays.join(', ')}
                    </h3>
                  </div>
                  
                  {loadingSchedule ? (
                    <p className="text-sm text-blue-600">Se încarcă orarul...</p>
                  ) : schedulePreview.length === 0 ? (
                    <p className="text-sm text-green-700">✓ Nu există alte grupe în aceste zile</p>
                  ) : (
                    <div className="space-y-2">
                      {schedulePreview.map((item, idx) => (
                        <div key={idx} className="bg-white rounded p-3 text-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <p className="text-gray-600 text-xs">👨‍🏫 {item.teacher} • {item.studentCount} elevi</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-blue-600">{item.time}</p>
                              <p className="text-xs text-gray-500">{item.days.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
