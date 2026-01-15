import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function DELETE(request, { params }) {
  try {
    await requireAdmin()
    const { groupStudentId } = await params

    await prisma.groupStudent.delete({ where: { id: groupStudentId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to remove student from group' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAdmin()
    const { groupStudentId } = await params
    const body = await request.json()
    const { addLessons, addAbsences, status, statusNote } = body

    // Get current groupStudent
    const groupStudent = await prisma.groupStudent.findUnique({
      where: { id: groupStudentId }
    })

    if (!groupStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Build update data
    const updateData = {}

    // Handle lessons update
    if (addLessons !== undefined) {
      const newLessonsRemaining = groupStudent.lessonsRemaining + addLessons
      updateData.lessonsRemaining = newLessonsRemaining
    }

    // Handle absences update
    if (addAbsences !== undefined) {
      const newAbsences = Math.max(0, (groupStudent.absences || 0) + addAbsences)
      updateData.absences = newAbsences
    }

    // Handle status update
    if (status !== undefined) {
      updateData.status = status
      updateData.statusChangedAt = new Date()
      if (statusNote !== undefined) {
        updateData.statusNote = statusNote
      }
    }

    // Update
    const updated = await prisma.groupStudent.update({
      where: { id: groupStudentId },
      data: updateData
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Error updating group student:', error)
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}
