'use client'

// Placeholder Navbar - va fi înlocuit cu designul nou
export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gray-900">
            PI School
          </a>
          <div className="flex items-center gap-4">
            <a href="/inscriere" className="text-sm text-gray-600 hover:text-gray-900">
              Înscriere
            </a>
            <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
