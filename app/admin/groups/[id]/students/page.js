import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import GroupStudentsManager from '@/components/admin/GroupStudentsManager'

export default async function GroupStudentsPage({ params }) {
  const { id } = await params
  
  const [group, allStudents] = await Promise.all([
    prisma.group.findUnique({
      where: { id },
      include: {
        course: true,
        groupStudents: {
          include: { 
            student: true,
            payments: {
              orderBy: { paymentDate: 'desc' }
            }
          }
        }
      }
    }),
    prisma.student.findMany({ orderBy: { fullName: 'asc' } })
  ])

  if (!group) {
    notFound()
  }

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">Elevi în grupă</h1>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600">{group.name} - {group.course?.title}</p>
      </div>

      <GroupStudentsManager 
        group={JSON.parse(JSON.stringify(group))}
        allStudents={JSON.parse(JSON.stringify(allStudents))}
      />
    </div>
  )
}
