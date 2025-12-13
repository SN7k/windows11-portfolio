'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConnectionStore } from '@/contexts/ConnectionContext'
import Win11Splash from '@/components/Loading/Win11Splash'
import LockScreen from '@/components/Loading/LockScreen'
import Login from '@/components/Loading/Login'

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(false)
  const [showLock, setShowLock] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [mounted, setMounted] = useState(false)
  const connectionStore = useConnectionStore()
  const router = useRouter()

  // Restore screen state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScreen = sessionStorage.getItem('currentScreen')
      if (savedScreen === 'splash') {
        setShowSplash(true)
      } else if (savedScreen === 'login') {
        setShowLogin(true)
      } else {
        setShowLock(true) // Default to lock screen
      }
      setMounted(true)
    }
  }, [])

  // Save current screen to sessionStorage
  useEffect(() => {
    if (mounted) {
      if (showSplash) {
        sessionStorage.setItem('currentScreen', 'splash')
      } else if (showLogin) {
        sessionStorage.setItem('currentScreen', 'login')
      } else if (showLock) {
        sessionStorage.setItem('currentScreen', 'lock')
      }
    }
  }, [showSplash, showLock, showLogin, mounted])

  const startLoading = () => {
    // Windows 11-style single splash with spinner
    setShowSplash(true)
    setShowLock(false)
    setShowLogin(false)
    setTimeout(() => {
      setShowSplash(false)
      // Show lock screen until user interacts
      setShowLock(true)
    }, 3000)
  }

  useEffect(() => {
    if (mounted && connectionStore.status === 'restart') {
      startLoading()
    }
  }, [connectionStore.status, mounted])

  const handleUnlock = () => {
    setShowLock(false)
    setShowLogin(true)
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="h-svh w-screen bg-black"></div>
  }

  return (
    <div className="relative h-svh w-screen overflow-hidden bg-black">
      {/* Shared persistent wallpaper - only show when not on lock/login */}
      {!showLock && !showLogin && (
        <div
          className="absolute inset-0 bg-center z-0"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dlpskz98w/image/upload/v1765632412/win11_mblqcz.jpg')`, backgroundSize: '112%', backgroundRepeat: 'no-repeat' }}
        ></div>
      )}

      {/* Layers above the wallpaper */}
      {showSplash && <Win11Splash />}
      {showLock && <LockScreen onUnlock={handleUnlock} />}
      {showLogin && <Login />}
    </div>
  )
}
