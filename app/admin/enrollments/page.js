import prisma from '@/lib/prisma'
import EnrollmentsTable from '@/components/admin/EnrollmentsTable'

export default async function EnrollmentsPage() {
  // Înscrieri din modalul de pe homepage (cu curs specific)
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { course: true }
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
    city: null,
    observations: i.mesaj,
    status: i.status === 'NOU' ? 'NEW' : 
            i.status === 'CONTACTAT' ? 'CONTACTED' : 
            i.status === 'CONFIRMAT' ? 'CONFIRMED' : 
            i.status === 'RESPINS' ? 'REJECTED' : 'NEW',
    notes: i.notes,
    createdAt: i.createdAt,
    updatedAt: i.updatedAt,
    course: null,
    // Câmpuri specifice pentru formular
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

  return (
    <div className="space-y-4 xs:space-y-6">
      <div>
        <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Înscrieri</h1>
        <p className="text-sm xs:text-base text-gray-600">Gestionează înscrierile primite din toate sursele</p>
      </div>

      <EnrollmentsTable enrollments={JSON.parse(JSON.stringify(allEnrollments))} />
    </div>
  )
}
