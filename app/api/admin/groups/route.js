import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  try {
    await requireAdmin()
    
    const [groups, teachers] = await Promise.all([
      prisma.group.findMany({
        orderBy: { createdAt: 'desc' },
        include: { 
          course: true, 
          teacher: true,
          groupStudents: {
            include: {
              student: true
            }
          }
        }
      }),
      prisma.user.findMany({
        where: { role: { in: ['TEACHER', 'ADMIN', 'MANAGER'] } },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
      })
    ])
    
    return NextResponse.json({ groups, teachers })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAdmin()
    const body = await request.json()

    const { name, courseId, teacherId, scheduleDays, scheduleTime, 
            locationType, locationDetails, startDate, active } = body

    const group = await prisma.group.create({
      data: {
        name,
        courseId,
        teacherId,
        scheduleDays,
        scheduleTime,
        locationType,
        locationDetails,
        startDate: startDate ? new Date(startDate) : null,
        active
      }
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
  }
}
