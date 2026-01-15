/**
 * GET /api/cron/security-cleanup
 * Cleanup expired sessions, tokens, rate limit buckets, and old audit logs
 * Should be called by Vercel Cron or external scheduler
 */

import { NextResponse } from 'next/server'
import { cleanupExpiredSessions } from '@/lib/security/session.js'
import { cleanupExpiredStepUpTokens } from '@/lib/security/step-up.js'
import { cleanupExpiredBuckets } from '@/lib/security/rate-limit.js'
import { cleanupCaptchaStates } from '@/lib/security/captcha.js'
import { createAuditLog, cleanupOldAuditLogs, SEVERITY } from '@/lib/security/audit.js'

export async function GET(request) {
  // Verify cron secret
  const cronSecret = request.headers.get('authorization')
  
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const startTime = Date.now()
  const results = {}
  
  try {
    // Cleanup expired sessions
    results.sessions = await cleanupExpiredSessions()
    
    // Cleanup expired step-up tokens
    results.stepUpTokens = await cleanupExpiredStepUpTokens()
    
    // Cleanup rate limit buckets
    results.rateLimitBuckets = await cleanupExpiredBuckets()
    
    // Cleanup CAPTCHA states
    results.captchaStates = await cleanupCaptchaStates()
    
    // Cleanup old audit logs (default 21 days from env)
    results.auditLogs = await cleanupOldAuditLogs()
    
    const duration = Date.now() - startTime
    
    // Audit cleanup (this log itself won't be cleaned for 21 days)
    await createAuditLog({
      action: 'security_cleanup',
      details: {
        ...results,
        durationMs: duration,
      },
      severity: SEVERITY.INFO,
      success: true,
    })
    
    return NextResponse.json({
      success: true,
      cleaned: results,
      durationMs: duration,
    })
    
  } catch (error) {
    console.error('Security cleanup error:', error)
    
    await createAuditLog({
      action: 'security_cleanup_failed',
      details: {
        error: error.message,
        partialResults: results,
      },
      severity: SEVERITY.WARNING,
      success: false,
    })
    
    return NextResponse.json(
      { error: 'Cleanup failed', partialResults: results },
      { status: 500 }
    )
  }
}
