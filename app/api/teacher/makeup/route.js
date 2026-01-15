import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch students with absences OR scheduled makeup lessons
export async function GET(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'MANAGER', 'ADMIN'].includes(session.user.role)) {
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
      
      // Filter by teacher unless admin/manager
      if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
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

    // Filter by teacher's groups unless admin/manager
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
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
  
  if (!session || !['TEACHER', 'MANAGER', 'ADMIN'].includes(session.user.role)) {
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

    if (group.teacherId !== session.user.id && !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create makeup lesson
    // Parse the scheduledAt as local Romania time
    // The frontend sends format like "2025-01-02T19:30"
    // We need to interpret this as Europe/Bucharest timezone
    const localDate = new Date(scheduledAt)
    // If no timezone info, the Date constructor treats it as local time on the server
    // Vercel servers run in UTC, so we need to adjust
    // Romania is UTC+2 (winter) or UTC+3 (summer/DST)
    // Create a proper UTC date by treating the input as Romania time
    const [datePart, timePart] = scheduledAt.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)
    
    // Create date in UTC but representing Romania local time
    // We'll store the exact time the user selected
    const scheduledDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0))
    // Adjust for Romania timezone (UTC+2 in winter, UTC+3 in summer)
    // Check if date is in DST (last Sunday of March to last Sunday of October)
    const isDST = (date) => {
      const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset()
      const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset()
      return Math.max(jan, jul) !== date.getTimezoneOffset()
    }
    const romaniaOffset = isDST(new Date(year, month - 1, day)) ? 3 : 2
    scheduledDate.setUTCHours(scheduledDate.getUTCHours() - romaniaOffset)

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
