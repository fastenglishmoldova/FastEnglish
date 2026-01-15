'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

// Placeholder EnrollmentModal - va fi înlocuit cu designul nou
export default function EnrollmentModal({ isOpen, onClose, course }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-bold mb-4">
          Înscriere: {course?.title || 'Curs'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          Pentru înscriere, vă rugăm să completați formularul de pe pagina dedicată.
        </p>
        
        <a
          href="/inscriere"
          className="block w-full text-center bg-[#30919f] text-white py-3 rounded-lg font-medium hover:bg-[#267a85] transition-colors"
        >
          Mergi la Înscriere
        </a>
      </div>
    </div>
  )
}
