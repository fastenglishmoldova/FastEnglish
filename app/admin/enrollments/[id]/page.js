export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EnrollmentDetailClient from './EnrollmentDetailClient'

export default async function EnrollmentDetailPage({ params }) {
  const { id } = await params

  // Încearcă mai întâi să găsească în Inscriere (formular)
  let enrollment = await prisma.inscriere.findUnique({
    where: { id },
    include: {
      inscriereNotes: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  let source = 'formular'

  // Dacă nu există, caută în Enrollment (modal)
  if (!enrollment) {
    enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: true,
        enrollmentNotes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    source = 'modal'
  }

  if (!enrollment) {
    notFound()
  }

  // Transformă în format unificat
  const formattedEnrollment = source === 'formular' ? {
    id: enrollment.id,
    studentName: enrollment.numeCopil,
    studentAge: null,
    parentName: enrollment.numeParinte,
    parentPhone: enrollment.telefon,
    parentEmail: enrollment.email,
    city: null,
    observations: enrollment.mesaj,
    status: enrollment.status,
    notes: enrollment.notes,
    enrollmentNotes: enrollment.inscriereNotes || [],
    createdAt: enrollment.createdAt,
    updatedAt: enrollment.updatedAt,
    course: null,
    source: 'formular',
    clasa: enrollment.clasa,
    cursuri: enrollment.cursuri
  } : {
    ...enrollment,
    status: enrollment.status === 'NEW' ? 'NOU' : 
            enrollment.status === 'CONTACTED' ? 'CONTACTAT' : 
            enrollment.status === 'CONFIRMED' ? 'CONFIRMAT' : 
            enrollment.status === 'REJECTED' ? 'RESPINS' : enrollment.status,
    enrollmentNotes: enrollment.enrollmentNotes || [],
    source: 'modal',
    clasa: null,
    cursuri: null
  }

  // Marchează automat ca contactat când se deschide (dacă e nou)
  if (formattedEnrollment.status === 'NOU' || formattedEnrollment.status === 'NEW') {
    if (source === 'formular') {
      await prisma.inscriere.update({
        where: { id },
        data: { status: 'CONTACTAT' }
      })
    } else {
      await prisma.enrollment.update({
        where: { id },
        data: { status: 'CONTACTED' }
      })
    }
    formattedEnrollment.status = 'CONTACTAT'
  }

  return <EnrollmentDetailClient enrollment={JSON.parse(JSON.stringify(formattedEnrollment))} />
}
