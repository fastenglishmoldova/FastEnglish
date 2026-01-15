import CredentialsProvider from 'next-auth/providers/credentials'
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

        const normalizedEmail = credentials.email.toLowerCase().trim()

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail }
        })

        if (!user) {
          throw new Error('Email sau parolă incorectă')
        }

        if (!user.active) {
          throw new Error('Contul este dezactivat')
        }

        if (!user.password) {
          throw new Error('Parola nu a fost setată pentru acest cont')
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
    })
  ],
  callbacks: {
    async signIn({ user }) {
      // Check if user is active
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email?.toLowerCase() }
      })
      
      if (!dbUser || !dbUser.active) {
        return false
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
