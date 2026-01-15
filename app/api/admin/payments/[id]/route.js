import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET single payment
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        groupStudent: {
          include: {
            student: true,
            group: {
              include: {
                course: true
              }
            }
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('GET payment error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH update payment
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()
    const { amount, paymentDate, paymentMethod, notes } = data

    const updateData = {}
    if (amount !== undefined) updateData.amount = parseFloat(amount)
    if (paymentDate !== undefined) updateData.paymentDate = new Date(paymentDate)
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod
    if (notes !== undefined) updateData.notes = notes

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        groupStudent: {
          include: {
            student: true
          }
        }
      }
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error('PATCH payment error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE payment
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get payment first to check if lessons were added
    const payment = await prisma.payment.findUnique({
      where: { id }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // If lessons were added with this payment, deduct them
    if (payment.lessonsAdded && payment.lessonsAdded > 0) {
      await prisma.groupStudent.update({
        where: { id: payment.groupStudentId },
        data: {
          lessonsRemaining: {
            decrement: payment.lessonsAdded
          }
        }
      })
    }

    await prisma.payment.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE payment error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
