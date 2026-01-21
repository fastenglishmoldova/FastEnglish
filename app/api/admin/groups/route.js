import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getCurrentUser } from '@/lib/session'
import { require2FAToken } from '@/lib/security/action-tokens'
import { checkPermission } from '@/lib/permissions'
import { sendTeacherDirectMessage } from '@/lib/telegram'

export async function GET() {
  try {
    await requireAdmin()
    
    const canView = await checkPermission('groups.view')
    if (!canView) {
      return NextResponse.json({ error: 'Nu ai permisiunea de a vedea grupele' }, { status: 403 })
    }
    
    const [groups, teachers, branches] = await Promise.all([
      prisma.group.findMany({
        orderBy: { createdAt: 'desc' },
        include: { 
          course: true, 
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          branch: true,
          groupStudents: {
            include: {
              student: true
            }
          }
        }
      }),
      prisma.user.findMany({
        where: { role: 'TEACHER' },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
      }),
      prisma.branch.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
      })
    ])
    
    return NextResponse.json({ groups, teachers, branches })
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
    
    const canCreate = await checkPermission('groups.create')
    if (!canCreate) {
      return NextResponse.json({ error: 'Nu ai permisiunea de a crea grupe' }, { status: 403 })
    }
    
    const sessionUser = await getCurrentUser()
    const body = await request.json()

    // Verify 2FA if user has it enabled
    const currentUser = await prisma.user.findUnique({
      where: { email: sessionUser.email },
      select: { twoFactorEnabled: true }
    })
    
    const twoFACheck = require2FAToken(body.actionToken, sessionUser.email, currentUser?.twoFactorEnabled)
    if (!twoFACheck.valid && !twoFACheck.skip) {
      return NextResponse.json({ 
        error: twoFACheck.error, 
        requires2FA: true 
      }, { status: 403 })
    }

    const { name, courseId, teacherId, branchId, scheduleDays, scheduleTime, 
            locationType, locationDetails, startDate, active } = body

    const group = await prisma.group.create({
      data: {
        name,
        courseId,
        teacherId,
        branchId: branchId || null,
        scheduleDays,
        scheduleTime,
        locationType,
        locationDetails,
        startDate: startDate ? new Date(startDate) : null,
        active
      },
      include: {
        course: { select: { title: true } },
        branch: { select: { name: true } },
        teacher: { select: { name: true, telegramChatId: true } }
      }
    })

    // Trimite notificare pe Telegram către profesor
    if (group.teacher?.telegramChatId && teacherId) {
      // Parse scheduleTime - poate fi JSON sau string simplu
      let timeDisplay = scheduleTime || 'Neprecizat'
      if (scheduleTime && scheduleTime.startsWith('{')) {
        try {
          const times = JSON.parse(scheduleTime)
          // Formatează ca: Luni la 12:00, Vineri la 19:00
          const days = scheduleDays || Object.keys(times)
          timeDisplay = days
            .filter(day => times[day])
            .map(day => `${day} la ${times[day]}`)
            .join(', ')
        } catch {
          // Lasă ca string simplu
        }
      }
      
      const scheduleInfo = scheduleDays?.length > 0 
        ? `📅 ${timeDisplay}`
        : 'Program nestabilit'
      
      const message = `🎉 <b>Grupă Nouă Atribuită!</b>

📚 Grupă: <b>${group.name}</b>
🎓 Curs: ${group.course?.title || 'Nespecificat'}
${group.branch ? `🏢 Filială: ${group.branch.name}` : ''}
${scheduleInfo}
${locationDetails ? `📍 Locație: ${locationDetails}` : ''}
${locationType === 'online' ? '💻 Online' : '🏫 Fizic'}

✨ Mult succes cu noua grupă!`

      await sendTeacherDirectMessage(group.teacher.telegramChatId, message)
    }

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
  }
}
