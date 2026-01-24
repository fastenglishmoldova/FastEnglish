export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import PermissionGuard from '@/components/admin/PermissionGuard'
import EnrollmentsClient from './EnrollmentsClient'

export default async function EnrollmentsPage() {
  return (
    <PermissionGuard permission="inscrieri.view">
      <EnrollmentsPageContent />
    </PermissionGuard>
  )
}

async function EnrollmentsPageContent() {
  // Înscrieri din modalul de pe homepage (cu curs specific)
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      course: true
    }
  })

  // Înscrieri din formularul /inscriere
  const inscrieri = await prisma.inscriere.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Transformă înscriererile din formular în același format
  const formattedInscrieri = inscrieri.map(i => ({
    id: i.id,
    studentName: i.numeCopil,
    studentAge: null,
    parentName: i.numeParinte,
    parentPhone: i.telefon,
    parentEmail: i.email,
    status: i.status,
    createdAt: i.createdAt,
    course: null,
    source: 'formular',
    clasa: i.clasa,
    cursuri: i.cursuri
  }))

  // Formatează enrollments să aibă source
  const formattedEnrollments = enrollments.map(e => ({
    id: e.id,
    studentName: e.studentName,
    studentAge: e.studentAge,
    parentName: e.parentName,
    parentPhone: e.parentPhone,
    parentEmail: e.parentEmail,
    status: e.status,
    createdAt: e.createdAt,
    course: e.course ? { title: e.course.title } : null,
    source: 'modal',
    clasa: null,
    cursuri: null
  }))

  // Combină și sortează după dată
  const allEnrollments = [...formattedEnrollments, ...formattedInscrieri]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // Stats
  const stats = {
    total: allEnrollments.length,
    noi: allEnrollments.filter(e => e.status === 'NOU' || e.status === 'NEW' || e.status === 'LEAD').length,
    contactati: allEnrollments.filter(e => e.status === 'CONTACTAT' || e.status === 'CONTACTED').length,
    confirmati: allEnrollments.filter(e => e.status === 'CONFIRMAT' || e.status === 'CONFIRMED' || e.status === 'PRIMA_LECTIE').length
  }

  return <EnrollmentsClient enrollments={allEnrollments} stats={stats} />
}
