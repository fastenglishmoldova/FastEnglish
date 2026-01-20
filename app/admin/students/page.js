export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import StudentsTable from '@/components/admin/StudentsTable'
import AddStudentButton from '@/components/admin/AddStudentButton'
import PermissionGuard from '@/components/admin/PermissionGuard'

export default async function StudentsPage() {
  return (
    <PermissionGuard permission="students.view">
      <StudentsPageContent />
    </PermissionGuard>
  )
}

async function StudentsPageContent() {
  const [students, groups] = await Promise.all([
    prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        groupStudents: {
          include: { group: { include: { course: true } } }
        }
      }
    }),
    prisma.group.findMany({
      orderBy: { name: 'asc' },
      include: { course: true }
    })
  ])

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Elevi</h1>
          <p className="text-sm xs:text-base text-gray-600">Gestionează elevii înregistrați</p>
        </div>
        <AddStudentButton />
      </div>

      <StudentsTable 
        students={JSON.parse(JSON.stringify(students))} 
        groups={JSON.parse(JSON.stringify(groups))} 
      />
    </div>
  )
}
