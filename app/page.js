import HomePage from '@/components/public/HomePage'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export const metadata = {
  title: 'Pi School - Matematică pentru clasele I-XII',
  description: 'Transformăm matematica într-o aventură captivantă. Lecții personalizate, online și fizice, pentru elevii din clasele I-XII. Pregătire Evaluare Națională și Bacalaureat.',
}

export default function Home() {
  return (
    <>
      <Navbar />
      <HomePage />
      <Footer />
    </>
  )
}
