'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']

// Parse scheduleTime - poate fi string simplu "18:00" sau JSON {"Luni":"16:00","Miercuri":"18:00"}
const parseScheduleTime = (scheduleTime, scheduleDays) => {
  if (!scheduleTime) return {}
  try {
    const parsed = JSON.parse(scheduleTime)
    if (typeof parsed === 'object') return parsed
  } catch {
    // E string simplu - aplicăm aceeași oră pentru toate zilele
    if (scheduleDays && scheduleDays.length > 0) {
      const times = {}
      scheduleDays.forEach(day => { times[day] = scheduleTime })
      return times
    }
  }
  return {}
}

export default function GroupForm({ group, courses, teachers }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: group?.name || '',
    courseId: group?.courseId || '',
    teacherId: group?.teacherId || '',
    scheduleDays: group?.scheduleDays || [],
    scheduleTimes: parseScheduleTime(group?.scheduleTime, group?.scheduleDays),
    locationType: group?.locationType || 'offline',
    locationDetails: group?.locationDetails || '',
    startDate: group?.startDate ? new Date(group.startDate).toISOString().split('T')[0] : '',
    active: group?.active ?? true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const newDays = prev.scheduleDays.includes(day)
        ? prev.scheduleDays.filter(d => d !== day)
        : [...prev.scheduleDays, day]
      
      // Dacă adăugăm zi, setăm ora default 16:00
      const newTimes = { ...prev.scheduleTimes }
      if (!prev.scheduleDays.includes(day)) {
        newTimes[day] = '16:00'
      } else {
        delete newTimes[day]
      }
      
      return {
        ...prev,
        scheduleDays: newDays,
        scheduleTimes: newTimes
      }
    })
  }

  const handleTimeChange = (day, time) => {
    setFormData(prev => ({
      ...prev,
      scheduleTimes: {
        ...prev.scheduleTimes,
        [day]: time
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = group ? `/api/admin/groups/${group.id}` : '/api/admin/groups'
      const method = group ? 'PUT' : 'POST'

      // Convertim scheduleTimes în JSON string
      const scheduleTime = Object.keys(formData.scheduleTimes).length > 0 
        ? JSON.stringify(formData.scheduleTimes)
        : null

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          courseId: formData.courseId,
          teacherId: formData.teacherId,
          scheduleDays: formData.scheduleDays,
          scheduleTime,
          locationType: formData.locationType,
          locationDetails: formData.locationDetails,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
          active: formData.active
        })
      })

      if (res.ok) {
        toast.success(group ? 'Grupa a fost actualizată' : 'Grupa a fost creată')
        router.push('/admin/groups')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'A apărut o eroare')
      }
    } catch (error) {
      toast.error('A apărut o eroare')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">Nume grupă *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-700"
            placeholder="ex: Programare - Începători A"
          />
        </div>

        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">Curs *</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            <option value="">Selectează curs</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">Profesor *</label>
          <select
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
            className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            <option value="">Selectează profesor</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name || teacher.email}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2">Zile și ore program</label>
          <div className="space-y-2 xs:space-y-3">
            {/* Butoane zile */}
            <div className="flex flex-wrap gap-1.5 xs:gap-2">
              {days.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-2.5 xs:px-3 md:px-4 py-1.5 xs:py-2 rounded-lg text-xs xs:text-sm font-medium transition-colors ${
                    formData.scheduleDays.includes(day)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            
            {/* Ore per zi selectată */}
            {formData.scheduleDays.length > 0 && (
              <div className="mt-2 xs:mt-3 p-2.5 xs:p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-[10px] xs:text-xs text-gray-500 mb-2 xs:mb-3">Setează ora pentru fiecare zi:</p>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 xs:gap-3">
                  {formData.scheduleDays.map(day => (
                    <div key={day} className="flex items-center gap-1.5 xs:gap-2 bg-white p-1.5 xs:p-2 rounded-lg border border-gray-200">
                      <span className="text-xs xs:text-sm font-medium text-gray-700 min-w-[50px] xs:min-w-[60px]">{day}</span>
                      <input
                        type="text"
                        value={formData.scheduleTimes[day] || '16:00'}
                        onChange={(e) => handleTimeChange(day, e.target.value)}
                        placeholder="HH:MM"
                        pattern="[0-9]{2}:[0-9]{2}"
                        className="flex-1 px-1.5 xs:px-2 py-1 xs:py-1.5 border border-gray-300 rounded text-xs xs:text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">Tip locație</label>
          <select
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            <option value="offline">Offline (fizic)</option>
            <option value="online">Online</option>
          </select>
        </div>

        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">
            {formData.locationType === 'online' ? 'Link' : 'Sală'}
          </label>
          <input
            type="text"
            name="locationDetails"
            value={formData.locationDetails}
            onChange={handleChange}
            className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-700"
            placeholder={formData.locationType === 'online' ? 'Link Zoom/Meet' : 'Sala 1'}
          />
        </div>

        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">Dată început</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3 xs:px-4 py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 xs:gap-3">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 xs:w-5 xs:h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-xs xs:text-sm font-medium text-gray-700">Grupă activă</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 pt-3 xs:pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full xs:w-auto px-4 xs:px-6 py-2 text-sm xs:text-base border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 order-2 xs:order-1"
        >
          Anulează
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full xs:w-auto px-4 xs:px-6 py-2 text-sm xs:text-base bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 order-1 xs:order-2"
        >
          {loading ? 'Se salvează...' : (group ? 'Actualizează' : 'Creează grupă')}
        </button>
      </div>
    </form>
  )
}
