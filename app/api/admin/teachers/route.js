import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/security/argon2'
import { requireAdmin, getSession } from '@/lib/session'
import { require2FAToken } from '@/lib/security/action-tokens'

export async function GET() {
  try {
    await requireAdmin()
    const teachers = await prisma.user.findMany({
      where: { role: { in: ['TEACHER', 'ADMIN', 'MANAGER'] } },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(teachers)
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 })
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
      select: { twoFactorEnabled: true, role: true }
    })
    
    const twoFACheck = require2FAToken(body.actionToken, session.user.email, currentUser?.twoFactorEnabled)
    if (!twoFACheck.valid && !twoFACheck.skip) {
      return NextResponse.json({ 
        error: twoFACheck.error, 
        requires2FA: true 
      }, { status: 403 })
    }

    const { name, email, password, active, twoFactorAllowed, role } = body

    // Doar SUPERADMIN poate crea ADMIN
    const allowedRoles = ['TEACHER']
    if (currentUser?.role === 'SUPERADMIN') {
      allowedRoles.push('ADMIN', 'MANAGER')
    }

    const finalRole = allowedRoles.includes(role) ? role : 'TEACHER'

    // Check if email exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Acest email există deja' }, { status: 400 })
    }

    const hashedPassword = password ? await hashPassword(password) : null

    const teacher = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: finalRole,
        active: active ?? true,
        twoFactorAllowed: twoFactorAllowed ?? false
      }
    })

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error('Error creating teacher:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 })
  }
}
