import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET(request, { params }) {
  try {
    await requireAdmin()
    const { id } = await params

    const course = await prisma.course.findUnique({ where: { id } })
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()

    const { title, slug, descriptionShort, descriptionLong, category, level,
            ageMin, ageMax, duration, lessonsCount, price, discountPrice, seatsTotal, active, imageUrl, images, mainImageUrl } = body

    // Check if slug exists for another course
    const existingCourse = await prisma.course.findFirst({
      where: { slug, NOT: { id } }
    })
    if (existingCourse) {
      return NextResponse.json({ error: 'Acest slug există deja' }, { status: 400 })
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        slug,
        descriptionShort,
        descriptionLong,
        category,
        level,
        ageMin,
        ageMax,
        duration,
        lessonsCount,
        price,
        discountPrice,
        seatsTotal,
        active,
        imageUrl: mainImageUrl || imageUrl, // Pentru compatibilitate
        images: images || [],
        mainImageUrl: mainImageUrl || imageUrl
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin()
    const { id } = await params

    await prisma.course.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
