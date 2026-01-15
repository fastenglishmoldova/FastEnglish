/**
 * POST /api/admin/security/2fa/disable
 * Disable 2FA for the logged-in user
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    if (!user.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA nu este activat' }, { status: 400 })
    }
    
    // Disable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: []
      }
    })
    
    return NextResponse.json({
      success: true,
      message: '2FA dezactivat'
    })
  } catch (error) {
    console.error('2FA disable error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
