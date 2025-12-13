'use client'

import { useEffect, useState } from 'react'

export default function ShutdownScreen() {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    // Show "Shutting down..." text after a brief delay
    const timer = setTimeout(() => {
      setShowText(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-8">
        {/* Windows 11 style spinner */}
        {showText && (
          <>
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
            </div>
            
            {/* Shutting down text */}
            <div className="text-white text-2xl font-light tracking-wide">
              Shutting down...
            </div>
          </>
        )}
      </div>
    </div>
  )
}
