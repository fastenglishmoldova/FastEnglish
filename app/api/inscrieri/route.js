import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { notifyNewLead } from '@/lib/telegram'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

// Formularul de înscriere de pe site (/inscriere) intră direct în pipeline-ul
// de Leads din CRM, cu sursa „Formular site".
export async function POST(request) {
  try {
    // Rate limiting: 1 request per minute
    const clientIP = getClientIP(request)
    const rateLimitKey = `inscrieri:${clientIP}`
    const { success, remaining, resetIn } = checkRateLimit(rateLimitKey, 1, 60000)

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

    const data = await request.json()

    const { numeParinte, numeCopil, email, telefon, clasa, cursuriSelectate, mesaj } = data

    // Validare
    if (!numeParinte || !numeCopil || !email || !telefon || !clasa || !cursuriSelectate) {
      return NextResponse.json(
        { error: 'Toate câmpurile obligatorii trebuie completate' },
        { status: 400 }
      )
    }

    // Convertește cursuri în array dacă e string
    let cursuriArray = cursuriSelectate
    if (typeof cursuriSelectate === 'string') {
      cursuriArray = [cursuriSelectate]
    } else if (!Array.isArray(cursuriSelectate)) {
      cursuriArray = []
    }

    // Obține numele cursurilor din baza de date
    let cursuriNume = []
    for (const cursId of cursuriArray) {
      if (cursId === 'selectam-impreuna') {
        cursuriNume.push('Selectăm împreună')
      } else {
        const curs = await prisma.course.findUnique({
          where: { id: cursId },
          select: { title: true }
        }).catch(() => null)
        cursuriNume.push(curs ? curs.title : cursId)
      }
    }

    const message = [
      cursuriNume.length ? `Cursuri: ${cursuriNume.join(', ')}` : null,
      `Clasa: ${clasa}`,
      mesaj?.trim() || null,
    ].filter(Boolean).join('\n')

    // Salvare ca lead în CRM
    const lead = await prisma.lead.create({
      data: {
        name: numeParinte.trim(),
        email: email.trim() || null,
        phone: telefon.trim() || null,
        source: 'SITE',
        sourceDetail: 'Formular înscriere',
        message,
        studentName: numeCopil.trim(),
        children: [{ name: numeCopil.trim(), age: null, isAdult: false, level: null, lessonType: null, locationType: null }],
        status: 'LEAD'
      }
    })

    // Trimite notificare pe Telegram cu butoane
    await notifyNewLead(lead)

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    console.error('Eroare la înscriere:', error)
    return NextResponse.json(
      { error: 'A apărut o eroare la procesarea cererii' },
      { status: 500 }
    )
  }
}

// Fără GET public: lista de lead-uri conține date personale și se citește
// exclusiv autentificat, prin /api/admin/leads.
