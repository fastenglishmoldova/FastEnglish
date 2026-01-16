/**
 * GET /api/admin/audit-logs
 * View audit logs (admin only)
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAuditLogs } from '@/lib/security/audit.js'
import prisma from '@/lib/prisma'

function apiError(message, status) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return apiError('Unauthorized', 401)
    }
    
    // Get user from DB to check role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, email: true, id: true }
    })
    
    if (!user) {
      return apiError('User not found', 404)
    }
    
    // Only SUPERADMIN can view audit logs
    if (user.role !== 'SUPERADMIN') {
      return apiError('Acces permis doar pentru Super Admin', 403)
    }
    
    const { searchParams } = new URL(request.url)
    
    const options = {
      action: searchParams.get('action'),
      actorId: searchParams.get('actorId'),
      targetId: searchParams.get('targetId'),
      severity: searchParams.get('severity'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      limit: parseInt(searchParams.get('limit')) || 100,
      skip: parseInt(searchParams.get('skip')) || 0,
    }
    
    const { logs, total } = await getAuditLogs(options)
    
    return NextResponse.json({
      logs,
      pagination: {
        total,
        limit: options.limit,
        skip: options.skip,
      }
    })
    
  } catch (error) {
    console.error('Get audit logs error:', error)
    return apiError('Failed to get audit logs', 500)
  }
}
