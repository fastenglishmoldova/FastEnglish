import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  try {
    await requireAdmin()
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(courses)
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAdmin()
    const body = await request.json()

    const { title, slug, descriptionShort, descriptionLong, category, level, 
            ageMin, ageMax, duration, lessonsCount, price, discountPrice, seatsTotal, active, imageUrl, images, mainImageUrl } = body

    // Check if slug exists
    const existingCourse = await prisma.course.findUnique({ where: { slug } })
    if (existingCourse) {
      return NextResponse.json({ error: 'Acest slug există deja' }, { status: 400 })
    }

    const course = await prisma.course.create({
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

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
