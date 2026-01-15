import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ArchiveBoxIcon,
  InboxIcon
} from '@heroicons/react/24/outline'

const statusConfig = {
  NOU: { label: 'Nou', color: 'bg-blue-100 text-blue-800' },
  CITIT: { label: 'Citit', color: 'bg-yellow-100 text-yellow-800' },
  RASPUNS: { label: 'Răspuns', color: 'bg-green-100 text-green-800' },
  ARHIVAT: { label: 'Arhivat', color: 'bg-gray-100 text-gray-800' }
}

export default async function ContactMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const stats = {
    total: messages.length,
    noi: messages.filter(m => m.status === 'NOU').length,
    citite: messages.filter(m => m.status === 'CITIT').length,
    raspuns: messages.filter(m => m.status === 'RASPUNS').length
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      <div>
        <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Mesaje Contact</h1>
        <p className="text-sm xs:text-base text-gray-600">Mesajele primite din formularul de contact</p>
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
          <p className="text-xs xs:text-sm text-gray-500">Citite</p>
          <p className="text-xl xs:text-2xl font-bold text-yellow-600">{stats.citite}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Răspuns</p>
          <p className="text-xl xs:text-2xl font-bold text-green-600">{stats.raspuns}</p>
        </div>
      </div>

      {/* Lista mesaje */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <InboxIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nu există mesaje încă</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => {
            const status = statusConfig[message.status] || statusConfig.NOU
            
            return (
              <Link
                key={message.id}
                href={`/admin/contact/${message.id}`}
                className={`block bg-white rounded-xl p-3 xs:p-4 border hover:border-[#30919f] hover:shadow-md transition-all ${
                  message.status === 'NOU' ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 xs:gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm xs:text-base truncate max-w-[150px] xs:max-w-none">{message.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    
                    <div className="flex flex-col xs:flex-row xs:flex-wrap gap-1 xs:gap-x-4 xs:gap-y-1 text-xs xs:text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1 min-w-0">
                        <EnvelopeIcon className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                        <span className="truncate">{message.email}</span>
                      </span>
                      {message.phone && (
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                          {message.phone}
                        </span>
                      )}
                    </div>

                    <p className="text-xs xs:text-sm text-gray-700 line-clamp-2">
                      <ChatBubbleLeftIcon className="h-3 w-3 xs:h-4 xs:w-4 inline mr-1 text-gray-400" />
                      {message.message}
                    </p>
                  </div>

                  <div className="text-left xs:text-right text-xs text-gray-400 whitespace-nowrap">
                    <CalendarIcon className="h-3 w-3 xs:h-4 xs:w-4 inline mr-1" />
                    {new Date(message.createdAt).toLocaleDateString('ro-RO', {
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
