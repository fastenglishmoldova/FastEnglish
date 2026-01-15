import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getSession } from '@/lib/session'
import { require2FAToken } from '@/lib/security/action-tokens'

export async function GET(request, { params }) {
  try {
    await requireAdmin()
    const { id } = await params

    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin()
    const session = await getSession()
    const { id } = await params
    const body = await request.json()

    // Verify 2FA if user has it enabled
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { twoFactorEnabled: true }
    })
    
    const twoFACheck = require2FAToken(body.actionToken, session.user.email, user?.twoFactorEnabled)
    if (!twoFACheck.valid && !twoFACheck.skip) {
      return NextResponse.json({ 
        error: twoFACheck.error, 
        requires2FA: true 
      }, { status: 403 })
    }

    const { fullName, age, parentName, parentPhone, parentEmail, notes } = body

    const student = await prisma.student.update({
      where: { id },
      data: { fullName, age, parentName, parentPhone, parentEmail, notes }
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error updating student:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin()
    const session = await getSession()
    const { id } = await params

    // Get action token from header or query
    const actionToken = request.headers.get('x-action-token')

    // Verify 2FA if user has it enabled
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { twoFactorEnabled: true }
    })
    
    const twoFACheck = require2FAToken(actionToken, session.user.email, user?.twoFactorEnabled)
    if (!twoFACheck.valid && !twoFACheck.skip) {
      return NextResponse.json({ 
        error: twoFACheck.error, 
        requires2FA: true 
      }, { status: 403 })
    }

    await prisma.student.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}
