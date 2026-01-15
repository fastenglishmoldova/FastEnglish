import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NotificationsPageClient from './NotificationsPageClient'

export default async function AdminNotificationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    redirect('/login')
  }

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { recipientId: null },
        { recipientId: session.user.id }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      student: {
        select: { id: true, fullName: true }
      }
    }
  })

  return <NotificationsPageClient 
    notifications={JSON.parse(JSON.stringify(notifications))} 
    isAdmin={true}
  />
}
