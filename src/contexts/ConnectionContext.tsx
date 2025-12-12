'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type ConnectionStatus = 'disconnected' | 'restart' | 'loggedIn'

interface ConnectionContextType {
  status: ConnectionStatus
  disconnect: () => void
  restart: () => void
  login: () => void
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConnectionStatus>('restart')

  const disconnect = () => setStatus('disconnected')
  const restart = () => setStatus('restart')
  const login = () => setStatus('loggedIn')

  return (
    <ConnectionContext.Provider value={{ status, disconnect, restart, login }}>
      {children}
    </ConnectionContext.Provider>
  )
}

export function useConnectionStore() {
  const context = useContext(ConnectionContext)
  if (context === undefined) {
    throw new Error('useConnectionStore must be used within a ConnectionProvider')
  }
  return context
}
