'use client'

import { useRouter } from 'next/navigation'
import { useConnectionStore } from '@/contexts/ConnectionContext'

export default function LoginForm({ className }: { className?: string }) {
  const router = useRouter()
  const connectionStore = useConnectionStore()

  const handleLogin = () => {
    connectionStore.login()
    router.push('/office')
  }

  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <button
        onClick={handleLogin}
        className="px-6 py-2.5 rounded-lg border border-white/40 bg-white/15 hover:bg-white/25 active:bg-white/10 active:scale-[0.98] text-white text-base md:text-lg font-medium backdrop-blur-sm focus:outline-none transition-all duration-100"
      >
        Sign in
      </button>
    </div>
  )
}
