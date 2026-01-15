'use client'

import { useState, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { 
  PlusIcon, 
  MinusIcon, 
  ExclamationTriangleIcon,
  BanknotesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  XMarkIcon,
  PauseCircleIcon,
  CheckCircleIcon,
  ArrowRightStartOnRectangleIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline'

// Status configuration
const STATUS_CONFIG = {
  ACTIVE: { label: 'Activ', color: 'green', icon: PlayCircleIcon },
  PAUSED: { label: 'Pauză', color: 'amber', icon: PauseCircleIcon },
  LEFT: { label: 'Plecat', color: 'red', icon: ArrowRightStartOnRectangleIcon },
  COMPLETED: { label: 'Terminat', color: 'blue', icon: CheckCircleIcon }
}

export default function GroupStudentsManager({ group, allStudents }) {
  const router = useRouter()
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [lessonsRemaining, setLessonsRemaining] = useState(group.course?.lessonsCount || 12)
  const [loading, setLoading] = useState(false)
  const [addingLessons, setAddingLessons] = useState({})
  const [lessonsToAdd, setLessonsToAdd] = useState({})
  const [absencesToAdd, setAbsencesToAdd] = useState({})
  const [addingAbsences, setAddingAbsences] = useState({})
  const [expandedPayments, setExpandedPayments] = useState({})
  const [showPaymentModal, setShowPaymentModal] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(null)
  const [statusForm, setStatusForm] = useState({ status: '', statusNote: '' })
  const [savingStatus, setSavingStatus] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    notes: '',
    lessonsAdded: ''
  })
  const [savingPayment, setSavingPayment] = useState(false)

  const assignedStudentIds = group.groupStudents.map(gs => gs.studentId)
  const availableStudents = allStudents.filter(s => !assignedStudentIds.includes(s.id))

  const handleAddStudent = async () => {
    if (!selectedStudentId) return
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/groups/${group.id}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: selectedStudentId, lessonsRemaining })
      })

      if (res.ok) {
        toast.success('Elevul a fost adăugat în grupă')
        setSelectedStudentId('')
        router.refresh()
      } else {
        toast.error('Eroare la adăugarea elevului')
      }
    } catch (error) {
      toast.error('Eroare la adăugarea elevului')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveStudent = async (groupStudentId) => {
    if (!confirm('Sigur vrei să elimini acest elev din grupă?')) return

    try {
      const res = await fetch(`/api/admin/groups/${group.id}/students/${groupStudentId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('Elevul a fost eliminat din grupă')
        router.refresh()
      } else {
        toast.error('Eroare la eliminarea elevului')
      }
    } catch (error) {
      toast.error('Eroare la eliminarea elevului')
    }
  }

  const handleAddLessons = async (groupStudentId) => {
    const lessons = lessonsToAdd[groupStudentId] || 0
    if (lessons === 0) return

    setAddingLessons(prev => ({ ...prev, [groupStudentId]: true }))

    try {
      const res = await fetch(`/api/admin/groups/${group.id}/students/${groupStudentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addLessons: lessons })
      })

      if (res.ok) {
        toast.success(`${lessons > 0 ? 'Adăugate' : 'Scăzute'} ${Math.abs(lessons)} lecții`)
        setLessonsToAdd(prev => ({ ...prev, [groupStudentId]: 0 }))
        router.refresh()
      } else {
        toast.error('Eroare la modificarea lecțiilor')
      }
    } catch (error) {
      toast.error('Eroare la modificarea lecțiilor')
    } finally {
      setAddingLessons(prev => ({ ...prev, [groupStudentId]: false }))
    }
  }

  const handleAddAbsences = async (groupStudentId) => {
    const absences = absencesToAdd[groupStudentId] || 0
    if (absences === 0) return

    setAddingAbsences(prev => ({ ...prev, [groupStudentId]: true }))

    try {
      const res = await fetch(`/api/admin/groups/${group.id}/students/${groupStudentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addAbsences: absences })
      })

      if (res.ok) {
        toast.success(`${absences > 0 ? 'Adăugate' : 'Scăzute'} ${Math.abs(absences)} absențe`)
        setAbsencesToAdd(prev => ({ ...prev, [groupStudentId]: 0 }))
        router.refresh()
      } else {
        toast.error('Eroare la modificarea absențelor')
      }
    } catch (error) {
      toast.error('Eroare la modificarea absențelor')
    } finally {
      setAddingAbsences(prev => ({ ...prev, [groupStudentId]: false }))
    }
  }

  const togglePayments = (groupStudentId) => {
    setExpandedPayments(prev => ({
      ...prev,
      [groupStudentId]: !prev[groupStudentId]
    }))
  }

  const openPaymentModal = (groupStudent) => {
    setShowPaymentModal(groupStudent)
    setPaymentForm({
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      notes: '',
      lessonsAdded: ''
    })
  }

  const handleSavePayment = async () => {
    if (!paymentForm.amount) {
      toast.error('Suma este obligatorie')
      return
    }

    setSavingPayment(true)

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupStudentId: showPaymentModal.id,
          amount: parseFloat(paymentForm.amount),
          paymentDate: paymentForm.paymentDate,
          paymentMethod: paymentForm.paymentMethod,
          notes: paymentForm.notes,
          lessonsAdded: paymentForm.lessonsAdded ? parseInt(paymentForm.lessonsAdded) : null
        })
      })

      if (res.ok) {
        toast.success('Plata a fost înregistrată')
        setShowPaymentModal(null)
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Eroare la salvarea plății')
      }
    } catch (error) {
      toast.error('Eroare la salvarea plății')
    } finally {
      setSavingPayment(false)
    }
  }

  const handleDeletePayment = async (paymentId) => {
    if (!confirm('Sigur vrei să ștergi această plată?')) return

    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('Plata a fost ștearsă')
        router.refresh()
      } else {
        toast.error('Eroare la ștergerea plății')
      }
    } catch (error) {
      toast.error('Eroare la ștergerea plății')
    }
  }

  const openStatusModal = (groupStudent) => {
    setShowStatusModal(groupStudent)
    setStatusForm({
      status: groupStudent.status || 'ACTIVE',
      statusNote: groupStudent.statusNote || ''
    })
  }

  const handleSaveStatus = async () => {
    setSavingStatus(true)

    try {
      const res = await fetch(`/api/admin/groups/${group.id}/students/${showStatusModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusForm.status,
          statusNote: statusForm.statusNote
        })
      })

      if (res.ok) {
        toast.success('Statusul a fost actualizat')
        setShowStatusModal(null)
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Eroare la actualizarea statusului')
      }
    } catch (error) {
      toast.error('Eroare la actualizarea statusului')
    } finally {
      setSavingStatus(false)
    }
  }

  // Count students with low/zero lessons (only active students)
  const activeStudents = group.groupStudents.filter(gs => gs.status === 'ACTIVE' || !gs.status)
  const studentsWithZeroLessons = activeStudents.filter(gs => gs.lessonsRemaining === 0).length
  const studentsWithLowLessons = activeStudents.filter(gs => gs.lessonsRemaining > 0 && gs.lessonsRemaining <= 2).length
  const inactiveStudents = group.groupStudents.filter(gs => gs.status && gs.status !== 'ACTIVE').length

  // Calculate total payments for a student
  const getTotalPayments = (payments) => {
    return payments?.reduce((sum, p) => sum + p.amount, 0) || 0
  }

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
      {/* Warning Messages */}
      {studentsWithZeroLessons > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg xs:rounded-xl p-3 xs:p-4 flex items-start gap-2 xs:gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 xs:w-6 xs:h-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-800 text-sm xs:text-base">Atenție: {studentsWithZeroLessons} {studentsWithZeroLessons === 1 ? 'elev' : 'elevi'} cu 0 lecții rămase!</p>
            <p className="text-xs xs:text-sm text-red-700 mt-0.5 xs:mt-1">Aceștia nu au achitat pentru lecții suplimentare.</p>
          </div>
        </div>
      )}
      
      {studentsWithLowLessons > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg xs:rounded-xl p-3 xs:p-4 flex items-start gap-2 xs:gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 xs:w-6 xs:h-6 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm xs:text-base">Atenție: {studentsWithLowLessons} {studentsWithLowLessons === 1 ? 'elev are' : 'elevi au'} doar 1-2 lecții rămase</p>
            <p className="text-xs xs:text-sm text-amber-700 mt-0.5 xs:mt-1">Contactați părinții pentru reînnoire.</p>
          </div>
        </div>
      )}

      {/* Add Student */}
      <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-3 xs:p-4 sm:p-6">
        <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-3 xs:mb-4">Adaugă elev în grupă</h3>
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full xs:flex-1 px-3 xs:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm xs:text-base"
          >
            <option value="">Selectează elev</option>
            {availableStudents.map(student => (
              <option key={student.id} value={student.id}>{student.fullName}</option>
            ))}
          </select>
          <div className="flex gap-2 xs:gap-3 sm:gap-4">
            <input
              type="number"
              value={lessonsRemaining}
              onChange={(e) => setLessonsRemaining(parseInt(e.target.value) || 0)}
              min={0}
              className="w-20 xs:w-24 px-2 xs:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-700 text-sm xs:text-base"
              placeholder="Lecții"
            />
            <button
              onClick={handleAddStudent}
              disabled={!selectedStudentId || loading}
              className="flex-1 xs:flex-none px-4 xs:px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 text-sm xs:text-base whitespace-nowrap"
            >
              {loading ? '...' : 'Adaugă'}
            </button>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {inactiveStudents > 0 && (
          <div className="px-3 xs:px-4 sm:px-6 py-2 xs:py-3 bg-gray-100 border-b border-gray-200">
            <p className="text-xs xs:text-sm text-gray-600">
              <span className="font-medium">{activeStudents.length}</span> elevi activi, 
              <span className="font-medium text-gray-500 ml-1">{inactiveStudents}</span> inactivi
            </p>
          </div>
        )}
        
        {/* Desktop Table - hidden on mobile */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Elev</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lecții rămase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absențe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plăți</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Înscris la</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {group.groupStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Nu există elevi în această grupă
                  </td>
              </tr>
            ) : (
              group.groupStudents.map((gs) => {
                const status = gs.status || 'ACTIVE'
                const statusConfig = STATUS_CONFIG[status]
                const StatusIcon = statusConfig.icon
                const isInactive = status !== 'ACTIVE'
                
                return (
                <Fragment key={gs.id}>
                  <tr className={`hover:bg-gray-50 ${
                    isInactive ? 'bg-gray-50 opacity-60' :
                    gs.lessonsRemaining === 0 ? 'bg-red-50' : 
                    gs.lessonsRemaining <= 2 ? 'bg-amber-50' : ''
                  }`}>
                    <td className="px-6 py-4">
                      <p className={`font-medium ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>{gs.student.fullName}</p>
                      <p className="text-sm text-gray-500">{gs.student.parentPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openStatusModal(gs)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:ring-2 hover:ring-offset-1 ${
                          status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:ring-green-300' :
                          status === 'PAUSED' ? 'bg-amber-100 text-amber-700 hover:ring-amber-300' :
                          status === 'LEFT' ? 'bg-red-100 text-red-700 hover:ring-red-300' :
                          'bg-blue-100 text-blue-700 hover:ring-blue-300'
                        }`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </button>
                      {gs.statusNote && (
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-[120px]" title={gs.statusNote}>
                          {gs.statusNote}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          gs.lessonsRemaining > 3 ? 'bg-green-100 text-green-800' : 
                          gs.lessonsRemaining > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {gs.lessonsRemaining} lecții
                        </span>
                        {gs.lessonsRemaining === 0 && (
                          <span className="text-xs text-red-600 font-medium">Nu a achitat!</span>
                        )}
                        {gs.lessonsRemaining > 0 && gs.lessonsRemaining <= 2 && (
                          <span className="text-xs text-amber-600 font-medium">Aproape expirat</span>
                        )}
                      </div>
                      
                      {/* Add/Remove lessons controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => setLessonsToAdd(prev => ({ ...prev, [gs.id]: (prev[gs.id] || 0) - 1 }))}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={lessonsToAdd[gs.id] || 0}
                          onChange={(e) => setLessonsToAdd(prev => ({ ...prev, [gs.id]: parseInt(e.target.value) || 0 }))}
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm text-gray-900"
                        />
                        <button
                          onClick={() => setLessonsToAdd(prev => ({ ...prev, [gs.id]: (prev[gs.id] || 0) + 1 }))}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAddLessons(gs.id)}
                          disabled={!lessonsToAdd[gs.id] || addingLessons[gs.id]}
                          className="px-3 py-1 bg-indigo-600 text-white text-xs rounded font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingLessons[gs.id] ? '...' : 'Salvează'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* Absences display */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (gs.absences || 0) === 0 ? 'bg-green-100 text-green-800' :
                          (gs.absences || 0) <= 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {Math.max(0, gs.absences || 0)} {Math.max(0, gs.absences || 0) === 1 ? 'absență' : 'absențe'}
                        </span>
                      </div>
                      
                      {/* Add/Remove absences controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAbsencesToAdd(prev => ({ ...prev, [gs.id]: (prev[gs.id] || 0) - 1 }))}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={absencesToAdd[gs.id] || 0}
                          onChange={(e) => setAbsencesToAdd(prev => ({ ...prev, [gs.id]: parseInt(e.target.value) || 0 }))}
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm text-gray-900"
                        />
                        <button
                          onClick={() => setAbsencesToAdd(prev => ({ ...prev, [gs.id]: (prev[gs.id] || 0) + 1 }))}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAddAbsences(gs.id)}
                          disabled={!absencesToAdd[gs.id] || addingAbsences[gs.id]}
                          className="px-3 py-1 bg-orange-600 text-white text-xs rounded font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingAbsences[gs.id] ? '...' : 'Salvează'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            Total: {getTotalPayments(gs.payments).toLocaleString('ro-RO')} MDL
                          </span>
                          <span className="text-xs text-gray-500">
                            ({gs.payments?.length || 0} {gs.payments?.length === 1 ? 'plată' : 'plăți'})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openPaymentModal(gs)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded font-medium hover:bg-green-700"
                          >
                            <BanknotesIcon className="w-3 h-3" />
                            Adaugă plată
                          </button>
                          {gs.payments?.length > 0 && (
                            <button
                              onClick={() => togglePayments(gs.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium hover:bg-gray-200"
                            >
                              {expandedPayments[gs.id] ? (
                                <>
                                  <ChevronUpIcon className="w-3 h-3" />
                                  Ascunde
                                </>
                              ) : (
                                <>
                                  <ChevronDownIcon className="w-3 h-3" />
                                  Vezi plăți
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(gs.enrolledAt).toLocaleDateString('ro-RO')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemoveStudent(gs.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Elimină
                      </button>
                    </td>
                  </tr>
                  {/* Expanded Payments Row */}
                  {expandedPayments[gs.id] && gs.payments?.length > 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="ml-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Istoricul plăților:</h4>
                          <div className="space-y-2">
                            {gs.payments.map((payment) => (
                              <div key={payment.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <span className="font-semibold text-green-600">{payment.amount.toLocaleString('ro-RO')} MDL</span>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(payment.paymentDate).toLocaleDateString('ro-RO', {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </div>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    payment.paymentMethod === 'cash' ? 'bg-green-100 text-green-700' :
                                    payment.paymentMethod === 'card' ? 'bg-blue-100 text-blue-700' :
                                    'bg-purple-100 text-purple-700'
                                  }`}>
                                    {payment.paymentMethod === 'cash' ? 'Numerar' :
                                     payment.paymentMethod === 'card' ? 'Card' : 'Transfer'}
                                  </span>
                                  {payment.lessonsAdded && (
                                    <span className="text-xs text-indigo-600 font-medium">
                                      +{payment.lessonsAdded} lecții
                                    </span>
                                  )}
                                  {payment.notes && (
                                    <span className="text-xs text-gray-500 italic">{payment.notes}</span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDeletePayment(payment.id)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )})
            )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - shown only on mobile */}
        <div className="lg:hidden divide-y divide-gray-200">
          {group.groupStudents.length === 0 ? (
            <div className="p-6 xs:p-8 text-center text-gray-500 text-sm">
              Nu există elevi în această grupă
            </div>
          ) : (
            group.groupStudents.map((gs) => {
              const status = gs.status || 'ACTIVE'
              const statusConfig = STATUS_CONFIG[status]
              const StatusIcon = statusConfig.icon
              const isInactive = status !== 'ACTIVE'
              
              return (
                <div key={gs.id} className={`p-3 xs:p-4 space-y-3 ${
                  isInactive ? 'bg-gray-50 opacity-70' :
                  gs.lessonsRemaining === 0 ? 'bg-red-50' : 
                  gs.lessonsRemaining <= 2 ? 'bg-amber-50' : ''
                }`}>
                  {/* Header: Name + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm xs:text-base truncate ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>
                        {gs.student.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{gs.student.parentPhone}</p>
                    </div>
                    <button
                      onClick={() => openStatusModal(gs)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-medium flex-shrink-0 ${
                        status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        status === 'PAUSED' ? 'bg-amber-100 text-amber-700' :
                        status === 'LEFT' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </button>
                  </div>

                  {/* Lessons Section */}
                  <div className="bg-white/50 rounded-lg p-2 xs:p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Lecții rămase:</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-medium ${
                          gs.lessonsRemaining > 3 ? 'bg-green-100 text-green-800' : 
                          gs.lessonsRemaining > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {gs.lessonsRemaining}
                        </span>
                        {gs.lessonsRemaining === 0 && (
                          <span className="text-[10px] text-red-600 font-medium">Nu a achitat!</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setLessonsToAdd(prev => ({ ...prev, [gs.id]: (prev[gs.id] || 0) - 1 }))}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        <MinusIcon className="w-3 h-3 xs:w-4 xs:h-4" />
                      </button>
                      <input
                        type="number"
                        value={lessonsToAdd[gs.id] || 0}
                        onChange={(e) => setLessonsToAdd(prev => ({ ...prev, [gs.id]: parseInt(e.target.value) || 0 }))}
                        className="w-12 xs:w-14 px-1 py-1 text-center border border-gray-300 rounded text-xs xs:text-sm text-gray-900"
                      />
                      <button
                        onClick={() => setLessonsToAdd(prev => ({ ...prev, [gs.id]: (prev[gs.id] || 0) + 1 }))}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        <PlusIcon className="w-3 h-3 xs:w-4 xs:h-4" />
                      </button>
                      <button
                        onClick={() => handleAddLessons(gs.id)}
                        disabled={!lessonsToAdd[gs.id] || addingLessons[gs.id]}
                        className="flex-1 px-2 py-1 bg-indigo-600 text-white text-[10px] xs:text-xs rounded font-medium hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {addingLessons[gs.id] ? '...' : 'Salvează'}
                      </button>
                    </div>
                  </div>

                  {/* Absences Section */}
                  <div className="bg-white/50 rounded-lg p-2 xs:p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Absențe:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-medium ${
                        (gs.absences || 0) === 0 ? 'bg-green-100 text-green-800' :
                        (gs.absences || 0) <= 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Math.max(0, gs.absences || 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setAbsencesToAdd(prev => ({ ...prev, [gs.id]: (prev[gs.id] || 0) - 1 }))}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        <MinusIcon className="w-3 h-3 xs:w-4 xs:h-4" />
                      </button>
                      <input
                        type="number"
                        value={absencesToAdd[gs.id] || 0}
                        onChange={(e) => setAbsencesToAdd(prev => ({ ...prev, [gs.id]: parseInt(e.target.value) || 0 }))}
                        className="w-12 xs:w-14 px-1 py-1 text-center border border-gray-300 rounded text-xs xs:text-sm text-gray-900"
                      />
                      <button
                        onClick={() => setAbsencesToAdd(prev => ({ ...prev, [gs.id]: (prev[gs.id] || 0) + 1 }))}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        <PlusIcon className="w-3 h-3 xs:w-4 xs:h-4" />
                      </button>
                      <button
                        onClick={() => handleAddAbsences(gs.id)}
                        disabled={!absencesToAdd[gs.id] || addingAbsences[gs.id]}
                        className="flex-1 px-2 py-1 bg-orange-600 text-white text-[10px] xs:text-xs rounded font-medium hover:bg-orange-700 disabled:opacity-50"
                      >
                        {addingAbsences[gs.id] ? '...' : 'Salvează'}
                      </button>
                    </div>
                  </div>

                  {/* Payments Section */}
                  <div className="bg-white/50 rounded-lg p-2 xs:p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Plăți:</span>
                      <span className="text-xs xs:text-sm font-medium text-gray-900">
                        {getTotalPayments(gs.payments).toLocaleString('ro-RO')} MDL
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openPaymentModal(gs)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-green-600 text-white text-[10px] xs:text-xs rounded font-medium hover:bg-green-700"
                      >
                        <BanknotesIcon className="w-3 h-3" />
                        Adaugă plată
                      </button>
                      {gs.payments?.length > 0 && (
                        <button
                          onClick={() => togglePayments(gs.id)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-700 text-[10px] xs:text-xs rounded font-medium hover:bg-gray-200"
                        >
                          {expandedPayments[gs.id] ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                          {gs.payments.length}
                        </button>
                      )}
                    </div>
                    
                    {/* Expanded payments */}
                    {expandedPayments[gs.id] && gs.payments?.length > 0 && (
                      <div className="mt-2 space-y-1.5 pt-2 border-t border-gray-200">
                        {gs.payments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between bg-white rounded p-2 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-green-600">{payment.amount} MDL</span>
                              <span className="text-gray-500">
                                {new Date(payment.paymentDate).toLocaleDateString('ro-RO')}
                              </span>
                              {payment.lessonsAdded && (
                                <span className="text-indigo-600">+{payment.lessonsAdded} lecții</span>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer: Date + Remove */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-[10px] xs:text-xs text-gray-500">
                      Înscris: {new Date(gs.enrolledAt).toLocaleDateString('ro-RO')}
                    </span>
                    <button
                      onClick={() => handleRemoveStudent(gs.id)}
                      className="text-red-600 hover:text-red-900 text-[10px] xs:text-xs font-medium"
                    >
                      Elimină
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Payment Modal - Improved Design */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 xs:p-4">
          <div className="bg-white rounded-2xl xs:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] xs:max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 xs:px-6 py-4 xs:py-5 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <BanknotesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Înregistrează plată</h3>
                    <p className="text-green-100 text-sm">{showPaymentModal.student.fullName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentModal(null)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-4 xs:p-6 space-y-4 xs:space-y-5 overflow-y-auto flex-1">
              {/* Amount - Prominent */}
              <div className="bg-gray-50 rounded-xl xs:rounded-2xl p-3 xs:p-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Suma plătită *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-4 text-3xl font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-400">MDL</span>
                </div>
              </div>

              {/* Two columns */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data plății
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">📅</div>
                    <input
                      type="date"
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                      className="w-full pl-11 pr-4 py-2.5 xs:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gradient-to-r from-gray-50 to-white hover:border-gray-300 transition-colors cursor-pointer font-medium"
                    />
                  </div>
                  {/* Quick date buttons */}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setPaymentForm(prev => ({ ...prev, paymentDate: new Date().toISOString().split('T')[0] }))}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                        paymentForm.paymentDate === new Date().toISOString().split('T')[0]
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Azi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const yesterday = new Date()
                        yesterday.setDate(yesterday.getDate() - 1)
                        setPaymentForm(prev => ({ ...prev, paymentDate: yesterday.toISOString().split('T')[0] }))
                      }}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                        (() => {
                          const yesterday = new Date()
                          yesterday.setDate(yesterday.getDate() - 1)
                          return paymentForm.paymentDate === yesterday.toISOString().split('T')[0]
                        })()
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Ieri
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lecții adăugate
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">📚</div>
                    <input
                      type="number"
                      value={paymentForm.lessonsAdded}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, lessonsAdded: e.target.value }))}
                      className="w-full pl-11 pr-4 py-2.5 xs:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gradient-to-r from-gray-50 to-white hover:border-gray-300 transition-colors font-medium"
                      placeholder="Ex: 12"
                    />
                  </div>
                  {/* Quick lesson buttons */}
                  <div className="flex gap-1.5 xs:gap-2 mt-2">
                    {[4, 8, 12].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPaymentForm(prev => ({ ...prev, lessonsAdded: num.toString() }))}
                        className={`px-2 xs:px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                          paymentForm.lessonsAdded === num.toString()
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {num} lecții
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Method - Visual Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metodă de plată
                </label>
                <div className="grid grid-cols-3 gap-2 xs:gap-3">
                  {[
                    { value: 'cash', label: 'Numerar', icon: '💵', color: 'green' },
                    { value: 'card', label: 'Card', icon: '💳', color: 'blue' },
                    { value: 'transfer', label: 'Transfer', icon: '🏦', color: 'purple' }
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentForm(prev => ({ ...prev, paymentMethod: method.value }))}
                      className={`p-2 xs:p-3 rounded-xl border-2 transition-all ${
                        paymentForm.paymentMethod === method.value
                          ? method.color === 'green' 
                            ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                            : method.color === 'blue'
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                    >
                      <span className="text-xl xs:text-2xl block mb-0.5 xs:mb-1">{method.icon}</span>
                      <span className={`text-[10px] xs:text-xs font-medium ${
                        paymentForm.paymentMethod === method.value
                          ? method.color === 'green' 
                            ? 'text-green-700'
                            : method.color === 'blue'
                            ? 'text-blue-700'
                            : 'text-purple-700'
                          : 'text-gray-600'
                      }`}>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notițe (opțional)
                </label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 xs:px-4 py-2.5 xs:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gray-50 resize-none text-sm"
                  placeholder="Ex: Plată pentru luna ianuarie..."
                />
              </div>

              {/* Info box */}
              {paymentForm.lessonsAdded && parseInt(paymentForm.lessonsAdded) > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 xs:p-3 flex items-start gap-2">
                  <span className="text-indigo-500 text-base xs:text-lg">ℹ️</span>
                  <p className="text-xs xs:text-sm text-indigo-700">
                    Se vor adăuga automat <strong>{paymentForm.lessonsAdded} lecții</strong> la soldul elevului după salvare.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 xs:px-6 py-3 xs:py-4 bg-gray-50 border-t border-gray-100 flex gap-2 xs:gap-3 flex-shrink-0">
              <button
                onClick={() => setShowPaymentModal(null)}
                className="flex-1 px-3 xs:px-4 py-2.5 xs:py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm xs:text-base"
              >
                Anulează
              </button>
              <button
                onClick={handleSavePayment}
                disabled={savingPayment || !paymentForm.amount}
                className="flex-1 px-3 xs:px-4 py-2.5 xs:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/25 text-sm xs:text-base"
              >
                {savingPayment ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 xs:h-5 xs:w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Se salvează...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <BanknotesIcon className="w-4 h-4 xs:w-5 xs:h-5" />
                    Salvează plata
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    {(() => {
                      const StatusIcon = STATUS_CONFIG[statusForm.status]?.icon || PlayCircleIcon
                      return <StatusIcon className="w-6 h-6 text-white" />
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Schimbă Status</h3>
                    <p className="text-indigo-100 text-sm">{showStatusModal.student.fullName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStatusModal(null)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selectează statusul
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setStatusForm(prev => ({ ...prev, status: key }))}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          statusForm.status === key
                            ? config.color === 'green' 
                              ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                              : config.color === 'amber'
                              ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                              : config.color === 'red'
                              ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                              : 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${
                          statusForm.status === key
                            ? config.color === 'green' ? 'text-green-600'
                              : config.color === 'amber' ? 'text-amber-600'
                              : config.color === 'red' ? 'text-red-600'
                              : 'text-blue-600'
                            : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          statusForm.status === key
                            ? config.color === 'green' ? 'text-green-700'
                              : config.color === 'amber' ? 'text-amber-700'
                              : config.color === 'red' ? 'text-red-700'
                              : 'text-blue-700'
                            : 'text-gray-600'
                        }`}>{config.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Note */}
              {statusForm.status !== 'ACTIVE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motiv / Notă (opțional)
                  </label>
                  <textarea
                    value={statusForm.statusNote}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, statusNote: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-gray-50 resize-none"
                    placeholder={
                      statusForm.status === 'LEFT' ? 'Ex: S-a mutat în alt oraș...' :
                      statusForm.status === 'PAUSED' ? 'Ex: Pauză pentru vacanță...' :
                      statusForm.status === 'COMPLETED' ? 'Ex: A terminat toate lecțiile...' : ''
                    }
                  />
                </div>
              )}

              {/* Info */}
              {statusForm.status === 'LEFT' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">
                    Elevul va fi marcat ca &quot;plecat&quot; și nu va mai fi inclus în statisticile active ale profesorului.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowStatusModal(null)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={savingStatus}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25"
              >
                {savingStatus ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Se salvează...
                  </span>
                ) : (
                  'Salvează'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
