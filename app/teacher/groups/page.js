import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { AcademicCapIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

// Helper pentru formatarea programului
const formatSchedule = (scheduleDays, scheduleTime) => {
  if (!scheduleDays || scheduleDays.length === 0) return 'Program nestabilit'
  
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
  
  // Ore diferite per zi
  return scheduleDays.map(day => `${day} ${times[day] || ''}`).join(', ')
}

export default async function TeacherGroupsPage() {
  const session = await getServerSession(authOptions)

  const groups = await prisma.group.findMany({
    where: { teacherId: session.user.id },
    include: {
      course: true,
      groupStudents: {
        include: { student: true }
      },
      lessonSessions: {
        orderBy: { date: 'desc' },
        take: 1
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-4 xs:space-y-5 md:space-y-6">
      <div>
        <h1 className="text-xl xs:text-2xl md:text-3xl font-bold text-gray-900">Grupele Mele</h1>
        <p className="text-gray-600 mt-1 xs:mt-2 text-xs xs:text-sm md:text-base">Administrează grupele și elevii tăi</p>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 xs:p-10 md:p-12 text-center">
          <p className="text-gray-500 text-sm xs:text-base">Nu ai grupe asignate încă.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 md:gap-6">
          {groups.map(group => (
            <Link
              key={group.id}
              href={`/teacher/groups/${group.id}`}
              className="bg-white rounded-xl shadow-sm p-4 xs:p-5 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3 xs:mb-4">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-base xs:text-lg font-bold text-gray-900 truncate">{group.name}</h3>
                  <p className="text-xs xs:text-sm text-gray-500 truncate">{group.course.title}</p>
                </div>
                <span className={`px-2 py-1 text-[10px] xs:text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${
                  group.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {group.active ? 'Activ' : 'Inactiv'}
                </span>
              </div>

              <div className="space-y-1.5 xs:space-y-2 mb-3 xs:mb-4">
                <div className="flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm text-gray-600">
                  <AcademicCapIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" />
                  <span className="truncate">
                    {group.groupStudents.filter(gs => gs.status === 'ACTIVE' || !gs.status).length} elevi activi
                    {group.groupStudents.filter(gs => gs.status && gs.status !== 'ACTIVE').length > 0 && (
                      <span className="text-gray-400 ml-1">
                        (+{group.groupStudents.filter(gs => gs.status && gs.status !== 'ACTIVE').length} inactivi)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm text-gray-600">
                  <CalendarDaysIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" />
                  <span className="truncate">{formatSchedule(group.scheduleDays, group.scheduleTime)}</span>
                </div>
              </div>

              {/* Students preview - only active */}
              {group.groupStudents.filter(gs => gs.status === 'ACTIVE' || !gs.status).length > 0 && (
                <div className="border-t border-gray-100 pt-3 xs:pt-4">
                  <p className="text-[10px] xs:text-xs text-gray-500 mb-1.5 xs:mb-2">Elevi activi:</p>
                  <div className="flex flex-wrap gap-1">
                    {group.groupStudents.filter(gs => gs.status === 'ACTIVE' || !gs.status).slice(0, 5).map(gs => (
                      <span
                        key={gs.student?.id || gs.id}
                        className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-gray-100 text-gray-600 text-[10px] xs:text-xs rounded"
                      >
                        {gs.student?.fullName?.split(' ')[0] || 'Elev'}
                      </span>
                    ))}
                    {group.groupStudents.filter(gs => gs.status === 'ACTIVE' || !gs.status).length > 5 && (
                      <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-gray-100 text-gray-600 text-[10px] xs:text-xs rounded">
                        +{group.groupStudents.filter(gs => gs.status === 'ACTIVE' || !gs.status).length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-100">
                <span className="text-teal-600 text-xs xs:text-sm font-medium">
                  Deschide grupul →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
