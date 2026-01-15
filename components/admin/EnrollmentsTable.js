'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

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

export default function EnrollmentsTable({ enrollments: initialEnrollments }) {
  const router = useRouter()
  const [enrollments, setEnrollments] = useState(initialEnrollments)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const filteredEnrollments = enrollments.filter(e => 
    e.studentName.toLowerCase().includes(search.toLowerCase()) ||
    e.parentName.toLowerCase().includes(search.toLowerCase()) ||
    e.parentEmail.toLowerCase().includes(search.toLowerCase()) ||
    e.parentPhone.includes(search)
  )

  const handleEdit = (enrollment) => {
    setEditingId(enrollment.id)
    setEditData({ status: enrollment.status, notes: enrollment.notes || '' })
  }

  const handleSave = async (id) => {
    try {
      const res = await fetch(`/api/admin/enrollments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      if (res.ok) {
        toast.success('Înscrierea a fost actualizată')
        setEnrollments(prev => prev.map(e => 
          e.id === id ? { ...e, ...editData } : e
        ))
        setEditingId(null)
        router.refresh()
      } else {
        toast.error('Eroare la actualizare')
      }
    } catch (error) {
      toast.error('Eroare la actualizare')
    }
  }

  return (
    <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search */}
      <div className="p-3 xs:p-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Caută..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-3 xs:px-4 py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-700"
        />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  Nu există înscrieri
                </td>
              </tr>
            ) : (
              filteredEnrollments.map((enrollment) => (
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
                      <p className="text-sm text-gray-900">{enrollment.parentPhone}</p>
                      <p className="text-xs text-gray-500">{enrollment.parentEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === enrollment.id ? (
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                        className="text-sm border border-gray-300 rounded px-2 py-1 text-gray-900"
                      >
                        {Object.keys(statusLabels).map(status => (
                          <option key={status} value={status}>{statusLabels[status]}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[enrollment.status]}`}>
                        {statusLabels[enrollment.status]}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === enrollment.id ? (
                      <input
                        type="text"
                        value={editData.notes}
                        onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                        className="text-sm border border-gray-300 rounded px-2 py-1 w-32 text-gray-900 placeholder-gray-700"
                        placeholder="Note..."
                      />
                    ) : (
                      <span className="text-sm text-gray-500 truncate block max-w-[120px]">
                        {enrollment.notes || '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === enrollment.id ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleSave(enrollment.id)}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Salvează
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Anulează
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(enrollment)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Editează
                      </button>
                    )}
                  </td>
                </tr>
              ))
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
          filteredEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="p-3 xs:p-4 hover:bg-gray-50">
              {editingId === enrollment.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm xs:text-base text-gray-900">{enrollment.studentName}</h3>
                      <p className="text-xs xs:text-sm text-gray-500">{enrollment.course?.title || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] xs:text-xs text-gray-500 mb-1">Status</label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full text-xs xs:text-sm border border-gray-300 rounded px-2 py-1.5 text-gray-900"
                      >
                        {Object.keys(statusLabels).map(status => (
                          <option key={status} value={status}>{statusLabels[status]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] xs:text-xs text-gray-500 mb-1">Note</label>
                      <input
                        type="text"
                        value={editData.notes}
                        onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full text-xs xs:text-sm border border-gray-300 rounded px-2 py-1.5 text-gray-900 placeholder-gray-700"
                        placeholder="Note..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleSave(enrollment.id)}
                      className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs xs:text-sm font-medium hover:bg-green-700"
                    >
                      Salvează
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs xs:text-sm font-medium hover:bg-gray-50"
                    >
                      Anulează
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-2 xs:space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm xs:text-base text-gray-900 leading-tight">{enrollment.studentName}</h3>
                      <p className="text-xs xs:text-sm text-gray-500">{enrollment.course?.title || '-'}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-medium whitespace-nowrap flex-shrink-0 ${statusColors[enrollment.status]}`}>
                      {statusLabels[enrollment.status]}
                    </span>
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
                        <p className="text-gray-900 font-medium">{enrollment.parentPhone}</p>
                        <p className="text-gray-500 text-xs break-all">{enrollment.parentEmail}</p>
                      </div>
                    </div>
                    {enrollment.notes && (
                      <div className="col-span-2">
                        <span className="text-gray-500 block mb-0.5">Note</span>
                        <p className="text-gray-900">{enrollment.notes}</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="text-gray-500 block mb-0.5">Data</span>
                      <span className="text-gray-900">{new Date(enrollment.createdAt).toLocaleDateString('ro-RO')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEdit(enrollment)}
                    className="w-full px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs xs:text-sm font-medium hover:bg-indigo-700 mt-2"
                  >
                    Editează
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
