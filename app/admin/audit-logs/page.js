'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const SEVERITY_STYLES = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
}

const ACTION_LABELS = {
  login: 'Autentificare',
  login_failed: 'Autentificare eșuată',
  login_failed_multiple: 'Autentificări eșuate multiple',
  logout: 'Deconectare',
  '2fa_setup': 'Configurare 2FA',
  '2fa_verify': 'Verificare 2FA',
  '2fa_disabled': 'Dezactivare 2FA',
  '2fa_reset': 'Resetare 2FA',
  create_admin: 'Creare admin',
  create_teacher: 'Creare profesor',
  create_user: 'Creare utilizator',
  change_role: 'Schimbare rol',
  delete_user: 'Ștergere utilizator',
  delete_data: 'Ștergere date',
  export_data: 'Export date',
  step_up_success: 'Step-up reușit',
  step_up_failed: 'Step-up eșuat',
  step_up_failed_multiple: 'Step-up eșuate multiple',
  suspicious_activity: 'Activitate suspectă',
  password_change: 'Schimbare parolă',
  security_alert_acknowledged: 'Alertă confirmată',
}

export default function AuditLogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ total: 0, limit: 50, skip: 0 })
  const [filters, setFilters] = useState({
    action: '',
    severity: '',
    actorId: '',
    startDate: '',
    endDate: '',
  })
  const [availableActions, setAvailableActions] = useState([])
  const [selectedLog, setSelectedLog] = useState(null)

  // Check if user is SUPERADMIN
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'SUPERADMIN') {
      toast.error('Acces permis doar pentru Super Admin')
      router.push('/admin')
    }
  }, [session, status, router])

  const fetchLogs = useCallback(async () => {
    if (!session || session.user.role !== 'SUPERADMIN') return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.action) params.append('action', filters.action)
      if (filters.severity) params.append('severity', filters.severity)
      if (filters.actorId) params.append('actorId', filters.actorId)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      params.append('limit', pagination.limit.toString())
      params.append('skip', pagination.skip.toString())

      const res = await fetch(`/api/admin/audit-logs?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      setLogs(data.logs || [])
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }))
      
      // Extract unique actions
      if (data.logs?.length > 0 && availableActions.length === 0) {
        const actions = [...new Set(data.logs.map(l => l.action))].sort()
        setAvailableActions(actions)
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      toast.error('Eroare la încărcarea logurilor')
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.limit, pagination.skip, availableActions.length])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, skip: 0 }))
  }

  const handlePageChange = (newSkip) => {
    setPagination(prev => ({ ...prev, skip: newSkip }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Istoricul tuturor acțiunilor de securitate din sistem
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Acțiune
            </label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              <option value="">Toate</option>
              {availableActions.map(action => (
                <option key={action} value={action}>
                  {ACTION_LABELS[action] || action}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severitate
            </label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              <option value="">Toate</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data început
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data sfârșit
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ action: '', severity: '', actorId: '', startDate: '', endDate: '' })
                setPagination(prev => ({ ...prev, skip: 0 }))
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Resetează filtre
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total loguri</div>
          <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <div className="text-sm text-blue-600">Info</div>
          <div className="text-2xl font-bold text-blue-700">
            {logs.filter(l => l.severity === 'info').length}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <div className="text-sm text-yellow-600">Warning</div>
          <div className="text-2xl font-bold text-yellow-700">
            {logs.filter(l => l.severity === 'warning').length}
          </div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <div className="text-sm text-red-600">Critical</div>
          <div className="text-2xl font-bold text-red-700">
            {logs.filter(l => l.severity === 'critical').length}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nu există loguri pentru filtrele selectate
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Ora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiune
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilizator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severitate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalii
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                        {log.targetType && (
                          <span className="block text-xs text-gray-500">
                            {log.targetType}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.actor ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {log.actor.name || 'Fără nume'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {log.actor.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Anonim</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {log.ipAddress || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEVERITY_STYLES[log.severity] || SEVERITY_STYLES.info}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.success ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Succes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ✗ Eșuat
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.details && (
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            Vezi detalii
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(0, pagination.skip - pagination.limit))}
                  disabled={pagination.skip === 0}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(pagination.skip + pagination.limit)}
                  disabled={currentPage >= totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Următor
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Afișare <span className="font-medium">{pagination.skip + 1}</span> -{' '}
                    <span className="font-medium">
                      {Math.min(pagination.skip + pagination.limit, pagination.total)}
                    </span>{' '}
                    din <span className="font-medium">{pagination.total}</span> rezultate
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(Math.max(0, pagination.skip - pagination.limit))}
                      disabled={pagination.skip === 0}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      ←
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.skip + pagination.limit)}
                      disabled={currentPage >= totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      →
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Detalii Log
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Acțiune</div>
                    <div className="font-medium">{ACTION_LABELS[selectedLog.action] || selectedLog.action}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Data/Ora</div>
                    <div className="font-medium">{formatDate(selectedLog.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">IP Address</div>
                    <div className="font-mono">{selectedLog.ipAddress || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">User Agent</div>
                    <div className="text-xs truncate" title={selectedLog.userAgent}>
                      {selectedLog.userAgent || '-'}
                    </div>
                  </div>
                </div>

                {selectedLog.actor && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Utilizator</div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="font-medium">{selectedLog.actor.name || selectedLog.actor.email}</div>
                      <div className="text-sm text-gray-500">{selectedLog.actor.email}</div>
                    </div>
                  </div>
                )}

                {selectedLog.details && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Detalii suplimentare</div>
                    <pre className="bg-gray-900 text-green-400 rounded p-4 overflow-auto text-sm">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
