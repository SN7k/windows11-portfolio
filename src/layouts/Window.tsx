'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import WindowMinimize from '@/components/Buttons/WindowMinimize'
import WindowMaximize from '@/components/Buttons/WindowMaximize'
import WindowClose from '@/components/Buttons/WindowClose'
import WindowHeaderSearch from '@/components/Windows/WindowHeaderSearch'
import WindowHeaderDropdown from '@/components/Windows/WindowHeaderDropdown'
import menuHeaderData from '@/data/header-menu-data.json'
import React from 'react'

interface WindowProps {
  id: string
  title: { en: string }
  iconSrc: string
  initPositionX: number
  initPositionY: number
  initWidth: number
  initHeight: number
  minWidth: number
  minHeight: number
  menuHeaderItemsId: string
  resizable: boolean
  windowsHeaderLogo: boolean
  isSearchVisible: boolean
  visible: boolean
  minimized: boolean
  zIndex: number
  activeWindow: string | null
  customTheme?: string
  onToggleMinimize: () => void
  onCloseWindow: () => void
  onWindowClick: () => void
  onZIndexChange: (zIndex: number) => void
  children: React.ReactNode
}

export default function Window({
  id,
  title,
  iconSrc,
  initPositionX,
  initPositionY,
  initWidth,
  initHeight,
  minWidth,
  minHeight,
  menuHeaderItemsId,
  resizable,
  windowsHeaderLogo,
  isSearchVisible,
  visible,
  minimized,
  zIndex,
  activeWindow,
  customTheme,
  onToggleMinimize,
  onCloseWindow,
  onWindowClick,
  onZIndexChange,
  children,
}: WindowProps) {
  // Load saved window state from localStorage
  const loadWindowState = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`window-state-${id}`)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          return null
        }
      }
    }
    return null
  }

  const savedState = loadWindowState()
  
  const [maximized, setMaximized] = useState(savedState?.maximized || false)
  const [windowPosition, setWindowPosition] = useState(
    savedState?.position || { x: initPositionX, y: initPositionY }
  )
  const [windowWidth, setWindowWidth] = useState(savedState?.width || initWidth)
  const [windowHeight, setWindowHeight] = useState(savedState?.height || initHeight)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationType, setAnimationType] = useState<'minimize' | 'restore' | null>(null)
  const [wasMinimized, setWasMinimized] = useState(minimized)
  const [animationTransform, setAnimationTransform] = useState('')
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState('')
  const [initialMouse, setInitialMouse] = useState({ x: 0, y: 0 })
  const [initialWindowSize, setInitialWindowSize] = useState({ width: 0, height: 0 })
  const [initialWindowPosition, setInitialWindowPosition] = useState({ x: 0, y: 0 })
  
  const isDraggingRef = useRef(false)
  const initialMouseRef = useRef({ x: 0, y: 0 })
  const windowRef = useRef<HTMLElement>(null)

  const isActive = id === activeWindow
  const translatedTitle = title.en
  const translatedMenuHeaderItems = (menuHeaderData.menuHeaderItems as any)[menuHeaderItemsId]?.en || []

  const appHeight = typeof window !== 'undefined' ? window.innerHeight : 768
  const appWidth = typeof window !== 'undefined' ? window.innerWidth : 1024
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false

  const windowStyle = maximized || isMobile
    ? {
        width: '100vw',
        height: '100dvh',
        top: '0',
        left: '0',
        zIndex,
      }
    : {
        width: `${windowWidth}px`,
        height: `${windowHeight}px`,
        top: `${windowPosition.y}px`,
        left: `${windowPosition.x}px`,
        zIndex,
      }

  const toggleMaximize = () => {
    if (resizable) {
      setMaximized(!maximized)
    }
  }

  const handleMinimize = () => {
    onToggleMinimize()
  }

  useEffect(() => {
    // Detect when window is being restored from minimized state
    if (wasMinimized && !minimized) {
      setIsAnimating(true)
      setAnimationType('restore')
      calculateTaskbarPosition()
    } else if (!wasMinimized && minimized) {
      setIsAnimating(true)
      setAnimationType('minimize')
      calculateTaskbarPosition()
    }
    setWasMinimized(minimized)
  }, [minimized, wasMinimized])

  const calculateTaskbarPosition = () => {
    if (typeof window === 'undefined') return
    
    // Find the taskbar icon for this window
    const taskbarIcon = document.querySelector(`[data-window-id="${id}"]`)
    if (!taskbarIcon) return
    
    const windowRect = windowRef.current?.getBoundingClientRect()
    const iconRect = taskbarIcon.getBoundingClientRect()
    
    if (!windowRect) return
    
    // Calculate the translation needed to move window center to icon center
    const translateX = iconRect.left + iconRect.width / 2 - (windowRect.left + windowRect.width / 2)
    const translateY = iconRect.top + iconRect.height / 2 - (windowRect.top + windowRect.height / 2)
    
    setAnimationTransform(`translate(${translateX}px, ${translateY}px) scale(0.1)`)
  }

  const dragWindow = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || isResizing || maximized) return
    e.preventDefault()
    e.stopPropagation()

    const deltaX = e.clientX - initialMouseRef.current.x
    const deltaY = e.clientY - initialMouseRef.current.y

    setWindowPosition((prev: { x: number; y: number }) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }))

    initialMouseRef.current = {
      x: e.clientX,
      y: e.clientY
    }
  }, [isResizing, maximized])

  const stopDrag = useCallback(() => {
    isDraggingRef.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('mousemove', dragWindow)
  }, [dragWindow])

  const startDrag = useCallback((e: React.MouseEvent) => {
    if (maximized) return
    e.preventDefault()
    e.stopPropagation()
    
    // Critical: Set draggable to false on the fly
    if (e.currentTarget) {
      (e.currentTarget as HTMLElement).draggable = false
    }
    
    isDraggingRef.current = true
    initialMouseRef.current = {
      x: e.clientX,
      y: e.clientY
    }
    
    document.body.style.cursor = 'move'
    document.body.style.userSelect = 'none'
    
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('mousemove', dragWindow)
  }, [maximized, stopDrag, dragWindow])

  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    if (maximized) return
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setInitialMouse({ x: e.clientX, y: e.clientY })
    setResizeDirection((e.target as HTMLDivElement).dataset.direction || '')
    setInitialWindowSize({ width: windowWidth, height: windowHeight })
    setInitialWindowPosition({ x: windowPosition.x, y: windowPosition.y })
  }

  const resizeWindow = useCallback((e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - initialMouse.x
    const deltaY = e.clientY - initialMouse.y

    if (resizeDirection === 'right') {
      let newWidth = initialWindowSize.width + deltaX
      newWidth = Math.min(newWidth, appWidth)
      setWindowWidth(newWidth < minWidth ? minWidth : newWidth)
    } else if (resizeDirection === 'bottom') {
      let newHeight = initialWindowSize.height + deltaY
      newHeight = Math.min(newHeight, appHeight)
      setWindowHeight(newHeight < minHeight ? minHeight : newHeight)
    } else if (resizeDirection === 'left') {
      let newWidth = initialWindowSize.width - deltaX
      newWidth = Math.min(newWidth, appWidth)
      if (newWidth >= minWidth) {
        setWindowWidth(newWidth)
        setWindowPosition({ x: initialWindowPosition.x + deltaX, y: windowPosition.y })
      }
    } else if (resizeDirection === 'top') {
      let newHeight = initialWindowSize.height - deltaY
      newHeight = Math.min(newHeight, appHeight)
      if (newHeight >= minHeight) {
        setWindowHeight(newHeight)
        setWindowPosition({ x: windowPosition.x, y: initialWindowPosition.y + deltaY })
      }
    } else if (resizeDirection === 'bottom-right') {
      let newWidth = initialWindowSize.width + deltaX
      let newHeight = initialWindowSize.height + deltaY
      newWidth = Math.min(newWidth, appWidth)
      newHeight = Math.min(newHeight, appHeight)
      setWindowWidth(newWidth < minWidth ? minWidth : newWidth)
      setWindowHeight(newHeight < minHeight ? minHeight : newHeight)
    } else if (resizeDirection === 'bottom-left') {
      let newWidth = initialWindowSize.width - deltaX
      let newHeight = initialWindowSize.height + deltaY
      newWidth = Math.min(newWidth, appWidth)
      newHeight = Math.min(newHeight, appHeight)
      if (newWidth >= minWidth) {
        setWindowWidth(newWidth)
        setWindowPosition({ x: initialWindowPosition.x + deltaX, y: windowPosition.y })
      }
      setWindowHeight(newHeight < minHeight ? minHeight : newHeight)
    } else if (resizeDirection === 'top-right') {
      let newWidth = initialWindowSize.width + deltaX
      let newHeight = initialWindowSize.height - deltaY
      newWidth = Math.min(newWidth, appWidth)
      newHeight = Math.min(newHeight, appHeight)
      setWindowWidth(newWidth < minWidth ? minWidth : newWidth)
      if (newHeight >= minHeight) {
        setWindowHeight(newHeight)
        setWindowPosition({ x: windowPosition.x, y: initialWindowPosition.y + deltaY })
      }
    } else if (resizeDirection === 'top-left') {
      let newWidth = initialWindowSize.width - deltaX
      let newHeight = initialWindowSize.height - deltaY
      newWidth = Math.min(newWidth, appWidth)
      newHeight = Math.min(newHeight, appHeight)
      if (newWidth >= minWidth) {
        setWindowWidth(newWidth)
      }
      if (newHeight >= minHeight) {
        setWindowHeight(newHeight)
      }
      setWindowPosition({ 
        x: newWidth >= minWidth ? initialWindowPosition.x + deltaX : windowPosition.x,
        y: newHeight >= minHeight ? initialWindowPosition.y + deltaY : windowPosition.y
      })
    }
  }, [isResizing, initialMouse, initialWindowSize, initialWindowPosition, resizeDirection, appWidth, appHeight, minWidth, minHeight, windowPosition])

  const stopResize = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', resizeWindow)
      document.addEventListener('mouseup', stopResize)
      return () => {
        document.removeEventListener('mousemove', resizeWindow)
        document.removeEventListener('mouseup', stopResize)
      }
    }
  }, [isResizing, resizeWindow])

  // Save window state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const state = {
        position: windowPosition,
        width: windowWidth,
        height: windowHeight,
        maximized: maximized,
        minimized: minimized,
      }
      localStorage.setItem(`window-state-${id}`, JSON.stringify(state))
    }
  }, [id, windowPosition, windowWidth, windowHeight, maximized, minimized])

  if (!visible && !isMobile) return null

  const isCalendarTheme = customTheme === 'calendar'
  const isMailTheme = customTheme === 'mail'
  const isAboutMeTheme = customTheme === 'aboutme'
  const isMyProjectsTheme = customTheme === 'myprojects'
  const hasCustomTheme = isCalendarTheme || isMailTheme || isAboutMeTheme || isMyProjectsTheme
  const hideHeader = isMyProjectsTheme // Only MyProjects hides the header completely

  return (
    <section
      ref={windowRef}
      id={id}
      onMouseDownCapture={(e) => {
        onWindowClick()
      }}
      className={`
        absolute flex flex-col overflow-hidden 
        ${hasCustomTheme ? 'bg-[#202020]' : 'bg-[#202020]'} text-white
        ${maximized ? '' : 'shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_1px_rgba(255,255,255,0.1)] rounded-[8px]'}
        ${hasCustomTheme && !maximized ? 'border border-[#606060]' : 'border border-[#606060]'}
        ${isAnimating && animationType === 'minimize' ? 'window-minimizing' : ''}
        ${isAnimating && animationType === 'restore' ? 'window-restoring' : ''}
        ${minimized && !isAnimating ? 'opacity-0 pointer-events-none' : ''}
      `}
      style={{ 
        ...windowStyle, 
        userSelect: 'none',
        pointerEvents: minimized && !isAnimating ? 'none' : 'auto',
        '--minimize-transform': animationTransform
      } as any}
      onAnimationEnd={() => {
        setIsAnimating(false)
        setAnimationType(null)
      }}
    >
      {/* ------------------------------------------
        Window Header (Title Bar) 
        ------------------------------------------
      */}
      {!hideHeader && (
      <div
        className={`
          h-10 w-full shrink-0 flex items-center justify-between pl-3 pr-0 relative
          ${maximized ? '' : 'rounded-t-[8px]'}
          ${hasCustomTheme ? 'bg-[#1F1F1F]' : 'bg-transparent'}
          select-none
        `}
        onMouseDown={startDrag}
        onDoubleClick={toggleMaximize}
        style={{ pointerEvents: 'auto' } as any}
      >
        {/* Title & Icon Area */}
        <div className="flex items-center gap-3 overflow-hidden select-none" onMouseDown={onWindowClick}>
          {iconSrc && (
            <img 
              src={iconSrc} 
              alt="" 
              className="w-4 h-4 object-contain opacity-90"
              style={{ pointerEvents: 'none' } as any}
            />
          )}
          <span className="text-[12px] font-normal tracking-wide text-white truncate">
            {translatedTitle}
          </span>
        </div>

        {/* Window Controls (Minimize, Maximize, Close) */}
        <div className="h-full flex items-center gap-0" style={{ pointerEvents: 'auto' } as any}>
          {/* Windows 11 Style Buttons */}
          <button
            onClick={handleMinimize}
            className="w-11 h-10 flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            title="Minimize"
          >
            <svg width="10" height="1" viewBox="0 0 10 1" fill="none">
              <rect width="10" height="1" fill="white" />
            </svg>
          </button>
          <button
            onClick={toggleMaximize}
            disabled={!resizable}
            className={`w-11 h-10 flex items-center justify-center transition-colors ${
              resizable ? 'hover:bg-[rgba(255,255,255,0.1)]' : 'opacity-50 cursor-default'
            }`}
            title="Maximize"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="0.5" y="0.5" width="9" height="9" stroke="white" strokeWidth="1" fill="none" />
            </svg>
          </button>
          <button
            onClick={onCloseWindow}
            className="w-11 h-10 flex items-center justify-center hover:bg-[#E81123] transition-colors rounded-tr-[8px]"
            title="Close"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M0.5 0.5L9.5 9.5M9.5 0.5L0.5 9.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      )}

      {/* ------------------------------------------
        Window Content Area
        ------------------------------------------
        Using flex-1 to fill remaining space
      */}
      <div
        className={`flex-1 relative w-full overflow-hidden ${hasCustomTheme ? 'bg-[#202020]' : 'bg-[#202020]'}`}
        onMouseDown={(e) => e.stopPropagation()} 
      >
        {/* Optional Menu Bar / Toolbars (File Explorer Style) - Hidden for custom themes */}
        {!hasCustomTheme && menuHeaderItemsId && (
             <div className="border-b border-white/[0.06] bg-[#202020]">
                <WindowHeaderDropdown dropdownItems={translatedMenuHeaderItems} windowsHeaderLogo={windowsHeaderLogo} />
             </div>
        )}
        
        {/* Main Child Content */}
        <div className="h-full w-full overflow-auto">
             {React.isValidElement(children) 
               ? React.cloneElement(children as React.ReactElement<any>, {
                   toggleMaximize,
                   onToggleMinimize,
                   onCloseWindow,
                   resizable,
                   onDragStart: startDrag
                 })
               : children
             }
        </div>
      </div>

      {/* ------------------------------------------
        Resize Handles 
        ------------------------------------------
      */}
      {resizable && !maximized && (
        <>
          {/* Edge handles */}
          <div
            className="absolute top-0 right-0 w-1.5 h-full cursor-e-resize hover:bg-white/10 transition-colors z-50"
            onMouseDown={startResize}
            data-direction="right"
          />
          <div
            className="absolute bottom-0 left-0 h-1.5 w-full cursor-s-resize hover:bg-white/10 transition-colors z-50"
            onMouseDown={startResize}
            data-direction="bottom"
          />
          <div
            className="absolute top-0 left-0 w-1.5 h-full cursor-w-resize hover:bg-white/10 transition-colors z-50"
            onMouseDown={startResize}
            data-direction="left"
          />
          <div
            className="absolute top-0 left-0 h-1.5 w-full cursor-n-resize hover:bg-white/10 transition-colors z-50"
            onMouseDown={startResize}
            data-direction="top"
          />
          
          {/* Corner handles */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
            onMouseDown={startResize}
            data-direction="bottom-right"
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50"
            onMouseDown={startResize}
            data-direction="bottom-left"
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50"
            onMouseDown={startResize}
            data-direction="top-right"
          />
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50"
            onMouseDown={startResize}
            data-direction="top-left"
          />
        </>
      )}
    </section>
  )
}
