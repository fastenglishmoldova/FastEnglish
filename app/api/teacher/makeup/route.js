import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch students with absences OR scheduled makeup lessons
export async function GET(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const listMakeups = searchParams.get('list') === 'true'

  try {
    // If list=true, return scheduled makeup lessons
    if (listMakeups) {
      const whereLesson = {
        status: { not: 'CANCELED' } // Exclude cancelled lessons
      }
      
      // Filter by teacher unless admin
      if (!['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
        whereLesson.teacherId = session.user.id
      }

      const makeupLessons = await prisma.makeupLesson.findMany({
        where: whereLesson,
        include: {
          students: {
            include: {
              student: true
            }
          },
          group: {
            include: {
              course: true
            }
          },
          teacher: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { scheduledAt: 'asc' }
      })

      return NextResponse.json(makeupLessons)
    }

    // Otherwise, return students with absences
    const where = {
      absences: { gt: 0 }
    }

    // Filter by teacher's groups unless admin
    if (!['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
      where.group = { teacherId: session.user.id }
    }

    const studentsWithAbsences = await prisma.groupStudent.findMany({
      where,
      include: {
        student: true,
        group: {
          include: {
            course: true,
            teacher: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { absences: 'desc' }
    })

    return NextResponse.json(studentsWithAbsences)
  } catch (error) {
    console.error('Error fetching makeup data:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Create a makeup lesson (with optional initial students)
export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { groupId, scheduledAt, notes, studentIds } = await request.json()

    // Verify the group exists and teacher has access
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.teacherId !== session.user.id && !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create makeup lesson
    // Parse the scheduledAt - frontend sends format like "2025-01-24T10:00:00"
    // Store the time exactly as the user entered it (no timezone conversion)
    const [datePart, timePart] = scheduledAt.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes] = (timePart || '10:00').split(':').map(Number)
    
    // Create date with exact hours as entered by user
    const scheduledDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0))

    const makeupLesson = await prisma.makeupLesson.create({
      data: {
        groupId,
        teacherId: session.user.id,
        scheduledAt: scheduledDate,
        notes,
        status: 'SCHEDULED',
        // Add students if provided
        students: studentIds && studentIds.length > 0 ? {
          create: studentIds.map(studentId => ({
            studentId,
            status: 'PENDING'
          }))
        } : undefined
      },
      include: {
        students: {
          include: {
            student: true
          }
        },
        group: {
          include: { course: true }
        }
      }
    })

    return NextResponse.json(makeupLesson, { status: 201 })
  } catch (error) {
    console.error('Error creating makeup lesson:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
