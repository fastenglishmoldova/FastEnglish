import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Endpoint pentru orarul complet - accesibil tuturor utilizatorilor autentificați
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all active groups with necessary relations
    const groups = await prisma.group.findMany({
      where: { 
        active: true 
      },
      include: {
        course: { select: { id: true, title: true } },
        branch: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true, email: true } },
        _count: {
          select: {
            groupStudents: {
              where: { status: { notIn: ['LEFT', 'TRANSFERRED'] } }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Fetch all teachers for filter
    const teachers = await prisma.user.findMany({
      where: { 
        role: { in: ['TEACHER', 'ADMIN', 'SUPERADMIN'] },
        active: true
      },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' }
    })

    // Fetch all branches for filter
    const branches = await prisma.branch.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ 
      groups,
      teachers,
      branches,
      currentUserId: session.user.id
    })
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 })
  }
}
