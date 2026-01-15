import TeacherForm from '@/components/admin/TeacherForm'

export default function NewTeacherPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Adaugă cont nou</h1>
        <p className="text-gray-600">Creează un cont de profesor sau administrator</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <TeacherForm />
      </div>
    </div>
  )
}
