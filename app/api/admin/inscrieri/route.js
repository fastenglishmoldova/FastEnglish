import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkPermission } from '@/lib/permissions'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const permCheck = await checkPermission('inscrieri.view')
    if (!permCheck.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să vezi înscrierile' }, { status: 403 })
    }

    const inscrieri = await prisma.inscriere.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Get courses for mapping
    const courses = await prisma.course.findMany({
      select: { id: true, title: true }
    })

    return NextResponse.json({ inscrieri, courses })
  } catch (error) {
    console.error('Eroare:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const permCheck = await checkPermission('inscrieri.edit')
    if (!permCheck.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să adaugi înscrieri' }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.numeCopil || !data.numeParinte || !data.email || !data.telefon || !data.clasa) {
      return NextResponse.json({ error: 'Completează toate câmpurile obligatorii' }, { status: 400 })
    }

    const inscriere = await prisma.inscriere.create({
      data: {
        numeCopil: data.numeCopil,
        numeParinte: data.numeParinte,
        email: data.email,
        telefon: data.telefon,
        clasa: data.clasa,
        cursuri: data.cursuri || [],
        mesaj: data.mesaj || null,
        status: data.status || 'NOU',
        notes: data.notes || null
      }
    })

    return NextResponse.json(inscriere)
  } catch (error) {
    console.error('Eroare:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
