'use client'

import { useEffect } from 'react'

export default function CopyProtection() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow DevTools shortcuts (Ctrl+Shift+C, Ctrl+Shift+I, etc.)
      if (e.shiftKey && e.ctrlKey) {
        return true // Allow all Ctrl+Shift combinations for DevTools
      }

      // Disable Ctrl+A, Ctrl+C, Ctrl+X, Ctrl+U, Ctrl+S
      if (
        (e.ctrlKey && (e.key === 'a' || e.key === 'A')) || // Select All
        (e.ctrlKey && (e.key === 'c' || e.key === 'C')) || // Copy
        (e.ctrlKey && (e.key === 'x' || e.key === 'X')) || // Cut
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) || // View Source
        (e.ctrlKey && (e.key === 's' || e.key === 'S')) || // Save
        (e.metaKey && (e.key === 'a' || e.key === 'A')) || // Mac Select All
        (e.metaKey && (e.key === 'c' || e.key === 'C')) || // Mac Copy
        (e.metaKey && (e.key === 'x' || e.key === 'X')) || // Mac Cut
        (e.metaKey && (e.key === 's' || e.key === 'S'))    // Mac Save
      ) {
        e.preventDefault()
        return false
      }
    }

    // Disable text selection via mouse
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement
      // Allow selection in input and textarea elements
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true
      }
      e.preventDefault()
      return false
    }

    // Disable copy event
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    // Disable cut event
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    // Attach event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCut)

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCut)
    }
  }, [])

  return null
}
