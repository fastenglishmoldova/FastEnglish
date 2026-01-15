import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from '@/lib/security/argon2'
import prisma from '@/lib/prisma'

export const authOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        preValidated: { label: 'Pre-validated', type: 'text' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email) {
            throw new Error('Email este obligatoriu')
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

          // If pre-validated by our login API (which handles 2FA), skip password check
          if (credentials.preValidated === 'true') {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.image
            }
          }

          // Normal flow: verify password
          if (!credentials?.password) {
            throw new Error('Parola este obligatorie')
          }

          if (!user.password) {
            throw new Error('Parola nu a fost setată pentru acest cont')
          }

          const isPasswordValid = await verifyPassword(user.password, credentials.password)

          if (!isPasswordValid) {
            throw new Error('Email sau parolă incorectă')
          }

          // Check if 2FA is enabled - if so, deny direct login (must use /api/auth/login)
          if (user.twoFactorEnabled) {
            throw new Error('2FA_REQUIRED')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image
          }
        } catch (error) {
          console.error('Authorize error:', error)
          throw error
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email?.toLowerCase() }
        })
        
        if (!dbUser || !dbUser.active) {
          return false
        }
        
        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = user.role
          token.id = user.id
          token.image = user.image
        }
        
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
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
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
