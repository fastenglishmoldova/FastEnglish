'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  UserIcon,
  PhoneIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

// Helper pentru formatarea programului
const formatSchedule = (scheduleDays, scheduleTime) => {
  if (!scheduleDays || scheduleDays.length === 0) return ''
  
  let times = {}
  try {
    if (scheduleTime && scheduleTime.startsWith('{')) {
      times = JSON.parse(scheduleTime)
    }
  } catch {
    // E string simplu
  }
  
  const isSimple = !scheduleTime || !scheduleTime.startsWith('{')
  const uniqueTimes = [...new Set(Object.values(times))]
  
  if (isSimple || uniqueTimes.length <= 1) {
    const time = isSimple ? scheduleTime : (uniqueTimes[0] || '')
    return `${scheduleDays.join(', ')}${time ? ' - ' + time : ''}`
  }
  
  return scheduleDays.map(day => `${day} ${times[day] || ''}`).join(', ')
}

export default function TeacherStudentsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [expandedStudent, setExpandedStudent] = useState(null)
  const [sortBy, setSortBy] = useState('name') // name, attendance, absences

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/teacher/students')
      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = data?.students?.filter(student => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      const matchesName = student.name?.toLowerCase().includes(searchLower)
      const matchesParent = student.parentName?.toLowerCase().includes(searchLower)
      const matchesParentPhone = student.parentPhone?.includes(search)
      const matchesParentEmail = student.parentEmail?.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesParent && !matchesParentPhone && !matchesParentEmail) return false
    }
    
    // Group filter
    if (selectedGroup) {
      const hasGroup = student.groups.some(g => g.groupId === selectedGroup)
      if (!hasGroup) return false
    }
    
    return true
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'attendance') return b.attendanceRate - a.attendanceRate
    if (sortBy === 'absences') return b.totalAbsences - a.totalAbsences
    return 0
  }) || []

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return 'text-green-600 bg-green-50'
    if (rate >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  // Calculate students with lesson issues
  const studentsWithZeroLessons = filteredStudents.filter(s => 
    s.groups.some(g => g.remainingLessons === 0)
  )
  const studentsWithLowLessons = filteredStudents.filter(s => 
    s.groups.some(g => g.remainingLessons > 0 && g.remainingLessons <= 2) && 
    !s.groups.some(g => g.remainingLessons === 0)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30919f]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 xs:space-y-5 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Elevii Mei</h1>
        <p className="text-gray-600 mt-1 text-xs xs:text-sm md:text-base">Vezi toți elevii din grupele tale și informațiile lor</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 md:gap-4">
        <div className="bg-white rounded-lg xs:rounded-xl p-2.5 xs:p-3 md:p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-1.5 xs:gap-2 md:gap-3">
            <div className="p-1.5 xs:p-2 bg-blue-100 rounded-lg">
              <UserIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] xs:text-xs text-gray-500 truncate">Total Elevi</p>
              <p className="text-base xs:text-lg md:text-xl font-bold text-gray-900">{data?.stats?.totalStudents || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg xs:rounded-xl p-2.5 xs:p-3 md:p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-1.5 xs:gap-2 md:gap-3">
            <div className="p-1.5 xs:p-2 bg-purple-100 rounded-lg">
              <AcademicCapIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] xs:text-xs text-gray-500 truncate">Total Grupe</p>
              <p className="text-base xs:text-lg md:text-xl font-bold text-gray-900">{data?.stats?.totalGroups || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg xs:rounded-xl p-2.5 xs:p-3 md:p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-1.5 xs:gap-2 md:gap-3">
            <div className="p-1.5 xs:p-2 bg-green-100 rounded-lg">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] xs:text-xs text-gray-500 truncate">Prezență Medie</p>
              <p className="text-base xs:text-lg md:text-xl font-bold text-gray-900">{data?.stats?.averageAttendance || 0}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg xs:rounded-xl p-2.5 xs:p-3 md:p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-1.5 xs:gap-2 md:gap-3">
            <div className="p-1.5 xs:p-2 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] xs:text-xs text-gray-500 truncate">Cu Absențe</p>
              <p className="text-base xs:text-lg md:text-xl font-bold text-gray-900">{data?.stats?.studentsWithAbsences || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {studentsWithZeroLessons.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg xs:rounded-xl p-2.5 xs:p-3 md:p-4 flex items-start gap-2 xs:gap-3">
          <ExclamationTriangleIcon className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-red-800 text-xs xs:text-sm md:text-base">
              Atenție: {studentsWithZeroLessons.length} {studentsWithZeroLessons.length === 1 ? 'elev' : 'elevi'} cu 0 lecții rămase!
            </p>
            <p className="text-[10px] xs:text-xs md:text-sm text-red-700 mt-0.5 xs:mt-1 break-words">
              {studentsWithZeroLessons.map(s => s.name).join(', ')} - Nu au achitat pentru lecții suplimentare.
            </p>
          </div>
        </div>
      )}
      
      {studentsWithLowLessons.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg xs:rounded-xl p-2.5 xs:p-3 md:p-4 flex items-start gap-2 xs:gap-3">
          <ExclamationTriangleIcon className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 text-amber-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-amber-800 text-xs xs:text-sm md:text-base">
              Atenție: {studentsWithLowLessons.length} {studentsWithLowLessons.length === 1 ? 'elev are' : 'elevi au'} puține lecții rămase
            </p>
            <p className="text-[10px] xs:text-xs md:text-sm text-amber-700 mt-0.5 xs:mt-1 break-words">
              {studentsWithLowLessons.map(s => {
                const minLessons = Math.min(...s.groups.map(g => g.remainingLessons))
                return `${s.name} (${minLessons})`
              }).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 xs:gap-3">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Caută după nume, telefon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 xs:pl-10 pr-3 xs:pr-4 py-2 xs:py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f] text-xs xs:text-sm"
              />
            </div>
          </div>

          {/* Group Filter */}
          <div className="flex gap-2 xs:gap-3">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="flex-1 sm:flex-none px-2.5 xs:px-3 py-2 xs:py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f] text-xs xs:text-sm"
            >
              <option value="">Toate grupele</option>
              {data?.groups?.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-2.5 xs:px-3 py-2 xs:py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f] text-xs xs:text-sm"
            >
              <option value="name">Nume</option>
              <option value="attendance">Prezență</option>
              <option value="absences">Absențe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-2 xs:space-y-3 md:space-y-4">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl p-6 xs:p-8 border border-gray-200 text-center">
            <UserIcon className="w-10 h-10 xs:w-12 xs:h-12 mx-auto text-gray-300 mb-2 xs:mb-3" />
            <p className="text-gray-500 text-xs xs:text-sm md:text-base">Nu ai niciun elev în grupe</p>
          </div>
        ) : (
          filteredStudents.map(student => {
            const hasZeroLessons = student.groups.some(g => g.remainingLessons === 0)
            const hasLowLessons = student.groups.some(g => g.remainingLessons > 0 && g.remainingLessons <= 2)
            
            return (
            <div 
              key={student.id} 
              className={`bg-white rounded-lg xs:rounded-xl border shadow-sm overflow-hidden ${
                hasZeroLessons ? 'border-red-300 bg-red-50/30' : 
                hasLowLessons ? 'border-amber-300 bg-amber-50/30' : 
                'border-gray-200'
              }`}
            >
              {/* Student Header - Clickable */}
              <div 
                className="p-3 xs:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
              >
                <div className="flex items-center justify-between gap-2 xs:gap-3">
                  <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
                    {/* Avatar */}
                    <div className="w-9 h-9 xs:w-10 xs:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#30919f] to-[#2a7d89] flex items-center justify-center flex-shrink-0">
                      {student.name ? (
                        <span className="text-sm xs:text-base md:text-lg font-bold text-white">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <UserIcon className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 text-white" />
                      )}
                    </div>
                    
                    {/* Basic Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-xs xs:text-sm md:text-base truncate">{student.name || 'Elev fără nume'}</h3>
                      <div className="flex flex-wrap items-center gap-x-2 xs:gap-x-3 gap-y-0.5 text-[10px] xs:text-xs text-gray-500 mt-0.5">
                        {student.parentPhone && (
                          <span className="flex items-center gap-0.5 xs:gap-1">
                            <PhoneIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                            <span className="hidden xs:inline">{student.parentPhone}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-0.5 xs:gap-1 text-[#30919f]">
                          <AcademicCapIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                          {student.groups.length} {student.groups.length === 1 ? 'grupă' : 'grupe'}
                        </span>
                      </div>
                      {/* Remaining lessons preview */}
                      {student.groups.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {student.groups.slice(0, 2).map(g => (
                            <span 
                              key={g.groupId} 
                              className={`text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 rounded font-medium ${
                                g.remainingLessons === 0 
                                  ? 'bg-red-100 text-red-700' 
                                  : g.remainingLessons <= 2 
                                    ? 'bg-amber-100 text-amber-700' 
                                    : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {g.remainingLessons} ore
                            </span>
                          ))}
                          {student.groups.length > 2 && (
                            <span className="text-[10px] xs:text-xs text-gray-400">+{student.groups.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats & Expand */}
                  <div className="flex items-center gap-1.5 xs:gap-2 flex-shrink-0">
                    {/* Attendance Badge */}
                    <div className={`px-1.5 xs:px-2 md:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs md:text-sm font-medium ${getAttendanceColor(student.attendanceRate)}`}>
                      {student.attendanceRate}%
                    </div>
                    
                    {/* Absences Badge - hidden on smallest screens */}
                    {student.totalAbsences > 0 && (
                      <div className="hidden xs:flex px-2 md:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs md:text-sm font-medium bg-red-100 text-red-700">
                        {student.totalAbsences} abs
                      </div>
                    )}

                    {/* Expand Icon */}
                    {expandedStudent === student.id ? (
                      <ChevronUpIcon className="w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedStudent === student.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-3 xs:p-4">
                  <div className="grid md:grid-cols-2 gap-4 xs:gap-5 md:gap-6">
                    {/* Contact Info */}
                    <div>
                      <h4 className="text-xs xs:text-sm font-semibold text-gray-700 mb-2 xs:mb-3">Informații Contact</h4>
                      <div className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm">
                        {student.parentName && (
                          <div className="flex items-start gap-1.5 xs:gap-2">
                            <span className="text-gray-500 min-w-[60px] xs:min-w-[80px]">Părinte:</span>
                            <span className="text-gray-900 break-words">{student.parentName}</span>
                          </div>
                        )}
                        {student.parentPhone && (
                          <div className="flex items-start gap-1.5 xs:gap-2">
                            <span className="text-gray-500 min-w-[60px] xs:min-w-[80px]">Telefon:</span>
                            <a href={`tel:${student.parentPhone}`} className="text-[#30919f] hover:underline">
                              {student.parentPhone}
                            </a>
                          </div>
                        )}
                        {student.parentEmail && (
                          <div className="flex items-start gap-1.5 xs:gap-2">
                            <span className="text-gray-500 min-w-[60px] xs:min-w-[80px]">Email:</span>
                            <a href={`mailto:${student.parentEmail}`} className="text-[#30919f] hover:underline break-all">
                              {student.parentEmail}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {student.notes && (
                        <div className="mt-3 xs:mt-4">
                          <h4 className="text-xs xs:text-sm font-semibold text-gray-700 mb-1.5 xs:mb-2">Notițe</h4>
                          <p className="text-xs xs:text-sm text-gray-600 bg-white p-2 xs:p-3 rounded-lg border border-gray-200">
                            {student.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Groups Info */}
                    <div>
                      <h4 className="text-xs xs:text-sm font-semibold text-gray-700 mb-2 xs:mb-3">Grupe & Ore</h4>
                      <div className="space-y-2 xs:space-y-3">
                        {student.groups.map(group => (
                          <div 
                            key={group.groupId} 
                            className="bg-white rounded-lg border border-gray-200 p-2.5 xs:p-3"
                          >
                            <div className="flex items-start justify-between mb-1.5 xs:mb-2">
                              <div className="min-w-0">
                                <Link 
                                  href={`/teacher/groups/${group.groupId}`}
                                  className="font-medium text-gray-900 hover:text-[#30919f] text-xs xs:text-sm truncate block"
                                >
                                  {group.groupName}
                                </Link>
                                <p className="text-[10px] xs:text-xs text-gray-500 truncate">{group.courseName}</p>
                              </div>
                              <div className={`px-1.5 xs:px-2 py-0.5 rounded text-[10px] xs:text-xs font-medium ${getAttendanceColor(group.attendanceRate)}`}>
                                {group.attendanceRate}%
                              </div>
                            </div>
                            
                            {group.scheduleDays?.length > 0 && (
                              <p className="text-[10px] xs:text-xs text-gray-500 mb-1.5 xs:mb-2">📅 {formatSchedule(group.scheduleDays, group.scheduleTime)}</p>
                            )}

                            <div className="grid grid-cols-2 gap-1.5 xs:gap-2 text-[10px] xs:text-xs">
                              <div className={`rounded p-1.5 xs:p-2 text-center ${
                                group.remainingLessons === 0 ? 'bg-red-100' :
                                group.remainingLessons <= 2 ? 'bg-amber-100' : 'bg-blue-50'
                              }`}>
                                <p className={`font-medium ${
                                  group.remainingLessons === 0 ? 'text-red-600' :
                                  group.remainingLessons <= 2 ? 'text-amber-600' : 'text-blue-600'
                                }`}>Ore</p>
                                <p className={`text-base xs:text-lg font-bold ${
                                  group.remainingLessons === 0 ? 'text-red-700' :
                                  group.remainingLessons <= 2 ? 'text-amber-700' : 'text-blue-700'
                                }`}>{group.remainingLessons}</p>
                              </div>
                              <div className="bg-red-50 rounded p-1.5 xs:p-2 text-center">
                                <p className="text-red-600 font-medium">Absențe</p>
                                <p className="text-base xs:text-lg font-bold text-red-700">{group.absences}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Overall Stats */}
                      <div className="mt-3 xs:mt-4 bg-gradient-to-r from-[#30919f] to-[#2a7d89] rounded-lg p-3 xs:p-4 text-white">
                        <h4 className="text-[10px] xs:text-xs font-semibold mb-2 xs:mb-3 opacity-90">Total General</h4>
                        <div className="grid grid-cols-3 gap-1.5 xs:gap-2 text-center">
                          <div>
                            <p className="text-lg xs:text-xl md:text-2xl font-bold">{student.totalPresent}</p>
                            <p className="text-[9px] xs:text-[10px] md:text-xs opacity-80">Prezențe</p>
                          </div>
                          <div>
                            <p className="text-lg xs:text-xl md:text-2xl font-bold">{student.totalAbsent}</p>
                            <p className="text-[9px] xs:text-[10px] md:text-xs opacity-80">Absențe</p>
                          </div>
                          <div>
                            <p className="text-lg xs:text-xl md:text-2xl font-bold">{student.totalAbsences}</p>
                            <p className="text-[9px] xs:text-[10px] md:text-xs opacity-80">Recuperat</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )})
        )}
      </div>
    </div>
  )
}
