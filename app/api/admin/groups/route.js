import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getSession } from '@/lib/session'
import { require2FAToken } from '@/lib/security/action-tokens'

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
    const session = await getSession()
    const body = await request.json()

    // Verify 2FA if user has it enabled
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { twoFactorEnabled: true }
    })
    
    const twoFACheck = require2FAToken(body.actionToken, session.user.email, currentUser?.twoFactorEnabled)
    if (!twoFACheck.valid && !twoFACheck.skip) {
      return NextResponse.json({ 
        error: twoFACheck.error, 
        requires2FA: true 
      }, { status: 403 })
    }

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
