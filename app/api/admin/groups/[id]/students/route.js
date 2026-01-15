import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function POST(request, { params }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()

    const { studentId, lessonsRemaining } = body

    // Check if already assigned
    const existing = await prisma.groupStudent.findUnique({
      where: { groupId_studentId: { groupId: id, studentId } }
    })

    if (existing) {
      return NextResponse.json({ error: 'Elevul este deja în această grupă' }, { status: 400 })
    }

    const groupStudent = await prisma.groupStudent.create({
      data: {
        groupId: id,
        studentId,
        lessonsRemaining: lessonsRemaining || 0
      }
    })

    return NextResponse.json(groupStudent, { status: 201 })
  } catch (error) {
    console.error('Error adding student to group:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to add student to group' }, { status: 500 })
  }
}
