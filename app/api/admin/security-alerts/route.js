/**
 * GET /api/admin/security-alerts
 * View security alerts (admin only)
 * POST - Acknowledge alert
 */

import { NextResponse } from 'next/server'
import { getSecurityAlerts, acknowledgeAlert } from '@/lib/security/alerts.js'
import { requireAdmin, getRequestContext, apiError } from '@/lib/security/guards.js'
import { createAuditLog } from '@/lib/security/audit.js'

export async function GET(request) {
  try {
    const { user, error } = await requireAdmin()
    if (error) return error
    
    // Only full admins can view security alerts
    if (user.role !== 'ADMIN') {
      return apiError('Insufficient permissions', 403)
    }
    
    const { searchParams } = new URL(request.url)
    
    const options = {
      type: searchParams.get('type'),
      severity: searchParams.get('severity'),
      acknowledged: searchParams.get('acknowledged') === 'true' ? true : 
                    searchParams.get('acknowledged') === 'false' ? false : null,
      limit: parseInt(searchParams.get('limit')) || 50,
      skip: parseInt(searchParams.get('skip')) || 0,
    }
    
    const { alerts, total } = await getSecurityAlerts(options)
    
    return NextResponse.json({
      alerts,
      pagination: {
        total,
        limit: options.limit,
        skip: options.skip,
      }
    })
    
  } catch (error) {
    console.error('Get security alerts error:', error)
    return apiError('Failed to get security alerts', 500)
  }
}

export async function POST(request) {
  const context = await getRequestContext()
  
  try {
    const { user, error } = await requireAdmin()
    if (error) return error
    
    if (user.role !== 'ADMIN') {
      return apiError('Insufficient permissions', 403)
    }
    
    const body = await request.json()
    const { alertId } = body
    
    if (!alertId) {
      return apiError('Alert ID is required', 400)
    }
    
    const alert = await acknowledgeAlert(alertId, user.id)
    
    await createAuditLog({
      action: 'security_alert_acknowledged',
      actorId: user.id,
      targetId: alertId,
      targetType: 'security_alert',
      ...context,
      success: true,
    })
    
    return NextResponse.json({
      success: true,
      alert,
    })
    
  } catch (error) {
    console.error('Acknowledge alert error:', error)
    return apiError('Failed to acknowledge alert', 500)
  }
}
