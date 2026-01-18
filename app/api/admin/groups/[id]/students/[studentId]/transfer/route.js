import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function POST(request, { params }) {
  try {
    await requireAdmin()
    
    // Check permission
    const permCheck = await checkPermission('groups.students.transfer')
    if (!permCheck.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să transferi elevi' }, { status: 403 })
    }
    
    const { id: groupId, studentId: groupStudentId } = await params
    const { targetGroupId, transferLessons, transferAbsences } = await request.json()

    if (!targetGroupId) {
      return NextResponse.json({ error: 'Grupa destinație este obligatorie' }, { status: 400 })
    }

    // Verifică că grupă sursă există
    const sourceGroup = await prisma.group.findUnique({
      where: { id: groupId }
    })

    if (!sourceGroup) {
      return NextResponse.json({ error: 'Grupa sursă nu există' }, { status: 404 })
    }

    // Verifică că elevul este în grupa sursă
    const groupStudent = await prisma.groupStudent.findUnique({
      where: { id: groupStudentId },
      include: { student: true }
    })

    if (!groupStudent || groupStudent.groupId !== groupId) {
      return NextResponse.json({ error: 'Elevul nu este în această grupă' }, { status: 404 })
    }

    // Verifică că grupa destinație există și este activă
    const targetGroup = await prisma.group.findUnique({
      where: { id: targetGroupId }
    })

    if (!targetGroup) {
      return NextResponse.json({ error: 'Grupa destinație nu există' }, { status: 404 })
    }

    // Verifică dacă elevul este deja în grupa destinație
    const existingEnrollment = await prisma.groupStudent.findFirst({
      where: {
        groupId: targetGroupId,
        studentId: groupStudent.studentId
      }
    })

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Elevul este deja în grupa destinație' }, { status: 400 })
    }

    // Efectuăm transferul
    // 1. Marcăm elevul în grupa veche ca "TRANSFERRED" (sau îl păstrăm cu status LEFT)
    await prisma.groupStudent.update({
      where: { id: groupStudentId },
      data: {
        status: 'LEFT',
        statusNote: `Transferat în ${targetGroup.name} la ${new Date().toLocaleDateString('ro-RO')}`
      }
    })

    // 2. Creăm înregistrarea în grupa nouă
    const newGroupStudent = await prisma.groupStudent.create({
      data: {
        groupId: targetGroupId,
        studentId: groupStudent.studentId,
        lessonsRemaining: transferLessons ? groupStudent.lessonsRemaining : 0,
        absences: transferAbsences ? groupStudent.absences : 0,
        status: 'ACTIVE',
        statusNote: `Transferat din ${sourceGroup.name} la ${new Date().toLocaleDateString('ro-RO')}`
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `${groupStudent.student.fullName} a fost transferat în ${targetGroup.name}`,
      newGroupStudentId: newGroupStudent.id
    })

  } catch (error) {
    console.error('Error transferring student:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Eroare la transferul elevului' }, { status: 500 })
  }
}
