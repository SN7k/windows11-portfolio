"use client"
import React, { useState, useEffect, useRef } from 'react'
import WindowsIcon from '@/components/icons/WindowsIcon'
import NotificationCenter from '@/components/NotificationCenter/NotificationCenter'
import taskbarAppsData from '@/data/taskbar-apps.json'

interface TaskbarProps {
  windows: { id: string; iconSrc: string; title: { en: string }; visible: boolean; minimized: boolean }[]
  onLaunch: (id: string) => void
  onStartToggle: () => void
  showStart: boolean
}

export default function Taskbar({ windows, onLaunch, onStartToggle, showStart }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [hoveredApp, setHoveredApp] = useState<{ id: string; x: number; title: string } | null>(null)
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setCurrentDate(now.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' }))
    }
    
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const taskbarApps = taskbarAppsData
  const pinnedAppIds = taskbarAppsData.map(app => app.id)
  
  // Get all open windows that are not pinned (all windows regardless of minimized state)
  const openWindows = windows.filter(win => !pinnedAppIds.includes(win.id))

  const customTaskbarNames: { [key: string]: string } = taskbarAppsData.reduce((acc, app) => {
    if (app.customName) {
      acc[app.id] = app.customName
    }
    return acc
  }, {} as { [key: string]: string })

  return (
    <>
      {/* Taskbar */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-12 flex items-center md:justify-center z-taskbar"
        style={{
          background: 'rgba(40, 40, 40, 0.85)',
          backdropFilter: 'blur(80px) saturate(200%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Left side - Apps (centered on desktop, left on mobile) */}
        <div className="flex items-center gap-1 pl-1 md:pl-0">
          {/* Start button */}
          <button
            id="win11-start-btn"
            onClick={onStartToggle}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-75 active:scale-[0.85] ${
              showStart ? 'bg-white/[0.12]' : 'hover:bg-white/[0.06] active:bg-white/[0.04]'
            }`}
            aria-label="Start"
          >
            <WindowsIcon />
          </button>
          
          {/* Pinned app icons */}
          {taskbarApps.map((app) => {
            const win = windows.find((w) => w.id === app.id)
            const isOpen = win && (win.visible || win.minimized)
            const isMinimized = win?.minimized
            return (
              <button
                key={app.id}
                data-window-id={app.id}
                onClick={() => {
                  setHoveredApp(null)
                  onLaunch(app.id)
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setHoveredApp({ 
                    id: app.id, 
                    x: rect.left + rect.width / 2,
                    title: customTaskbarNames[app.id] || win?.title?.en || app.id
                  })
                }}
                onMouseLeave={() => setHoveredApp(null)}
                className={`w-10 h-10 rounded-md flex items-center justify-center relative transition-all duration-75 active:scale-[0.85] ${
                  isOpen && !isMinimized ? 'bg-white/[0.12]' : 'hover:bg-white/[0.06] active:bg-white/[0.04]'
                }`}
                aria-label={win?.title?.en || app.id}
              >
                <img src={app.iconSrc} alt={win?.title?.en || app.id} className="w-6 h-6" />
                {isOpen && (
                  <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-0.5 rounded-full bg-[#0078D4]" />
                )}
              </button>
            )
          })}
          
          {/* Open windows (not pinned) */}
          {openWindows.map((win) => (
            <button
              key={win.id}
              data-window-id={win.id}
              onClick={() => {
                setHoveredApp(null)
                onLaunch(win.id)
              }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setHoveredApp({ 
                  id: win.id, 
                  x: rect.left + rect.width / 2,
                  title: win.title.en
                })
              }}
              onMouseLeave={() => setHoveredApp(null)}
              className={`w-10 h-10 rounded-md flex items-center justify-center relative transition-all duration-75 active:scale-[0.85] ${
                !win.minimized ? 'bg-white/[0.12]' : 'hover:bg-white/[0.06] active:bg-white/[0.04]'
              }`}
              aria-label={win.title.en}
            >
              <img src={win.iconSrc} alt={win.title.en} className="w-6 h-6" />
              <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-0.5 rounded-full bg-[#0078D4]" />
            </button>
          ))}
        </div>
        
        {/* Right side system tray */}
        <div className="absolute right-0 flex items-center h-full gap-1 pr-1">
          {/* System icons group - WiFi and Volume combined */}
          <button 
            className="h-10 flex items-center gap-2.5 px-2.5 rounded-md hover:bg-white/[0.06] active:bg-white/[0.04] transition-all duration-75 active:scale-[0.85]"
            aria-label="Network and Volume"
          >
            {/* WiFi Icon */}
            <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.444 12.444 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049z"/>
              <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.455 9.455 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065zm-2.183 2.183c.226-.226.185-.605-.1-.75A6.473 6.473 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.478 5.478 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091l.016-.015zM9.06 12.44c.196-.196.198-.52-.04-.66A1.99 1.99 0 0 0 8 11.5a1.99 1.99 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"/>
            </svg>
            
            {/* Volume Icon */}
            <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
              <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
              <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
            </svg>
          </button>
          
          {/* Combined Date/Time/Notification section */}
          <button 
            data-clock-trigger
            data-notification-trigger
            onClick={() => setShowNotificationCenter(!showNotificationCenter)}
            className={`h-10 flex items-center gap-2.5 px-2.5 rounded-md transition-all duration-75 active:scale-[0.85] ${
              showNotificationCenter ? 'bg-white/[0.12]' : 'hover:bg-white/[0.06] active:bg-white/[0.04]'
            }`}
            aria-label="Notifications and Calendar"
          >
            {/* Time and Date */}
            <div className="flex flex-col items-end justify-center">
              <span className="text-[11px] text-white leading-[14px] font-normal">{currentTime}</span>
              <span className="text-[11px] text-white/80 leading-[14px] font-normal">{currentDate}</span>
            </div>
            
            {/* Notification Icon */}
            <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Tooltip rendered outside taskbar with fixed positioning */}
      {hoveredApp && (
        <div
          className="fixed bottom-14 whitespace-nowrap px-3 py-2 rounded-lg text-xs text-white font-normal pointer-events-none transition-opacity duration-150 z-tooltip"
          style={{
            left: `${hoveredApp.x}px`,
            transform: 'translateX(-50%)',
            background: 'rgba(43, 43, 43, 0.70)',
            backdropFilter: 'blur(40px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
          }}
        >
          {hoveredApp.title}
        </div>
      )}

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />
    </>
  )
}
