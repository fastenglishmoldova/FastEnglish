import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  AcademicCapIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

const statusConfig = {
  NOU: { label: 'Nou', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
  CONTACTAT: { label: 'Contactat', color: 'bg-yellow-100 text-yellow-800', icon: PhoneIcon },
  CONFIRMAT: { label: 'Confirmat', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  RESPINS: { label: 'Respins', color: 'bg-red-100 text-red-800', icon: XCircleIcon }
}

export default async function InscrieriPage() {
  const inscrieri = await prisma.inscriere.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const stats = {
    total: inscrieri.length,
    noi: inscrieri.filter(i => i.status === 'NOU').length,
    contactati: inscrieri.filter(i => i.status === 'CONTACTAT').length,
    confirmati: inscrieri.filter(i => i.status === 'CONFIRMAT').length
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      <div>
        <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Înscrieri Formular</h1>
        <p className="text-sm xs:text-base text-gray-600">Înscrierile primite din formularul de pe /inscriere</p>
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
      {inscrieri.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nu există înscrieri încă</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inscrieri.map((inscriere) => {
            const status = statusConfig[inscriere.status] || statusConfig.NOU
            const StatusIcon = status.icon
            
            return (
              <Link
                key={inscriere.id}
                href={`/admin/inscrieri/${inscriere.id}`}
                className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-[#30919f] hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{inscriere.numeCopil}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        {inscriere.numeParinte}
                      </span>
                      <span className="flex items-center gap-1">
                        <PhoneIcon className="h-4 w-4" />
                        {inscriere.telefon}
                      </span>
                      <span className="flex items-center gap-1">
                        <EnvelopeIcon className="h-4 w-4" />
                        {inscriere.email}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        Clasa: {inscriere.clasa}
                      </span>
                      {inscriere.cursuri?.map((curs, idx) => (
                        <span key={idx} className="text-xs bg-[#30919f]/10 text-[#30919f] px-2 py-1 rounded">
                          {curs}
                        </span>
                      ))}
                    </div>

                    {inscriere.mesaj && (
                      <p className="mt-2 text-sm text-gray-500 flex items-start gap-1">
                        <ChatBubbleLeftIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span className="truncate">{inscriere.mesaj}</span>
                      </p>
                    )}
                  </div>

                  <div className="text-right text-xs text-gray-400">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    {new Date(inscriere.createdAt).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
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
