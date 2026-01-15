import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notifyCancelledLesson } from '@/lib/telegram'

// GET - Fetch a specific session
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const lessonSession = await prisma.lessonSession.findUnique({
      where: { id },
      include: {
        group: {
          include: { course: true }
        },
        attendances: {
          include: { student: true }
        }
      }
    })

    if (!lessonSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (lessonSession.group.teacherId !== session.user.id && !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(lessonSession)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH - Update session notes
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { notes } = await request.json()

    const lessonSession = await prisma.lessonSession.findUnique({
      where: { id },
      include: { group: true }
    })

    if (!lessonSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (lessonSession.group.teacherId !== session.user.id && !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if 24 hours have passed (teachers can't modify after 24h, admins can)
    const hoursElapsed = (Date.now() - new Date(lessonSession.date).getTime()) / (1000 * 60 * 60)
    const isExpired = hoursElapsed >= 24
    
    if (isExpired && !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ 
        error: 'Nu poți modifica sesiunea după 24 de ore. Contactează un administrator.' 
      }, { status: 403 })
    }

    const updatedSession = await prisma.lessonSession.update({
      where: { id },
      data: { notes }
    })

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE - Delete a session (ADMIN/MANAGER ONLY - teachers cannot cancel group lessons)
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  
  // Doar adminii și managerii pot șterge lecții de grup
  if (!session || !['MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Doar administratorii pot anula lecțiile de grup' }, { status: 403 })
  }

  try {
    const { id } = await params

    const lessonSession = await prisma.lessonSession.findUnique({
      where: { id },
      include: { 
        group: {
          include: {
            course: true,
            teacher: true
          }
        }
      }
    })

    if (!lessonSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (lessonSession.lessonsDeducted) {
      return NextResponse.json({ error: 'Nu se poate șterge o sesiune care a fost deja procesată' }, { status: 400 })
    }

    // Notificare Telegram despre anulare
    await notifyCancelledLesson(
      lessonSession.group.name,
      lessonSession.group.teacher.name,
      lessonSession.group.course.title,
      new Date(lessonSession.date).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' }),
      false
    )

    // Notificare în app pentru admin
    await prisma.notification.create({
      data: {
        type: 'CANCELLED_SESSION',
        title: `🚫 Lecție anulată: ${lessonSession.group.name}`,
        message: `Lecția pentru grupa "${lessonSession.group.name}" (${lessonSession.group.course.title}) a fost anulată de ${session.user.name}.`,
        link: `/admin/groups/${lessonSession.groupId}`,
        recipientId: null,
        groupId: lessonSession.groupId
      }
    })

    await prisma.lessonSession.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
