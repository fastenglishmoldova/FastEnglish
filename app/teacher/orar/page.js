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

export default function TeacherOrarPage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/teacher/groups')
      const data = await res.json()
      setGroups(data.groups || [])
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
      
      group.scheduleDays.forEach(day => {
        if (scheduleByDay[day]) {
          const time = getTimeForDay(group.scheduleTime, day)
          scheduleByDay[day].push({
            id: group.id,
            name: group.name,
            time: time || '-',
            branch: group.branch?.name || '-',
            room: group.locationDetails || '-',
            locationType: group.locationType,
            course: group.course?.title || '-',
            studentsCount: group.groupStudents?.filter(gs => gs.status === 'ACTIVE')?.length || 0
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
  }, [groups])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      <div>
        <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Orarul Meu</h1>
        <p className="text-sm xs:text-base text-gray-600">Vizualizează orarul grupelor tale</p>
      </div>

      {/* Orar pe zile */}
      <div className="space-y-6">
        {schedule.sortedDays.map((day) => {
          const daySchedule = schedule.scheduleByDay[day]
          const isToday = day === schedule.todayName
          const isTomorrow = day === schedule.tomorrowName
          
          if (daySchedule.length === 0) return null
          
          return (
            <div key={day} className="space-y-3">
              {/* Header zi */}
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-semibold ${
                  isToday ? 'text-indigo-700' : isTomorrow ? 'text-amber-700' : 'text-gray-800'
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
                  ({daySchedule.length} {daySchedule.length === 1 ? 'lecție' : 'lecții'})
                </span>
              </div>

              {/* Card-uri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {daySchedule.map((item, idx) => (
                  <div 
                    key={`${item.id}-${idx}`} 
                    className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow ${
                      isToday ? 'border-indigo-200' : 'border-gray-100'
                    }`}
                  >
                    {/* Header card - oră și filială */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-indigo-600">
                        {item.time}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.branch !== '-' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {item.branch}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.studentsCount} elevi
                        </span>
                      </div>
                    </div>

                    {/* Numele grupei */}
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{item.course}</p>

                    {/* Locație */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
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
                      <span className="truncate">{item.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        
        {/* Mesaj dacă nu sunt grupe */}
        {schedule.sortedDays.every(day => schedule.scheduleByDay[day].length === 0) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 xs:p-12 text-center text-gray-500">
            Nu ai grupe programate.
          </div>
        )}
      </div>
    </div>
  )
}
