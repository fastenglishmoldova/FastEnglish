import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { isSuperAdmin, SUPER_ADMIN_DEFAULTS } from '@/config/superadmins'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email și parola sunt obligatorii')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('Email sau parolă incorectă')
        }

        if (!user.active) {
          throw new Error('Contul este dezactivat')
        }

        if (!user.password) {
          throw new Error('Acest cont folosește autentificare Google')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Email sau parolă incorectă')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth
      if (account?.provider === 'google') {
        const email = user.email?.toLowerCase()
        
        // Check if user exists
        let existingUser = await prisma.user.findUnique({
          where: { email }
        })

        // If super admin and doesn't exist, create them automatically
        if (!existingUser && isSuperAdmin(email)) {
          existingUser = await prisma.user.create({
            data: {
              email,
              name: user.name || profile?.name || email.split('@')[0],
              image: user.image || profile?.picture,
              role: SUPER_ADMIN_DEFAULTS.role,
              active: SUPER_ADMIN_DEFAULTS.active
            }
          })
          console.log(`✅ Super admin created: ${email}`)
        }

        // If user doesn't exist and is not super admin, reject
        if (!existingUser) {
          console.log(`❌ Login rejected - email not authorized: ${email}`)
          return false
        }

        if (!existingUser.active) {
          console.log(`❌ Login rejected - account disabled: ${email}`)
          return false
        }

        // Update user info from Google (name, image) if changed
        const updates = {}
        if (user.image && user.image !== existingUser.image) {
          updates.image = user.image
        }
        if (user.name && user.name !== existingUser.name) {
          updates.name = user.name
        }
        // Upgrade to admin if now in super admin list
        if (isSuperAdmin(email) && existingUser.role !== 'ADMIN') {
          updates.role = 'ADMIN'
          console.log(`✅ User upgraded to ADMIN: ${email}`)
        }

        if (Object.keys(updates).length > 0) {
          await prisma.user.update({
            where: { email },
            data: updates
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.image = user.image
      }
      
      // For Google users, always fetch fresh data from DB
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email }
        })
        if (dbUser) {
          token.role = dbUser.role
          token.id = dbUser.id
          token.name = dbUser.name
          token.image = dbUser.image
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
        session.user.image = token.image
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}
