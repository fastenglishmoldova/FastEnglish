import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Funcție pentru a trimite notificare Telegram către group management
async function notifyGroupUpdate(groupName, teacherName, updates) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_LESSONS_BOT_TOKEN
  const CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID
  
  if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) return
  
  const updatesList = Object.entries(updates)
    .map(([key, value]) => {
      const labels = {
        scheduleTime: '⏰ Ora',
        scheduleDays: '📅 Zile',
        locationDetails: '📍 Sala',
        branchId: '🏢 Filiala',
        locationType: '💻 Tip locație'
      }
      return `${labels[key] || key}: ${value}`
    })
    .join('\n')
  
  const message = `🔄 <b>Modificare Grupă</b>

📚 Grupă: <b>${groupName}</b>
👨‍🏫 Profesor: ${teacherName}

<b>Modificări:</b>
${updatesList}

📝 Actualizare făcută de profesor`

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { scheduleTime, scheduleDays, locationDetails, branchId, locationType } = body

    // Verify teacher owns this group
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        teacher: { select: { name: true, email: true } },
        branch: { select: { name: true } }
      }
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.teacherId !== session.user.id && !['SUPERADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Build update data
    const updateData = {}
    const changes = {}
    
    if (scheduleTime !== undefined) {
      updateData.scheduleTime = scheduleTime
      changes.scheduleTime = scheduleTime
    }
    if (scheduleDays !== undefined) {
      updateData.scheduleDays = scheduleDays
      changes.scheduleDays = Array.isArray(scheduleDays) ? scheduleDays.join(', ') : scheduleDays
    }
    if (locationDetails !== undefined) {
      updateData.locationDetails = locationDetails
      changes.locationDetails = locationDetails
    }
    if (branchId !== undefined) {
      updateData.branchId = branchId || null
      if (branchId) {
        const branch = await prisma.branch.findUnique({ where: { id: branchId } })
        changes.branchId = branch?.name || branchId
      } else {
        changes.branchId = 'Fără filială'
      }
    }
    if (locationType !== undefined) {
      updateData.locationType = locationType
      changes.locationType = locationType === 'online' ? 'Online' : 'Fizic'
    }

    // Update group
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: updateData,
      include: {
        course: true,
        branch: true,
        teacher: true
      }
    })

    // Send Telegram notification
    if (Object.keys(changes).length > 0) {
      await notifyGroupUpdate(
        group.name,
        group.teacher?.name || group.teacher?.email || 'Profesor',
        changes
      )
    }

    return NextResponse.json({ success: true, group: updatedGroup })
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 })
  }
}
