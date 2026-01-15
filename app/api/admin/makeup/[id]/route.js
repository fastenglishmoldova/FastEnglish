import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch specific makeup lesson details
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const makeupLesson = await prisma.makeupLesson.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        group: {
          include: {
            course: true,
            groupStudents: {
              include: {
                student: true
              }
            }
          }
        },
        students: {
          include: {
            student: true
          }
        }
      }
    })

    if (!makeupLesson) {
      return NextResponse.json({ error: 'Makeup lesson not found' }, { status: 404 })
    }

    return NextResponse.json(makeupLesson)
  } catch (error) {
    console.error('Error fetching makeup lesson:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE - Delete a makeup lesson (admin only)
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const makeupLesson = await prisma.makeupLesson.findUnique({
      where: { id }
    })

    if (!makeupLesson) {
      return NextResponse.json({ error: 'Makeup lesson not found' }, { status: 404 })
    }

    // Delete all students first
    await prisma.makeupLessonStudent.deleteMany({
      where: { makeupLessonId: id }
    })

    await prisma.makeupLesson.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting makeup lesson:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
