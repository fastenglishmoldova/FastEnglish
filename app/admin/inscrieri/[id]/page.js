import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import InscriereDetailClient from './InscriereDetailClient'

export default async function InscriereDetailPage({ params }) {
  const { id } = await params

  const inscriere = await prisma.inscriere.findUnique({
    where: { id }
  })

  if (!inscriere) {
    notFound()
  }

  return <InscriereDetailClient inscriere={JSON.parse(JSON.stringify(inscriere))} />
}
