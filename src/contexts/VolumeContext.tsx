'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface VolumeContextType {
  volume: number
  setVolume: (volume: number) => void
  playAudio: (audioFile: string) => void
  pauseAudio: (audioFile: string) => void
  resetAudio: (audioFile: string) => void
  unmuteAudio: () => void
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined)

export function VolumeProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState(0.2)
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement }>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVolume = localStorage.getItem('volume')
      const parsedVolume = storedVolume ? parseFloat(storedVolume) : 0.2
      setVolumeState(isNaN(parsedVolume) ? 0.2 : parsedVolume)
    }
  }, [])

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume)
    if (typeof window !== 'undefined') {
      localStorage.setItem('volume', newVolume.toString())
    }
    Object.values(audioElements).forEach((audio) => {
      audio.volume = newVolume
    })
  }

  const playAudio = (audioFile: string) => {
    if (audioElements[audioFile]) {
      audioElements[audioFile].play().catch(() => {
        // Autoplay prevented - requires user interaction first
      })
    } else {
      const audio = new Audio(audioFile)
      audio.volume = volume
      audio.play().catch(() => {
        // Autoplay prevented - requires user interaction first
      })
      setAudioElements((prev) => ({ ...prev, [audioFile]: audio }))
    }
  }

  const pauseAudio = (audioFile: string) => {
    if (audioElements[audioFile]) {
      audioElements[audioFile].pause()
    }
  }

  const resetAudio = (audioFile: string) => {
    if (audioElements[audioFile]) {
      audioElements[audioFile].currentTime = 0
    }
  }

  const unmuteAudio = () => {
    Object.values(audioElements).forEach((audio) => {
      audio.volume = volume
    })
  }

  return (
    <VolumeContext.Provider value={{ volume, setVolume, playAudio, pauseAudio, resetAudio, unmuteAudio }}>
      {children}
    </VolumeContext.Provider>
  )
}

export function useVolumeStore() {
  const context = useContext(VolumeContext)
  if (context === undefined) {
    throw new Error('useVolumeStore must be used within a VolumeProvider')
  }
  return context
}
