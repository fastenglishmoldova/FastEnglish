export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  CalendarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  InboxIcon
} from '@heroicons/react/24/outline'
import PermissionGuard from '@/components/admin/PermissionGuard'

const statusConfig = {
  // New statuses
  LEAD: { label: '🔵 Lead', color: 'bg-blue-100 text-blue-800' },
  FARA_RASPUNS: { label: '🔘 Fără Răspuns', color: 'bg-gray-100 text-gray-700' },
  CONTACTAT: { label: '🟡 Contactat', color: 'bg-yellow-100 text-yellow-800' },
  PROGRAMAT: { label: '🟠 Programat', color: 'bg-orange-100 text-orange-800' },
  PRIMA_LECTIE: { label: '🟢 Prima Lecție', color: 'bg-green-100 text-green-800' },
  FINALIZAT_LECTIA: { label: '⚫ Finalizat Lecția', color: 'bg-slate-200 text-slate-800' },
  SE_GANDESTE: { label: '🔘 Se Gândește', color: 'bg-gray-100 text-gray-600' },
  ASTEPTAM_PLATA: { label: '💵 Așteptăm Plata', color: 'bg-amber-100 text-amber-800' },
  PLATIT: { label: '💰 Plătit', color: 'bg-emerald-100 text-emerald-800' },
  STUDIAZA: { label: '🟣 Studiază', color: 'bg-purple-100 text-purple-800' },
  PLECAT: { label: '🔴 Plecat', color: 'bg-red-100 text-red-800' },
  LOST_LEAD: { label: '❌ Lost Lead', color: 'bg-red-200 text-red-900' },
  TEST: { label: '🧪 Test', color: 'bg-cyan-100 text-cyan-800' },
  // Legacy statuses
  NOU: { label: '🔵 Lead', color: 'bg-blue-100 text-blue-800' },
  NEW: { label: '🔵 Lead', color: 'bg-blue-100 text-blue-800' },
  CONTACTED: { label: '🟡 Contactat', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMAT: { label: '🟢 Prima Lecție', color: 'bg-green-100 text-green-800' },
  CONFIRMED: { label: '🟢 Prima Lecție', color: 'bg-green-100 text-green-800' },
  RESPINS: { label: '🔴 Plecat', color: 'bg-red-100 text-red-800' },
  REJECTED: { label: '🔴 Plecat', color: 'bg-red-100 text-red-800' }
}

export default async function EnrollmentsPage() {
  return (
    <PermissionGuard permission="inscrieri.view">
      <EnrollmentsPageContent />
    </PermissionGuard>
  )
}

async function EnrollmentsPageContent() {
  // Înscrieri din modalul de pe homepage (cu curs specific)
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      course: true
    }
  })

  // Înscrieri din formularul /inscriere
  const inscrieri = await prisma.inscriere.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Transformă înscriererile din formular în același format
  const formattedInscrieri = inscrieri.map(i => ({
    id: i.id,
    studentName: i.numeCopil,
    studentAge: null,
    parentName: i.numeParinte,
    parentPhone: i.telefon,
    parentEmail: i.email,
    status: i.status,
    createdAt: i.createdAt,
    course: null,
    source: 'formular',
    clasa: i.clasa,
    cursuri: i.cursuri
  }))

  // Formatează enrollments să aibă source
  const formattedEnrollments = enrollments.map(e => ({
    ...e,
    source: 'modal'
  }))

  // Combină și sortează după dată
  const allEnrollments = [...formattedEnrollments, ...formattedInscrieri]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const stats = {
    total: allEnrollments.length,
    noi: allEnrollments.filter(e => e.status === 'NOU' || e.status === 'NEW').length,
    contactati: allEnrollments.filter(e => e.status === 'CONTACTAT' || e.status === 'CONTACTED').length,
    confirmati: allEnrollments.filter(e => e.status === 'CONFIRMAT' || e.status === 'CONFIRMED').length
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      <div>
        <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Înscrieri</h1>
        <p className="text-sm xs:text-base text-gray-600">Gestionează înscrierile primite din toate sursele</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Total</p>
          <p className="text-xl xs:text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Noi</p>
          <p className="text-xl xs:text-2xl font-bold text-blue-600">{stats.noi}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Contactați</p>
          <p className="text-xl xs:text-2xl font-bold text-yellow-600">{stats.contactati}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Confirmați</p>
          <p className="text-xl xs:text-2xl font-bold text-green-600">{stats.confirmati}</p>
        </div>
      </div>

      {/* Lista înscrieri */}
      {allEnrollments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <InboxIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nu există înscrieri încă</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allEnrollments.map((enrollment) => {
            const status = statusConfig[enrollment.status] || statusConfig.NOU
            const isNew = enrollment.status === 'NOU' || enrollment.status === 'NEW'
            
            return (
              <Link
                key={enrollment.id}
                href={`/admin/enrollments/${enrollment.id}`}
                className={`block bg-white rounded-xl p-3 xs:p-4 border hover:border-[#30919f] hover:shadow-md transition-all ${
                  isNew ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 xs:gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm xs:text-base truncate max-w-[150px] xs:max-w-none">
                        <AcademicCapIcon className="h-4 w-4 inline mr-1 text-[#30919f]" />
                        {enrollment.studentName}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        enrollment.source === 'formular' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {enrollment.source === 'formular' ? 'Formular' : 'Modal'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col xs:flex-row xs:flex-wrap gap-1 xs:gap-x-4 xs:gap-y-1 text-xs xs:text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                        {enrollment.parentName}
                      </span>
                      <span className="flex items-center gap-1">
                        <PhoneIcon className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                        {enrollment.parentPhone}
                      </span>
                      <span className="flex items-center gap-1 min-w-0">
                        <EnvelopeIcon className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                        <span className="truncate">{enrollment.parentEmail}</span>
                      </span>
                    </div>

                    <div className="text-xs xs:text-sm text-gray-700">
                      <BookOpenIcon className="h-3 w-3 xs:h-4 xs:w-4 inline mr-1 text-gray-400" />
                      {enrollment.source === 'formular' ? (
                        enrollment.cursuri?.length > 0 
                          ? enrollment.cursuri.join(', ')
                          : 'Fără cursuri selectate'
                      ) : (
                        enrollment.course?.title || 'Curs nespecificat'
                      )}
                      {enrollment.clasa && (
                        <span className="ml-2 text-gray-500">• Clasa {enrollment.clasa}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-left xs:text-right text-xs text-gray-400 whitespace-nowrap">
                    <CalendarIcon className="h-3 w-3 xs:h-4 xs:w-4 inline mr-1" />
                    {new Date(enrollment.createdAt).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
