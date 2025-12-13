'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConnectionStore } from '@/contexts/ConnectionContext'
import Win11Splash from '@/components/Loading/Win11Splash'
import LockScreen from '@/components/Loading/LockScreen'
import Login from '@/components/Loading/Login'
import ShutdownScreen from '@/components/Loading/ShutdownScreen'

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(false)
  const [showLock, setShowLock] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showShutdown, setShowShutdown] = useState(false)
  const [showShutdownScreen, setShowShutdownScreen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const connectionStore = useConnectionStore()
  const router = useRouter()

  // Restore screen state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScreen = sessionStorage.getItem('currentScreen')
      const isRestarting = sessionStorage.getItem('isRestarting')
      const isShutdown = sessionStorage.getItem('isShutdown')
      const hasVisited = sessionStorage.getItem('hasVisited')
      
      if (isShutdown === 'true') {
        // Show shutdown screen with animation, then black screen
        setShowShutdownScreen(true)
        setShowSplash(false)
        setShowLock(false)
        setShowLogin(false)
        
        // After 2 seconds, transition to black screen
        setTimeout(() => {
          setShowShutdownScreen(false)
          setShowShutdown(true)
        }, 2000)
      } else if (isRestarting === 'true') {
        // Clear restart flag and start from splash screen
        sessionStorage.removeItem('isRestarting')
        startLoading()
      } else if (savedScreen === 'lock') {
        // Coming from sleep/lock action
        setShowLock(true)
        setShowSplash(false)
        setShowLogin(false)
      } else if (savedScreen === 'login') {
        // Coming from shutdown action
        setShowLogin(true)
        setShowLock(false)
        setShowSplash(false)
      } else if (!hasVisited) {
        // First visit or hard refresh (Ctrl+Shift+R) - start from splash
        sessionStorage.setItem('hasVisited', 'true')
        startLoading()
      } else if (savedScreen === 'splash') {
        setShowSplash(true)
      } else {
        setShowLock(true) // Default to lock screen
      }
      setMounted(true)
    }
  }, [])

  // Handle browser back button on lock screen
  useEffect(() => {
    if (!mounted || !showLock) return

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      // Prevent navigation when on lock screen
      window.history.pushState(null, '', window.location.href)
    }

    // Push initial state
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [showLock, mounted])

  // Handle browser back button on login screen
  useEffect(() => {
    if (!mounted || !showLogin) return

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      // Prevent navigation when on login screen
      window.history.pushState(null, '', window.location.href)
    }

    // Push initial state
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [showLogin, mounted])

  // Handle refresh (F5 or Ctrl+R) when on shutdown black screen
  useEffect(() => {
    if (!mounted || !showShutdown) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // F5 or Ctrl+R or Ctrl+Shift+R
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.shiftKey && e.key === 'R')) {
        e.preventDefault()
        // Clear shutdown state and restart from splash
        sessionStorage.clear()
        sessionStorage.setItem('hasVisited', 'true')
        window.location.reload()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showShutdown, mounted])

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
      {/* Show Windows 11 shutdown screen with spinner */}
      {showShutdownScreen && <ShutdownScreen />}
      
      {/* Show black screen after shutdown animation */}
      {showShutdown ? (
        <div className="absolute inset-0 bg-black" />
      ) : (
        <>
          {/* Shared persistent wallpaper - only show when not on lock/login */}
          {!showLock && !showLogin && !showShutdownScreen && (
            <div
              className="absolute inset-0 bg-center z-0"
              style={{ backgroundImage: `url('${require('@/data/cloudinary-images.json').win11Background}')`, backgroundSize: '112%', backgroundRepeat: 'no-repeat' }}
            ></div>
          )}

          {/* Layers above the wallpaper */}
          {showSplash && <Win11Splash />}
          {showLock && <LockScreen onUnlock={handleUnlock} />}
          {showLogin && <Login />}
        </>
      )}
    </div>
  )
}
