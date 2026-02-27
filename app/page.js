import HomePage from '@/components/public/HomePage'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export const metadata = {
  title: 'Fast English - Cursuri de Limba Engleză',
  description: 'Învață engleza rapid și eficient cu Fast English! Cursuri pentru toate nivelurile - de la începători la avansați. Profesori calificați, metode moderne de predare.',
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
