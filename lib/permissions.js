import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * Verifică dacă utilizatorul curent are o permisiune specifică
 * SUPERADMIN are automat toate permisiunile
 */
export async function checkPermission(permission) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return false
  }

  // SUPERADMIN are toate permisiunile
  if (session.user.role === 'SUPERADMIN') {
    return true
  }

  // Pentru ADMIN/MANAGER, verificăm permisiunile din baza de date
  if (['ADMIN', 'MANAGER'].includes(session.user.role)) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { permissions: true }
    })
    
    return user?.permissions?.includes(permission) || false
  }

  return false
}

/**
 * Verifică dacă utilizatorul curent are cel puțin una din permisiuni
 */
export async function checkAnyPermission(permissions) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return false
  }

  if (session.user.role === 'SUPERADMIN') {
    return true
  }

  if (['ADMIN', 'MANAGER'].includes(session.user.role)) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { permissions: true }
    })
    
    return permissions.some(p => user?.permissions?.includes(p))
  }

  return false
}

/**
 * Verifică dacă utilizatorul curent are toate permisiunile
 */
export async function checkAllPermissions(permissions) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return false
  }

  if (session.user.role === 'SUPERADMIN') {
    return true
  }

  if (['ADMIN', 'MANAGER'].includes(session.user.role)) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { permissions: true }
    })
    
    return permissions.every(p => user?.permissions?.includes(p))
  }

  return false
}

/**
 * Returnează permisiunile utilizatorului curent
 */
export async function getUserPermissions() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return []
  }

  if (session.user.role === 'SUPERADMIN') {
    return ['*'] // All permissions
  }

  if (['ADMIN', 'MANAGER'].includes(session.user.role)) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { permissions: true }
    })
    
    return user?.permissions || []
  }

  return []
}

/**
 * Middleware pentru a verifica permisiunea și a returna eroare dacă nu există
 */
export async function requirePermission(permission) {
  const hasPermission = await checkPermission(permission)
  
  if (!hasPermission) {
    throw new Error('Forbidden: Nu ai permisiunea necesară pentru această acțiune')
  }
  
  return true
}

/**
 * Middleware pentru a verifica cel puțin o permisiune
 */
export async function requireAnyPermission(permissions) {
  const hasPermission = await checkAnyPermission(permissions)
  
  if (!hasPermission) {
    throw new Error('Forbidden: Nu ai permisiunile necesare pentru această acțiune')
  }
  
  return true
}
