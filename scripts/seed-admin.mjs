/**
 * Seed script for super admin users
 * Run with: node scripts/seed-admin.mjs
 * 
 * This script creates/updates super admins from config/superadmins.js
 */

import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import { SUPER_ADMINS } from '../config/superadmins.js'

const prisma = new PrismaClient()

async function hashPassword(password) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
    hashLength: 32,
  })
}

async function main() {
  console.log('\n🔐 Pi-School Admin Seed Script\n')
  console.log(`Found ${SUPER_ADMINS.length} super admin(s) in config.\n`)
  
  for (const admin of SUPER_ADMINS) {
    console.log(`Processing: ${admin.email}`)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: admin.email.toLowerCase() }
    })
    
    if (existingUser) {
      // Update existing user to SUPERADMIN role and update password
      console.log(`  ⏳ Updating existing user...`)
      const passwordHash = await hashPassword(admin.password)
      
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: 'SUPERADMIN',
          password: passwordHash,
          name: admin.name || existingUser.name,
          twoFactorEnabled: existingUser.twoFactorEnabled, // Keep 2FA status
        }
      })
      console.log(`  ✅ Updated to SUPERADMIN role`)
    } else {
      // Create new admin user
      console.log(`  ⏳ Creating new admin...`)
      const passwordHash = await hashPassword(admin.password)
      
      await prisma.user.create({
        data: {
          email: admin.email.toLowerCase(),
          name: admin.name || 'Admin',
          password: passwordHash,
          role: 'SUPERADMIN',
          twoFactorEnabled: false,
        }
      })
      console.log(`  ✅ Created as SUPERADMIN`)
    }
  }
  
  console.log('\n✨ Done! All super admins have been seeded.\n')
  console.log('⚠️  Remember to change the default passwords in config/superadmins.js!')
  console.log('   Then run this script again to update.\n')
}

main()
  .catch(e => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
