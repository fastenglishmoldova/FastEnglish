import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/security/argon2'
import { requireAdmin, getSession } from '@/lib/session'
import { require2FAToken } from '@/lib/security/action-tokens'

export async function PUT(request, { params }) {
  try {
    await requireAdmin()
    const session = await getSession()
    const { id } = await params
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

    const { name, password, active, twoFactorAllowed } = body

    const updateData = { name, active, twoFactorAllowed }
    
    if (password) {
      updateData.password = await hashPassword(password)
    }

    const teacher = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(teacher)
  } catch (error) {
    console.error('Error updating teacher:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin()
    const session = await getSession()
    const { id } = await params

    // Get action token from header
    const actionToken = request.headers.get('x-action-token')

    // Verify 2FA if user has it enabled
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { twoFactorEnabled: true }
    })
    
    const twoFACheck = require2FAToken(actionToken, session.user.email, currentUser?.twoFactorEnabled)
    if (!twoFACheck.valid && !twoFACheck.skip) {
      return NextResponse.json({ 
        error: twoFACheck.error, 
        requires2FA: true 
      }, { status: 403 })
    }

    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 })
  }
}
