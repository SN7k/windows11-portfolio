'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WindowsContextType {
  openWindowIds: string[]
  addWindow: (windowId: string) => void
  removeWindow: (windowId: string) => void
  loadState: () => void
}

const WindowsContext = createContext<WindowsContextType | undefined>(undefined)

export function WindowsProvider({ children }: { children: ReactNode }) {
  const [openWindowIds, setOpenWindowIds] = useState<string[]>([])

  const loadState = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('windows')
      setOpenWindowIds(stored ? JSON.parse(stored) : [])
    }
  }

  const saveState = (ids: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('windows', JSON.stringify(ids))
    }
  }

  const addWindow = (windowId: string) => {
    setOpenWindowIds((prev) => {
      if (!prev.includes(windowId)) {
        const newIds = [...prev, windowId]
        saveState(newIds)
        return newIds
      }
      return prev
    })
  }

  const removeWindow = (windowId: string) => {
    setOpenWindowIds((prev) => {
      const newIds = prev.filter((id) => id !== windowId)
      saveState(newIds)
      return newIds
    })
  }

  useEffect(() => {
    loadState()
  }, [])

  return (
    <WindowsContext.Provider value={{ openWindowIds, addWindow, removeWindow, loadState }}>
      {children}
    </WindowsContext.Provider>
  )
}

export function useWindowsStore() {
  const context = useContext(WindowsContext)
  if (context === undefined) {
    throw new Error('useWindowsStore must be used within a WindowsProvider')
  }
  return context
}
