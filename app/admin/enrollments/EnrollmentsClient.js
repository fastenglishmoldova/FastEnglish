'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  CalendarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

const statusConfig = {
  LEAD: { label: '🔵 Lead', color: 'bg-blue-100 text-blue-800' },
  FARA_RASPUNS: { label: '🔘 Fără Răspuns', color: 'bg-gray-100 text-gray-700' },
  CONTACTAT: { label: '🟡 Contactat', color: 'bg-yellow-100 text-yellow-800' },
  PROGRAMAT: { label: '🟠 Programat', color: 'bg-orange-100 text-orange-800' },
  PRIMA_LECTIE: { label: '🟢 Prima Lecție', color: 'bg-green-100 text-green-800' },
  FINALIZAT_LECTIA: { label: '⚫ Finalizat Lecția', color: 'bg-slate-200 text-slate-800' },
  SE_GANDESTE: { label: '🔘 Se Gândește', color: 'bg-gray-100 text-gray-600' },
  ASTEPTAM_PLATA: { label: '💵 Așteptăm Plata', color: 'bg-amber-100 text-amber-800' },
  PLATIT: { label: '💰 Plătit', color: 'bg-emerald-100 text-emerald-800' },
  STUDIAZA: { label: '🟣 Studiază', color: 'bg-purple-100 text-purple-800' },
  PLECAT: { label: '🔴 Plecat', color: 'bg-red-100 text-red-800' },
  LOST_LEAD: { label: '❌ Lost Lead', color: 'bg-red-200 text-red-900' },
  TEST: { label: '🧪 Test', color: 'bg-cyan-100 text-cyan-800' },
  NOU: { label: '🔵 Lead', color: 'bg-blue-100 text-blue-800' },
  NEW: { label: '🔵 Lead', color: 'bg-blue-100 text-blue-800' },
  CONTACTED: { label: '🟡 Contactat', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMAT: { label: '🟢 Prima Lecție', color: 'bg-green-100 text-green-800' },
  CONFIRMED: { label: '🟢 Prima Lecție', color: 'bg-green-100 text-green-800' },
  RESPINS: { label: '🔴 Plecat', color: 'bg-red-100 text-red-800' },
  REJECTED: { label: '🔴 Plecat', color: 'bg-red-100 text-red-800' }
}

const allStatuses = [
  { value: 'LEAD', label: 'Lead' },
  { value: 'FARA_RASPUNS', label: 'Fără Răspuns' },
  { value: 'CONTACTAT', label: 'Contactat' },
  { value: 'PROGRAMAT', label: 'Programat' },
  { value: 'PRIMA_LECTIE', label: 'Prima Lecție' },
  { value: 'FINALIZAT_LECTIA', label: 'Finalizat Lecția' },
  { value: 'SE_GANDESTE', label: 'Se Gândește' },
  { value: 'ASTEPTAM_PLATA', label: 'Așteptăm Plata' },
  { value: 'PLATIT', label: 'Plătit' },
  { value: 'STUDIAZA', label: 'Studiază' },
  { value: 'PLECAT', label: 'Plecat' },
  { value: 'LOST_LEAD', label: 'Lost Lead' },
  { value: 'TEST', label: 'Test' },
]

const statusMappings = {
  'NOU': ['NOU', 'NEW', 'LEAD'],
  'NEW': ['NOU', 'NEW', 'LEAD'],
  'LEAD': ['NOU', 'NEW', 'LEAD'],
  'CONTACTED': ['CONTACTED', 'CONTACTAT'],
  'CONTACTAT': ['CONTACTED', 'CONTACTAT'],
  'CONFIRMAT': ['CONFIRMAT', 'CONFIRMED', 'PRIMA_LECTIE'],
  'CONFIRMED': ['CONFIRMAT', 'CONFIRMED', 'PRIMA_LECTIE'],
  'PRIMA_LECTIE': ['CONFIRMAT', 'CONFIRMED', 'PRIMA_LECTIE'],
  'RESPINS': ['RESPINS', 'REJECTED', 'PLECAT'],
  'REJECTED': ['RESPINS', 'REJECTED', 'PLECAT'],
  'PLECAT': ['RESPINS', 'REJECTED', 'PLECAT'],
}

const ITEMS_PER_PAGE = 10

export default function EnrollmentsClient({ enrollments, stats }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const loadMoreRef = useRef(null)

  // Filter enrollments based on search and status
  const filteredEnrollments = useMemo(() => {
    let result = enrollments

    // Filter by status
    if (statusFilter) {
      const statusesToMatch = statusMappings[statusFilter] || [statusFilter]
      result = result.filter(e => statusesToMatch.includes(e.status))
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim()
      result = result.filter(e => 
        e.studentName?.toLowerCase().includes(searchLower) ||
        e.parentName?.toLowerCase().includes(searchLower) ||
        e.parentPhone?.toLowerCase().includes(searchLower) ||
        e.parentEmail?.toLowerCase().includes(searchLower) ||
        e.course?.title?.toLowerCase().includes(searchLower) ||
        e.cursuri?.some(c => c.toLowerCase().includes(searchLower))
      )
    }

    return result
  }, [enrollments, search, statusFilter])

  // Get displayed enrollments (infinite scroll)
  const displayedEnrollments = filteredEnrollments.slice(0, displayCount)
  const hasMore = displayCount < filteredEnrollments.length

  // Reset display count when filters change
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setDisplayCount(ITEMS_PER_PAGE)
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
    setDisplayCount(ITEMS_PER_PAGE)
  }

  // Load more function
  const loadMore = useCallback(() => {
    if (hasMore) {
      setDisplayCount(prev => prev + ITEMS_PER_PAGE)
    }
  }, [hasMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <div className="space-y-4 xs:space-y-6">
      <div>
        <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Înscrieri</h1>
        <p className="text-sm xs:text-base text-gray-600">Gestionează înscrierile primite din toate sursele</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Total</p>
          <p className="text-xl xs:text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">🔵 Lead</p>
          <p className="text-xl xs:text-2xl font-bold text-blue-600">{stats.noi}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">🟡 Contactați</p>
          <p className="text-xl xs:text-2xl font-bold text-yellow-600">{stats.contactati}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">🟢 Confirmați</p>
          <p className="text-xl xs:text-2xl font-bold text-green-600">{stats.confirmati}</p>
        </div>
      </div>
      
      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Caută după nume, telefon, email..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f]"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="block w-full sm:w-auto px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f]"
            >
              <option value="">Toate statusurile</option>
              {allStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-2 text-xs text-gray-500">
          {filteredEnrollments.length === enrollments.length 
            ? `${enrollments.length} înscrieri total`
            : `${filteredEnrollments.length} din ${enrollments.length} înscrieri`
          }
        </div>
      </div>

      {/* Lista înscrieri */}
      {displayedEnrollments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <InboxIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {search || statusFilter ? 'Nu s-au găsit înscrieri cu aceste criterii' : 'Nu există înscrieri încă'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedEnrollments.map((enrollment) => {
            const status = statusConfig[enrollment.status] || statusConfig.NOU
            const isNew = enrollment.status === 'NOU' || enrollment.status === 'NEW' || enrollment.status === 'LEAD'
            
            return (
              <Link
                key={enrollment.id}
                href={`/admin/enrollments/${enrollment.id}`}
                className={`block bg-white rounded-xl p-3 xs:p-4 border hover:border-[#30919f] hover:shadow-md transition-all ${
                  isNew ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 xs:gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm xs:text-base truncate max-w-[150px] xs:max-w-none">
                        <AcademicCapIcon className="h-4 w-4 inline mr-1 text-[#30919f]" />
                        {enrollment.studentName}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        enrollment.source === 'formular' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {enrollment.source === 'formular' ? 'Formular' : 'Modal'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col xs:flex-row xs:flex-wrap gap-1 xs:gap-x-4 xs:gap-y-1 text-xs xs:text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                        {enrollment.parentName}
                      </span>
                      <span className="flex items-center gap-1">
                        <PhoneIcon className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                        {enrollment.parentPhone}
                      </span>
                      <span className="flex items-center gap-1 min-w-0">
                        <EnvelopeIcon className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                        <span className="truncate">{enrollment.parentEmail}</span>
                      </span>
                    </div>

                    <div className="text-xs xs:text-sm text-gray-700">
                      <BookOpenIcon className="h-3 w-3 xs:h-4 xs:w-4 inline mr-1 text-gray-400" />
                      {enrollment.source === 'formular' ? (
                        enrollment.cursuri?.length > 0 
                          ? enrollment.cursuri.join(', ')
                          : 'Fără cursuri selectate'
                      ) : (
                        enrollment.course?.title || 'Curs nespecificat'
                      )}
                      {enrollment.clasa && (
                        <span className="ml-2 text-gray-500">• Clasa {enrollment.clasa}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-left xs:text-right text-xs text-gray-400 whitespace-nowrap">
                    <CalendarIcon className="h-3 w-3 xs:h-4 xs:w-4 inline mr-1" />
                    {new Date(enrollment.createdAt).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </Link>
            )
          })}
          
          {/* Infinite scroll trigger */}
          {hasMore && (
            <div 
              ref={loadMoreRef} 
              className="flex justify-center py-4"
            >
              <div className="animate-pulse text-gray-400 text-sm">
                Se încarcă mai multe...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
