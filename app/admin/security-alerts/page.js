'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const SEVERITY_STYLES = {
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
}

const TYPE_LABELS = {
  brute_force: 'Atac Brute Force',
  suspicious_login: 'Login Suspect',
  admin_created: 'Admin Creat',
  teacher_created: 'Profesor Creat',
  '2fa_disabled': '2FA Dezactivat',
  '2fa_reset': '2FA Resetat',
  export_data: 'Export Date',
  delete_user: 'Utilizator Șters',
  login_failed_multiple: 'Login-uri Eșuate Multiple',
  step_up_failed_multiple: 'Step-up Eșuate Multiple',
  rate_limit_exceeded: 'Rate Limit Depășit',
}

const TYPE_ICONS = {
  brute_force: '🚨',
  suspicious_login: '🔍',
  admin_created: '👤',
  teacher_created: '👨‍🏫',
  '2fa_disabled': '🔓',
  '2fa_reset': '🔄',
  export_data: '📤',
  delete_user: '🗑️',
  login_failed_multiple: '❌',
  step_up_failed_multiple: '⚠️',
  rate_limit_exceeded: '🚫',
}

export default function SecurityAlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [acknowledging, setAcknowledging] = useState(null)
  const [pagination, setPagination] = useState({ total: 0, limit: 50, skip: 0 })
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    acknowledged: '',
  })
  const [availableTypes, setAvailableTypes] = useState([])
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [stats, setStats] = useState({ unacknowledged: 0, critical: 0 })

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.type) params.append('type', filters.type)
      if (filters.severity) params.append('severity', filters.severity)
      if (filters.acknowledged !== '') params.append('acknowledged', filters.acknowledged)
      params.append('limit', pagination.limit.toString())
      params.append('skip', pagination.skip.toString())

      const res = await fetch(`/api/admin/security-alerts?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      setAlerts(data.alerts || [])
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }))
      
      // Calculate stats
      const unack = (data.alerts || []).filter(a => !a.acknowledged).length
      const crit = (data.alerts || []).filter(a => a.severity === 'critical').length
      setStats({ unacknowledged: unack, critical: crit })
      
      // Extract unique types
      if (data.alerts?.length > 0 && availableTypes.length === 0) {
        const types = [...new Set(data.alerts.map(a => a.type))].sort()
        setAvailableTypes(types)
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast.error('Eroare la încărcarea alertelor')
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.limit, pagination.skip, availableTypes.length])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const handleAcknowledge = async (alertId) => {
    setAcknowledging(alertId)
    try {
      const res = await fetch('/api/admin/security-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId })
      })

      if (!res.ok) throw new Error('Failed to acknowledge')

      toast.success('Alertă confirmată')
      fetchAlerts()
    } catch (error) {
      console.error('Error acknowledging alert:', error)
      toast.error('Eroare la confirmarea alertei')
    } finally {
      setAcknowledging(null)
    }
  }

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
      minute: '2-digit'
    })
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Alerte de Securitate</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitorizare și gestionare alerte de securitate
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total alerte</div>
          <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
          <div className="text-sm text-red-600">Neconfirmate</div>
          <div className="text-2xl font-bold text-red-700">{stats.unacknowledged}</div>
        </div>
        <div className="bg-orange-50 rounded-lg shadow p-4 border border-orange-200">
          <div className="text-sm text-orange-600">Critical</div>
          <div className="text-2xl font-bold text-orange-700">{stats.critical}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="text-sm text-green-600">Confirmate</div>
          <div className="text-2xl font-bold text-green-700">
            {alerts.filter(a => a.acknowledged).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tip alertă
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              <option value="">Toate</option>
              {availableTypes.map(type => (
                <option key={type} value={type}>
                  {TYPE_LABELS[type] || type}
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
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.acknowledged}
              onChange={(e) => handleFilterChange('acknowledged', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              <option value="">Toate</option>
              <option value="false">Neconfirmate</option>
              <option value="true">Confirmate</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ type: '', severity: '', acknowledged: '' })
                setPagination(prev => ({ ...prev, skip: 0 }))
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Resetează filtre
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow text-center py-12 text-gray-500">
            Nu există alerte pentru filtrele selectate
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow border-l-4 ${
                alert.acknowledged 
                  ? 'border-gray-300 opacity-75' 
                  : alert.severity === 'critical' 
                    ? 'border-red-500' 
                    : 'border-yellow-500'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">
                      {TYPE_ICONS[alert.type] || '⚠️'}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {alert.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          SEVERITY_STYLES[alert.severity] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.severity}
                        </span>
                        {alert.acknowledged && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            ✓ Confirmat
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.message}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{formatDate(alert.createdAt)}</span>
                        {alert.ipAddress && (
                          <span className="font-mono">IP: {alert.ipAddress}</span>
                        )}
                        {alert.sentVia?.length > 0 && (
                          <span>
                            Trimis via: {alert.sentVia.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {alert.details && (
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                      >
                        Detalii
                      </button>
                    )}
                    {!alert.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        disabled={acknowledging === alert.id}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50"
                      >
                        {acknowledging === alert.id ? 'Se confirmă...' : 'Confirmă'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && alerts.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Afișare <span className="font-medium">{pagination.skip + 1}</span> -{' '}
            <span className="font-medium">
              {Math.min(pagination.skip + pagination.limit, pagination.total)}
            </span>{' '}
            din <span className="font-medium">{pagination.total}</span> alerte
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(0, pagination.skip - pagination.limit))}
              disabled={pagination.skip === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              ← Anterior
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.skip + pagination.limit)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Următor →
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{TYPE_ICONS[selectedAlert.type] || '⚠️'}</span>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedAlert.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded p-4">
                  <p className="text-gray-700">{selectedAlert.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Tip</div>
                    <div className="font-medium">{TYPE_LABELS[selectedAlert.type] || selectedAlert.type}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Severitate</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      SEVERITY_STYLES[selectedAlert.severity] || 'bg-gray-100'
                    }`}>
                      {selectedAlert.severity}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-500">Data/Ora</div>
                    <div className="font-medium">{formatDate(selectedAlert.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">IP Address</div>
                    <div className="font-mono">{selectedAlert.ipAddress || '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Trimis via</div>
                    <div>{selectedAlert.sentVia?.join(', ') || 'Niciun canal'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Status</div>
                    <div>{selectedAlert.acknowledged ? '✓ Confirmat' : '○ Neconfirmat'}</div>
                  </div>
                </div>

                {selectedAlert.details && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Detalii suplimentare</div>
                    <pre className="bg-gray-900 text-green-400 rounded p-4 overflow-auto text-sm">
                      {JSON.stringify(selectedAlert.details, null, 2)}
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
