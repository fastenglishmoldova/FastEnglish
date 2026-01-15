import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Create a new makeup lesson (admin)
export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { groupId, teacherId, scheduledAt, notes, studentIds } = body

    if (!groupId || !teacherId || !scheduledAt) {
      return NextResponse.json({ error: 'Grupă, profesor și data sunt obligatorii' }, { status: 400 })
    }

    // Parse the scheduledAt as local Romania time
    // The frontend sends format like "2025-01-02T19:30"
    const [datePart, timePart] = scheduledAt.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes] = timePart.split(':').map(Number)
    
    // Create date in UTC but representing Romania local time
    const scheduledDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0))
    // Adjust for Romania timezone (UTC+2 in winter, UTC+3 in summer)
    const isDST = (date) => {
      const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset()
      const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset()
      return Math.max(jan, jul) !== date.getTimezoneOffset()
    }
    const romaniaOffset = isDST(new Date(year, month - 1, day)) ? 3 : 2
    scheduledDate.setUTCHours(scheduledDate.getUTCHours() - romaniaOffset)

    // Create makeup lesson
    const makeupLesson = await prisma.makeupLesson.create({
      data: {
        groupId,
        teacherId,
        scheduledAt: scheduledDate,
        notes: notes || null,
        status: 'SCHEDULED',
        students: studentIds && studentIds.length > 0 ? {
          create: studentIds.map(studentId => ({
            studentId,
            status: 'PENDING'
          }))
        } : undefined
      },
      include: {
        teacher: {
          select: { id: true, name: true, email: true }
        },
        group: {
          include: { course: true }
        },
        students: {
          include: { student: true }
        }
      }
    })

    return NextResponse.json(makeupLesson)
  } catch (error) {
    console.error('Error creating makeup lesson:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET - Fetch all makeup lessons with detailed info for admin
export async function GET(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')
    const status = searchParams.get('status')
    const groupId = searchParams.get('groupId')

    // Build filter
    const where = {}
    if (teacherId) where.teacherId = teacherId
    if (status) where.status = status
    if (groupId) where.groupId = groupId

    // Get all makeup lessons with full details
    const makeupLessons = await prisma.makeupLesson.findMany({
      where,
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
            course: true
          }
        },
        students: {
          include: {
            student: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get all teachers who have created makeup lessons
    const teachers = await prisma.user.findMany({
      where: {
        role: 'TEACHER',
        makeupLessons: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            makeupLessons: true
          }
        }
      }
    })

    // Get summary statistics per teacher
    const teacherStats = await Promise.all(
      teachers.map(async (teacher) => {
        const lessons = await prisma.makeupLesson.findMany({
          where: { teacherId: teacher.id },
          include: {
            students: true
          }
        })

        const completed = lessons.filter(l => l.status === 'COMPLETED')
        const scheduled = lessons.filter(l => l.status === 'SCHEDULED')
        const inProgress = lessons.filter(l => l.status === 'IN_PROGRESS')
        
        // Count students marked present/absent
        let presentCount = 0
        let absentCount = 0
        
        for (const lesson of lessons) {
          for (const student of lesson.students) {
            if (student.status === 'PRESENT') presentCount++
            if (student.status === 'ABSENT') absentCount++
          }
        }

        return {
          ...teacher,
          stats: {
            total: lessons.length,
            completed: completed.length,
            scheduled: scheduled.length,
            inProgress: inProgress.length,
            studentsMarkedPresent: presentCount,
            studentsMarkedAbsent: absentCount,
            totalStudentsRecovered: presentCount // Students who recovered = marked present
          }
        }
      })
    )

    // Get students with absences still to recover
    const studentsWithAbsences = await prisma.groupStudent.findMany({
      where: {
        absences: { gt: 0 }
      },
      include: {
        student: true,
        group: {
          include: {
            course: true,
            teacher: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        absences: 'desc'
      }
    })

    // Overall statistics
    const overallStats = {
      totalMakeupLessons: makeupLessons.length,
      completedLessons: makeupLessons.filter(l => l.status === 'COMPLETED').length,
      scheduledLessons: makeupLessons.filter(l => l.status === 'SCHEDULED').length,
      inProgressLessons: makeupLessons.filter(l => l.status === 'IN_PROGRESS').length,
      totalStudentsWithAbsences: studentsWithAbsences.length,
      totalAbsencesToRecover: studentsWithAbsences.reduce((sum, gs) => sum + gs.absences, 0)
    }

    return NextResponse.json({
      makeupLessons,
      teacherStats,
      studentsWithAbsences,
      overallStats
    })
  } catch (error) {
    console.error('Error fetching makeup lessons for admin:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
