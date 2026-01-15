'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const error = searchParams.get('error')

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Autentificare reușită!')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      toast.error('A apărut o eroare la autentificare')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-3 xs:px-4 py-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 xs:space-x-3 mb-5 xs:mb-8">
          <div className="relative w-10 h-10 xs:w-12 xs:h-12 rounded-full overflow-hidden ring-2 ring-[#30919f]/30">
            <Image
              src="/bravito.png"
              alt="Bravito After School"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg xs:text-xl font-bold text-gray-900">BRAVITO</span>
            <span className="text-[9px] xs:text-[10px] font-medium text-[#30919f] tracking-[0.15em] uppercase -mt-1">After School</span>
          </div>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-xl xs:rounded-2xl shadow-xl p-5 xs:p-8">
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900 text-center mb-1.5 xs:mb-2">
            Bine ai venit!
          </h1>
          <p className="text-gray-600 text-center mb-5 xs:mb-8 text-sm xs:text-base">
            Autentifică-te pentru a accesa panoul
          </p>

          {error && (
            <div className="mb-4 xs:mb-6 p-3 xs:p-4 bg-red-50 border border-red-200 rounded-lg xs:rounded-xl text-red-600 text-xs xs:text-sm">
              {error === 'OAuthAccountNotLinked' 
                ? 'Email-ul nu are permisiuni. Contactează administratorul.'
                : error === 'AccessDenied'
                ? 'Accesul a fost refuzat.'
                : 'A apărut o eroare la autentificare.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-5">
            <div>
              <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 border border-gray-300 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm xs:text-base"
                placeholder="email@exemplu.com"
              />
            </div>

            <div>
              <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">
                Parolă
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 border border-gray-300 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm xs:text-base"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 xs:py-3 bg-indigo-600 text-white rounded-lg xs:rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm xs:text-base"
            >
              {loading ? 'Se autentifică...' : 'Autentificare'}
            </button>
          </form>

          <p className="mt-4 xs:mt-6 text-center text-xs xs:text-sm text-gray-500">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
              ← Înapoi la site
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
