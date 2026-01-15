import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import DeleteTeacherButton from '@/components/admin/DeleteTeacherButton'

export default async function TeachersPage() {
  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    orderBy: { createdAt: 'desc' },
    include: {
      teacherGroups: {
        include: { 
          course: true,
          groupStudents: true
        }
      }
    }
  })

  // Calculate stats for each teacher
  const teachersWithStats = teachers.map(teacher => {
    let totalStudents = 0
    let activeStudents = 0
    let leftStudents = 0
    
    for (const group of teacher.teacherGroups) {
      totalStudents += group.groupStudents.length
      activeStudents += group.groupStudents.filter(gs => gs.status === 'ACTIVE' || !gs.status).length
      leftStudents += group.groupStudents.filter(gs => gs.status === 'LEFT').length
    }
    
    return {
      ...teacher,
      totalStudents,
      activeStudents,
      leftStudents
    }
  })

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3">
        <div>
          <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">Profesori</h1>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600">Gestionează conturile profesorilor</p>
        </div>
        <Link
          href="/admin/teachers/new"
          className="px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 bg-indigo-600 text-white rounded-lg text-xs xs:text-sm sm:text-base font-medium hover:bg-indigo-700 transition-colors text-center"
        >
          + Adaugă profesor
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grupe</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Elevi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachersWithStats.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Nu există profesori. Adaugă primul profesor!
                </td>
              </tr>
            ) : (
              teachersWithStats.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {teacher.image ? (
                        <Image
                          src={teacher.image}
                          alt={teacher.name || 'Profesor'}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {teacher.name?.charAt(0) || teacher.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <p className="font-medium text-gray-900">{teacher.name || 'Fără nume'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{teacher.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.teacherGroups.length > 0 ? (
                        teacher.teacherGroups.map((group) => (
                          <span key={group.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-800">
                            {group.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Fără grupe</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {teacher.activeStudents} activi
                      </span>
                      {teacher.leftStudents > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          {teacher.leftStudents} plecați
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      teacher.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {teacher.active ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/teachers/${teacher.id}`}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        <ChartBarIcon className="w-4 h-4" />
                        Statistici
                      </Link>
                      <DeleteTeacherButton id={teacher.id} name={teacher.name || teacher.email} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-2 xs:space-y-3 sm:space-y-4">
        {teachersWithStats.length === 0 ? (
          <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-6 xs:p-8 sm:p-12 text-center text-gray-500 text-xs xs:text-sm sm:text-base">
            Nu există profesori. Adaugă primul profesor!
          </div>
        ) : (
          teachersWithStats.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-2.5 xs:p-3 sm:p-4 space-y-2 xs:space-y-3">
              {/* Teacher Header */}
              <div className="flex items-center gap-2">
                {teacher.image ? (
                  <Image
                    src={teacher.image}
                    alt={teacher.name || 'Profesor'}
                    width={40}
                    height={40}
                    className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-xs xs:text-sm sm:text-base">
                      {teacher.name?.charAt(0) || teacher.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-xs xs:text-sm sm:text-base truncate">
                    {teacher.name || 'Fără nume'}
                  </h3>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 truncate">{teacher.email}</p>
                </div>
                <span className={`inline-flex items-center px-1.5 xs:px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-medium flex-shrink-0 ${
                  teacher.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {teacher.active ? 'Activ' : 'Inactiv'}
                </span>
              </div>

              {/* Students Stats */}
              <div className="flex items-center gap-1.5 xs:gap-2 flex-wrap">
                <span className="text-[10px] xs:text-xs text-gray-500">Elevi:</span>
                <span className="inline-flex items-center px-1.5 xs:px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-medium bg-green-100 text-green-800">
                  {teacher.activeStudents} activi
                </span>
                {teacher.leftStudents > 0 && (
                  <span className="inline-flex items-center px-1.5 xs:px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-medium bg-red-100 text-red-700">
                    {teacher.leftStudents} plecați
                  </span>
                )}
              </div>

              {/* Groups */}
              {teacher.teacherGroups.length > 0 && (
                <div>
                  <span className="text-[10px] xs:text-xs text-gray-500 block mb-1 xs:mb-1.5">Grupe:</span>
                  <div className="flex flex-wrap gap-1 xs:gap-1.5">
                    {teacher.teacherGroups.map((group) => (
                      <span key={group.id} className="inline-flex items-center px-1.5 xs:px-2 py-0.5 rounded text-[10px] xs:text-xs bg-indigo-100 text-indigo-800">
                        {group.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-1.5 xs:gap-2">
                <Link
                  href={`/admin/teachers/${teacher.id}`}
                  className="flex-1 flex items-center justify-center gap-1 xs:gap-1.5 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 bg-indigo-600 text-white rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <ChartBarIcon className="w-3 h-3 xs:w-4 xs:h-4" />
                  <span>Statistici</span>
                </Link>
                <DeleteTeacherButton 
                  id={teacher.id} 
                  name={teacher.name || teacher.email}
                  className="px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 bg-red-600 text-white rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium hover:bg-red-700 transition-colors"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
