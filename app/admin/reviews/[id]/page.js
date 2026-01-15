import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ReviewForm from '@/components/admin/ReviewForm'
import DeleteReviewButton from '@/components/admin/DeleteReviewButton'

export default async function EditReviewPage({ params }) {
  const { id } = await params

  const review = await prisma.review.findUnique({
    where: { id },
    include: { course: true }
  })

  if (!review) {
    notFound()
  }

  return (
    <div>
      <div className="flex flex-col xs:flex-row justify-between items-start gap-3 xs:gap-4 mb-4 xs:mb-6 md:mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl xs:text-2xl md:text-3xl font-bold text-gray-900">Editează Review</h1>
          <p className="text-gray-600 mt-1 xs:mt-2 text-sm xs:text-base truncate">Modifică review-ul de la {review.authorName}</p>
        </div>
        <DeleteReviewButton reviewId={review.id} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-3 xs:p-4 md:p-6">
        <ReviewForm review={review} />
      </div>
    </div>
  )
}
