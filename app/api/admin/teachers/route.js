import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  try {
    await requireAdmin()
    const teachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
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
    const body = await request.json()

    const { name, email, password, active } = body

    // Check if email exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Acest email există deja' }, { status: 400 })
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null

    const teacher = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'TEACHER',
        active: active ?? true
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
