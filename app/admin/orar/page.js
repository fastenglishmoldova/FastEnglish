'use client'

import { useState, useEffect, useMemo } from 'react'

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

// Sortează zilele începând de la ziua curentă
const getSortedDays = () => {
  const today = new Date().getDay() // 0 = Duminică, 1 = Luni, etc.
  const todayName = dayMapping[today]
  const todayIndex = allDays.indexOf(todayName)
  
  // Reordonează zilele să înceapă cu azi
  return [...allDays.slice(todayIndex), ...allDays.slice(0, todayIndex)]
}

// Parse scheduleTime pentru a obține ora pentru o zi specifică
const getTimeForDay = (scheduleTime, day) => {
  if (!scheduleTime) return null
  try {
    const parsed = JSON.parse(scheduleTime)
    if (typeof parsed === 'object') return parsed[day] || null
  } catch {
    // E string simplu - aceeași oră pentru toate zilele
    return scheduleTime
  }
  return null
}

export default function OrarPage() {
  const [groups, setGroups] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/groups')
      const data = await res.json()
      setGroups(data.groups || [])
      setBranches(data.branches || [])
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  // Generează orarul sortat pe zile (azi, mâine, etc.)
  const schedule = useMemo(() => {
    const sortedDays = getSortedDays()
    const todayName = dayMapping[new Date().getDay()]
    const tomorrowIndex = (new Date().getDay() + 1) % 7
    const tomorrowName = dayMapping[tomorrowIndex]
    
    const scheduleByDay = {}
    
    sortedDays.forEach(day => {
      scheduleByDay[day] = []
    })
    
    // Filtrăm grupele active
    const activeGroups = groups.filter(g => g.active)
    
    // Populăm orarul
    activeGroups.forEach(group => {
      if (!group.scheduleDays) return
      
      // Filtru filială
      if (selectedBranch) {
        if (selectedBranch === 'none' && group.branchId) return
        if (selectedBranch !== 'none' && group.branchId !== selectedBranch) return
      }
      
      group.scheduleDays.forEach(day => {
        if (scheduleByDay[day]) {
          const time = getTimeForDay(group.scheduleTime, day)
          scheduleByDay[day].push({
            id: group.id,
            name: group.name,
            time: time || '-',
            branch: group.branch?.name || '-',
            teacher: group.teacher?.name || group.teacher?.email || '-',
            room: group.locationDetails || '-',
            locationType: group.locationType,
            course: group.course?.title || '-'
          })
        }
      })
    })
    
    // Sortăm fiecare zi după oră
    Object.keys(scheduleByDay).forEach(day => {
      scheduleByDay[day].sort((a, b) => {
        if (!a.time || a.time === '-') return 1
        if (!b.time || b.time === '-') return -1
        return a.time.localeCompare(b.time)
      })
    })
    
    return { scheduleByDay, todayName, tomorrowName, sortedDays }
  }, [groups, selectedBranch])

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
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Orar</h1>
          <p className="text-sm xs:text-base text-gray-600">Vizualizează orarul tuturor grupelor</p>
        </div>
        
        {/* Filtru filială */}
        {branches.length > 0 && (
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
            >
              <option value="">Toate filialele</option>
              <option value="none">Fără filială</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Orar pe zile */}
      <div className="space-y-4">
        {schedule.sortedDays.map((day, index) => {
          const daySchedule = schedule.scheduleByDay[day]
          const isToday = day === schedule.todayName
          const isTomorrow = day === schedule.tomorrowName
          
          if (daySchedule.length === 0) return null
          
          return (
            <div 
              key={day} 
              className={`bg-white rounded-xl xs:rounded-2xl shadow-sm border overflow-hidden ${
                isToday ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-100'
              }`}
            >
              {/* Header zi */}
              <div className={`px-4 xs:px-6 py-3 border-b ${
                isToday 
                  ? 'bg-indigo-50 border-indigo-100' 
                  : isTomorrow 
                    ? 'bg-amber-50 border-amber-100' 
                    : 'bg-gray-50 border-gray-100'
              }`}>
                <div className="flex items-center gap-2">
                  <h2 className={`text-base xs:text-lg font-semibold ${
                    isToday ? 'text-indigo-900' : isTomorrow ? 'text-amber-900' : 'text-gray-900'
                  }`}>
                    {day}
                  </h2>
                  {isToday && (
                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-medium rounded-full">
                      Azi
                    </span>
                  )}
                  {isTomorrow && (
                    <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
                      Mâine
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    ({daySchedule.length} {daySchedule.length === 1 ? 'grupă' : 'grupe'})
                  </span>
                </div>
              </div>
              
              {/* Tabel orar */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 xs:px-6 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Ora
                      </th>
                      <th className="px-4 xs:px-6 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grupă
                      </th>
                      <th className="px-4 xs:px-6 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Filială
                      </th>
                      <th className="px-4 xs:px-6 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Profesor
                      </th>
                      <th className="px-4 xs:px-6 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Sală/Link
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {daySchedule.map((item, idx) => (
                      <tr key={`${item.id}-${idx}`} className="hover:bg-gray-50">
                        <td className="px-4 xs:px-6 py-3 whitespace-nowrap">
                          <span className="text-sm font-semibold text-indigo-600">
                            {item.time}
                          </span>
                        </td>
                        <td className="px-4 xs:px-6 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500 sm:hidden">
                              {item.branch} • {item.teacher}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 xs:px-6 py-3 whitespace-nowrap hidden sm:table-cell">
                          {item.branch !== '-' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {item.branch}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 xs:px-6 py-3 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                          {item.teacher}
                        </td>
                        <td className="px-4 xs:px-6 py-3 whitespace-nowrap hidden lg:table-cell">
                          <div className="flex items-center gap-1.5">
                            {item.locationType === 'online' ? (
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                            <span className="text-sm text-gray-600">{item.room}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
        
        {/* Mesaj dacă nu sunt grupe */}
        {schedule.sortedDays.every(day => schedule.scheduleByDay[day].length === 0) && (
          <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-8 xs:p-12 text-center text-gray-500">
            Nu există grupe programate{selectedBranch ? ' pentru această filială' : ''}.
          </div>
        )}
      </div>
    </div>
  )
}
