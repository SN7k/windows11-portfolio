'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface GoBackContextType {
  canGoBack: boolean
  setCanGoBack: (value: boolean) => void
}

const GoBackContext = createContext<GoBackContextType | undefined>(undefined)

export function GoBackProvider({ children }: { children: ReactNode }) {
  const [canGoBack, setCanGoBack] = useState(false)

  return (
    <GoBackContext.Provider value={{ canGoBack, setCanGoBack }}>
      {children}
    </GoBackContext.Provider>
  )
}

export function useGoBackStore() {
  const context = useContext(GoBackContext)
  if (context === undefined) {
    throw new Error('useGoBackStore must be used within a GoBackProvider')
  }
  return context
}
