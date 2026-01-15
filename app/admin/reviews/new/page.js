import ReviewForm from '@/components/admin/ReviewForm'

export default function NewReviewPage() {
  return (
    <div>
      <div className="mb-4 xs:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl md:text-3xl font-bold text-gray-900">Adaugă Review</h1>
        <p className="text-gray-600 mt-1 xs:mt-2 text-sm xs:text-base">Adaugă un review nou pentru afișare pe site</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-3 xs:p-4 md:p-6">
        <ReviewForm />
      </div>
    </div>
  )
}
