/**
 * POST /api/admin/security/2fa/verify
 * Verify TOTP code and enable 2FA
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { 
  verifyTOTP, 
  decryptTOTPSecret,
  generateBackupCodes
} from '@/lib/security/totp.js'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { code } = body
    
    if (!code || code.length !== 6) {
      return NextResponse.json({ error: 'Cod invalid' }, { status: 400 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    if (user.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA este deja activat' }, { status: 400 })
    }
    
    if (!user.twoFactorSecret) {
      return NextResponse.json({ error: 'Trebuie să inițializezi setup-ul mai întâi' }, { status: 400 })
    }
    
    // Verify the code
    const decryptedSecret = decryptTOTPSecret(user.twoFactorSecret)
    const isValid = verifyTOTP(code, decryptedSecret)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Cod invalid. Încearcă din nou.' }, { status: 400 })
    }
    
    // Generate backup codes
    const { plainCodes, hashedCodes } = generateBackupCodes(10)
    
    // Enable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorBackupCodes: hashedCodes
      }
    })
    
    return NextResponse.json({
      success: true,
      backupCodes: plainCodes,
      message: '2FA activat cu succes!'
    })
  } catch (error) {
    console.error('2FA verify error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
