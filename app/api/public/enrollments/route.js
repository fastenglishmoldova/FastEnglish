import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { notifyNewLead } from '@/lib/telegram'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

// Înscriere la un curs anume, de pe site. Intră în pipeline-ul de Leads din
// CRM, cu sursa „Formular site" și cursul în mesaj.
export async function POST(request) {
  try {
    // Rate limiting: 2 requests per minute
    const clientIP = getClientIP(request)
    const rateLimitKey = `enrollments:${clientIP}`
    const { success, remaining, resetIn } = checkRateLimit(rateLimitKey, 2, 60000)

    if (!success) {
      return NextResponse.json(
        { error: `Prea multe cereri. Încercați din nou în ${Math.ceil(resetIn / 1000)} secunde.` },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(resetIn / 1000))
          }
        }
      )
    }

    const body = await request.json()

    const { courseId, studentName, studentAge, parentName, parentPhone, parentEmail, city, observations } = body

    // Validation
    if (!courseId || !studentName || !parentName || !parentPhone || !parentEmail) {
      return NextResponse.json(
        { error: 'Câmpurile obligatorii lipsesc' },
        { status: 400 }
      )
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    }).catch(() => null)

    if (!course) {
      return NextResponse.json(
        { error: 'Cursul nu a fost găsit' },
        { status: 404 }
      )
    }

    const age = studentAge ? parseInt(studentAge) : null
    const message = [
      `Curs: ${course.title}`,
      city ? `Oraș: ${city}` : null,
      observations?.trim() || null,
    ].filter(Boolean).join('\n')

    const lead = await prisma.lead.create({
      data: {
        name: parentName.trim(),
        email: parentEmail.trim() || null,
        phone: parentPhone.trim() || null,
        source: 'SITE',
        sourceDetail: `Curs: ${course.title}`,
        message,
        studentName: studentName.trim(),
        studentAge: Number.isFinite(age) ? age : null,
        children: [{
          name: studentName.trim(),
          age: Number.isFinite(age) ? age : null,
          isAdult: false,
          level: null,
          lessonType: null,
          locationType: null,
        }],
        status: 'LEAD'
      }
    })

    // Trimite notificare pe Telegram cu butoane
    await notifyNewLead(lead)

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json(
      { error: 'A apărut o eroare la trimiterea înscrierii' },
      { status: 500 }
    )
  }
}
