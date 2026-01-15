'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import DeleteGroupButton from '@/components/admin/DeleteGroupButton'

// Helper pentru a formata orarul
const formatSchedule = (scheduleDays, scheduleTime) => {
  if (!scheduleDays || scheduleDays.length === 0) return null
  
  // Încearcă să parseze JSON (ore diferite per zi)
  let times = {}
  try {
    if (scheduleTime) {
      times = JSON.parse(scheduleTime)
    }
  } catch {
    // E string simplu - aceeași oră pentru toate zilele
  }
  
  // Verifică dacă toate orele sunt identice
  const uniqueTimes = [...new Set(Object.values(times))]
  const isSimple = typeof scheduleTime === 'string' && !scheduleTime.startsWith('{')
  
  if (isSimple || uniqueTimes.length <= 1) {
    // Format simplu: "Luni, Miercuri la 16:00"
    const time = isSimple ? scheduleTime : (uniqueTimes[0] || '')
    return `${scheduleDays.join(', ')}${time ? ` la ${time}` : ''}`
  }
  
  // Format detaliat: "Luni 16:00, Miercuri 18:00"
  return scheduleDays.map(day => `${day} ${times[day] || ''}`).join(', ')
}

// Mapare zi săptămână JS -> română
const dayMapping = {
  0: 'Duminică',
  1: 'Luni',
  2: 'Marți',
  3: 'Miercuri',
  4: 'Joi',
  5: 'Vineri',
  6: 'Sâmbătă'
}

const allDays = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']

export default function GroupsPage() {
  const [groups, setGroups] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filtre
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [dateFilter, setDateFilter] = useState('all') // 'all', 'today', 'custom'
  const [customDate, setCustomDate] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/groups')
      const data = await res.json()
      setGroups(data.groups || [])
      setTeachers(data.teachers || [])
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrare grupe
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      // Filtru profesor
      if (selectedTeacher && group.teacherId !== selectedTeacher) {
        return false
      }

      // Filtru zi
      if (selectedDay && (!group.scheduleDays || !group.scheduleDays.includes(selectedDay))) {
        return false
      }

      // Filtru dată
      if (dateFilter === 'today') {
        const today = dayMapping[new Date().getDay()]
        if (!group.scheduleDays || !group.scheduleDays.includes(today)) {
          return false
        }
      } else if (dateFilter === 'custom' && customDate) {
        const selectedDate = new Date(customDate)
        const dayName = dayMapping[selectedDate.getDay()]
        if (!group.scheduleDays || !group.scheduleDays.includes(dayName)) {
          return false
        }
      }

      // Filtru search (elev, profesor, zi, nume grupă, curs)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const teacherName = (group.teacher?.name || group.teacher?.email || '').toLowerCase()
        const groupName = group.name.toLowerCase()
        const courseName = (group.course?.title || '').toLowerCase()
        const days = (group.scheduleDays || []).join(' ').toLowerCase()
        
        // Caută și în elevii grupei
        const studentNames = (group.groupStudents || [])
          .map(gs => gs.student?.fullName?.toLowerCase() || '')
          .join(' ')

        if (!teacherName.includes(query) && 
            !groupName.includes(query) && 
            !courseName.includes(query) &&
            !days.includes(query) &&
            !studentNames.includes(query)) {
          return false
        }
      }

      return true
    })
  }, [groups, selectedTeacher, selectedDay, dateFilter, customDate, searchQuery])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedTeacher('')
    setSelectedDay('')
    setDateFilter('all')
    setCustomDate('')
  }

  const hasActiveFilters = searchQuery || selectedTeacher || selectedDay || dateFilter !== 'all'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Grupe</h1>
          <p className="text-sm xs:text-base text-gray-600">Gestionează grupele de cursuri</p>
        </div>
        <Link
          href="/admin/groups/new"
          className="px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm xs:text-base font-medium hover:bg-indigo-700 transition-colors text-center"
        >
          + Adaugă grupă
        </Link>
      </div>

      {/* Filtre */}
      <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-3 xs:p-4">
        <div className="flex flex-col gap-3 xs:gap-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Caută după elev, profesor, grupă, curs, zi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filtre dropdown */}
          <div className="flex flex-wrap gap-2 xs:gap-3">
            {/* Profesor */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Profesor</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
              >
                <option value="">Toți profesorii</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name || teacher.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Zi */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Zi săptămână</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[130px]"
              >
                <option value="">Toate zilele</option>
                {allDays.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Filtru dată */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Dată</label>
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value)
                  if (e.target.value !== 'custom') setCustomDate('')
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[120px]"
              >
                <option value="all">Toate</option>
                <option value="today">Azi ({dayMapping[new Date().getDay()]})</option>
                <option value="custom">Alege data...</option>
              </select>
            </div>

            {/* Data custom */}
            {dateFilter === 'custom' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {/* Reset filtre */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Resetează filtrele
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info rezultate */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {filteredGroups.length} {filteredGroups.length === 1 ? 'grupă găsită' : 'grupe găsite'}
              {dateFilter === 'today' && ` pentru azi (${dayMapping[new Date().getDay()]})`}
              {dateFilter === 'custom' && customDate && ` pentru ${new Date(customDate).toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}`}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-3 xs:gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-8 xs:p-12 text-center text-gray-500 text-sm xs:text-base">
            {hasActiveFilters ? 'Nu există grupe care să corespundă filtrelor.' : 'Nu există grupe. Adaugă prima grupă!'}
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-3 xs:p-4 md:p-6">
                <div className="flex items-start justify-between gap-2 mb-3 xs:mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm xs:text-base md:text-lg font-semibold text-gray-900 truncate">{group.name}</h3>
                    <p className="text-xs xs:text-sm text-indigo-600 truncate">{group.course?.title}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 xs:px-2.5 py-0.5 rounded-full text-[10px] xs:text-xs font-medium flex-shrink-0 ${
                    group.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {group.active ? 'Activ' : 'Inactiv'}
                  </span>
                </div>

                <div className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm">
                  <div className="flex items-center gap-1.5 xs:gap-2 text-gray-600">
                    <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="truncate">Profesor: {group.teacher?.name || group.teacher?.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 xs:gap-2 text-gray-600">
                    <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{group.groupStudents?.length || 0} elevi</span>
                  </div>
                  {group.scheduleDays?.length > 0 && (
                    <div className="flex items-start gap-1.5 xs:gap-2 text-gray-600">
                      <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="break-words">{formatSchedule(group.scheduleDays, group.scheduleTime)}</span>
                    </div>
                  )}
                  {group.locationType && (
                    <div className="flex items-center gap-1.5 xs:gap-2 text-gray-600">
                      <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{group.locationType === 'online' ? 'Online' : 'Offline'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-3 xs:px-4 md:px-6 py-2.5 xs:py-3 bg-gray-50 border-t flex gap-2 xs:gap-3">
                <Link
                  href={`/admin/groups/${group.id}`}
                  className="text-indigo-600 hover:text-indigo-900 text-xs xs:text-sm font-medium"
                >
                  Editează
                </Link>
                <Link
                  href={`/admin/groups/${group.id}/students`}
                  className="text-indigo-600 hover:text-indigo-900 text-xs xs:text-sm font-medium"
                >
                  Elevi
                </Link>
                <DeleteGroupButton id={group.id} name={group.name} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
