import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/security/argon2'
import { requireAdmin, getCurrentUser } from '@/lib/session'
import { require2FAToken } from '@/lib/security/action-tokens'

export async function PUT(request, { params }) {
  try {
    await requireAdmin()
    const sessionUser = await getCurrentUser()
    const { id } = await params
    const body = await request.json()

    // Verify 2FA if user has it enabled
    const currentUser = await prisma.user.findUnique({
      where: { email: sessionUser.email },
      select: { twoFactorEnabled: true, role: true }
    })
    
    const twoFACheck = require2FAToken(body.actionToken, sessionUser.email, currentUser?.twoFactorEnabled)
    if (!twoFACheck.valid && !twoFACheck.skip) {
      return NextResponse.json({ 
        error: twoFACheck.error, 
        requires2FA: true 
      }, { status: 403 })
    }

    const { name, phone, password, active, twoFactorAllowed, role, permissions } = body

    const updateData = { name, phone: phone || null, active, twoFactorAllowed }
    
    if (password) {
      updateData.password = await hashPassword(password)
    }

    // Only SUPERADMIN can change role and permissions
    if (currentUser?.role === 'SUPERADMIN') {
      if (role && ['TEACHER', 'MANAGER', 'ADMIN'].includes(role)) {
        updateData.role = role
      }
      if (Array.isArray(permissions)) {
        // Only store permissions for ADMIN/MANAGER
        updateData.permissions = (role === 'TEACHER') ? [] : permissions
      }
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
    const sessionUser = await getCurrentUser()
    const { id } = await params

    // Get action token from header
    const actionToken = request.headers.get('x-action-token')

    // Verify 2FA if user has it enabled
    const currentUser = await prisma.user.findUnique({
      where: { email: sessionUser.email },
      select: { twoFactorEnabled: true }
    })
    
    const twoFACheck = require2FAToken(actionToken, sessionUser.email, currentUser?.twoFactorEnabled)
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
