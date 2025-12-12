'use client'

import { useState, useEffect, useRef } from 'react'
import { useVolumeStore } from '@/contexts/VolumeContext'
import CurrentTime from './CurrentTime'

export default function FooterRight() {
  const volumeStore = useVolumeStore()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isVolumeSettingsDisplayed, setIsVolumeSettingsDisplayed] = useState(false)

  const enterFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen()
      setIsFullScreen(false)
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      }
      setIsFullScreen(true)
    }
  }

  const toggleMusicModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVolumeSettingsDisplayed(!isVolumeSettingsDisplayed)
  }

  const volumeIconSrc = volumeStore.volume === 0 ? '/img/icons/mute-icon-sm.webp' : '/img/icons/volume-icon-sm.webp'

  return (
    <div className="absolute right-0 text-white h-full flex items-center px-1.5 sm:px-3 gap-0.5 bg-footer-right-component footer-left-shadow select-none">
      <img
        className="w-4 h-4 cursor-pointer"
        src="/img/icons/full-screen-icon-sm.webp"
        alt="Full screen"
        title={isFullScreen ? 'Exit full screen' : 'Full screen'}
        onClick={enterFullScreen}
      />
      <img
        className="w-4 h-4 mt-px cursor-pointer"
        src={volumeIconSrc}
        alt="Volume"
        title="Volume"
        onClick={toggleMusicModal}
      />
      {isVolumeSettingsDisplayed && (
        <div className="absolute bottom-10 right-2 bg-white border border-gray-300 rounded p-2 shadow-lg">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volumeStore.volume}
            onChange={(e) => volumeStore.setVolume(parseFloat(e.target.value))}
            className="w-32"
          />
        </div>
      )}
      <CurrentTime />
    </div>
  )
}
