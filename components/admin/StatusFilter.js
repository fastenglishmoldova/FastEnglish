'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FunnelIcon } from '@heroicons/react/24/outline'

const allStatuses = [
  { value: 'LEAD', label: '🔵 Lead', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'FARA_RASPUNS', label: '🔘 Fără Răspuns', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'CONTACTAT', label: '🟡 Contactat', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'PROGRAMAT', label: '🟠 Programat', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { value: 'PRIMA_LECTIE', label: '🟢 Prima Lecție', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'FINALIZAT_LECTIA', label: '⚫ Finalizat Lecția', color: 'bg-slate-200 text-slate-800 border-slate-400' },
  { value: 'SE_GANDESTE', label: '🔘 Se Gândește', color: 'bg-gray-100 text-gray-600 border-gray-300' },
  { value: 'ASTEPTAM_PLATA', label: '💵 Așteptăm Plata', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'PLATIT', label: '💰 Plătit', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { value: 'STUDIAZA', label: '🟣 Studiază', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'PLECAT', label: '🔴 Plecat', color: 'bg-red-100 text-red-800 border-red-300' },
  { value: 'LOST_LEAD', label: '❌ Lost Lead', color: 'bg-red-200 text-red-900 border-red-400' },
  { value: 'TEST', label: '🧪 Test', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
]

export default function StatusFilter({ basePath }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') || ''

  const handleStatusChange = (status) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.push(`${basePath}?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <FunnelIcon className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filtrează după status:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleStatusChange('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            !currentStatus 
              ? 'bg-[#30919f] text-white border-[#30919f]' 
              : 'bg-white text-gray-600 border-gray-300 hover:border-[#30919f] hover:text-[#30919f]'
          }`}
        >
          Toate
        </button>
        
        {allStatuses.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              currentStatus === status.value
                ? status.color + ' ring-2 ring-offset-1 ring-[#30919f]'
                : 'bg-white text-gray-600 border-gray-300 hover:' + status.color.split(' ')[0]
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  )
}
