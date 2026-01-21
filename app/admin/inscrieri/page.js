export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import PermissionGuard from '@/components/admin/PermissionGuard'
import InscrieriClient from './InscrieriClient'

export default async function InscrieriPage() {
  return (
    <PermissionGuard permission="inscrieri.view">
      <InscrieriPageContent />
    </PermissionGuard>
  )
}

async function InscrieriPageContent() {
  const inscrieri = await prisma.inscriere.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Get courses for mapping IDs to names
  const courses = await prisma.course.findMany({
    select: { id: true, title: true }
  })
  // Serialize dates for client component
  const serializedInscrieri = inscrieri.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString()
  }))
  return <InscrieriClient initialInscrieri={inscrieri} initialCourses={courses} />
}

