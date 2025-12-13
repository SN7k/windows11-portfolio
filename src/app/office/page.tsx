'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWindowsStore } from '@/contexts/WindowsContext'
import { useVolumeStore } from '@/contexts/VolumeContext'
// Replaced legacy Header/Footer with Windows 11 style StartMenu + Taskbar
import StartMenu from '@/components/StartMenu/StartMenu'
import Taskbar from '@/components/Taskbar/Taskbar'
import DesktopAppsLayout from '@/layouts/DesktopAppsLayout'
import Window from '@/layouts/Window'
import ShutdownDialog from '@/components/ShutdownDialog'
import windowsData from '@/data/windows-data.json'

// Import window components
import MyProjects from '@/components/Windows/MyProjects/MyProjects'
import ContactMe from '@/components/Windows/Mail/Mail'
import AboutMe from '@/components/Windows/AboutMe/AboutMe'
import Calendar from '@/components/Windows/Calendar/Calendar'
import Notepad from '@/components/Windows/Notepad'

interface WindowData {
  id: string
  visible: boolean
  minimized: boolean
  component: React.ComponentType<any>
  iconSrc: string
  title: { en: string }
  zIndex: number
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
  customTheme?: string
}

export default function OfficePage() {
  const router = useRouter()
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showShutdownDialog, setShowShutdownDialog] = useState(false)
  const [windows, setWindows] = useState<WindowData[]>([])
  const [highestZIndex, setHighestZIndex] = useState(0)
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const windowsStore = useWindowsStore()
  const volumeStore = useVolumeStore()

  const components: { [key: string]: React.ComponentType<any> } = {
    MyProjects,
    ContactMe,
    AboutMe,
    Calendar,
    Notepad,
  }

  const entities = windowsData.map((item: any) => ({
    ...item,
    component: components[item.component],
  }))

  useEffect(() => {
    windowsStore.loadState()

    // Handle browser back button
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      setShowShutdownDialog(true)
      // Push state back to prevent navigation
      window.history.pushState(null, '', window.location.pathname)
    }

    // Add initial state
    window.history.pushState(null, '', window.location.pathname)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      const script = document.getElementById('spotify-player-script')
      if (script) {
        document.head.removeChild(script)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openWindow = useCallback((windowId: string) => {
    setWindows((prevWindows) => {
      const existingWindow = prevWindows.find((window) => window.id === windowId)
      if (!existingWindow) {
        const entity = entities.find((entity: any) => entity.id === windowId)
        if (entity) {
          setHighestZIndex(prev => prev + 1)
          const newZIndex = highestZIndex + 1
          setActiveWindow(windowId)
          // Move windowsStore update outside of state setter
          setTimeout(() => windowsStore.addWindow(windowId), 0)
          return [
            ...prevWindows,
            {
              id: entity.id,
              visible: true,
              minimized: false,
              component: entity.component,
              iconSrc: entity.iconSrc,
              title: entity.title,
              zIndex: newZIndex,
              initPositionX: entity.initPositionX,
              initPositionY: entity.initPositionY,
              initWidth: entity.initWidth,
              initHeight: entity.initHeight,
              minWidth: entity.minWidth,
              minHeight: entity.minHeight,
              menuHeaderItemsId: entity.menuHeaderItemsId,
              resizable: entity.resizable,
              windowsHeaderLogo: entity.windowsHeaderLogo,
              isSearchVisible: entity.isSearchVisible,
              customTheme: entity.customTheme,
            }
          ]
        }
      } else {
        handleTaskbarClick(windowId)
      }
      return prevWindows
    })
  }, [entities, windowsStore, highestZIndex])

  useEffect(() => {
    const loadedIds = windowsStore.openWindowIds
    if (loadedIds.length > 0) {
      loadedIds.forEach((windowId) => {
        setWindows((prevWindows) => {
          const existingWindow = prevWindows.find((w) => w.id === windowId)
          if (!existingWindow) {
            const entity = entities.find((entity: any) => entity.id === windowId)
            if (entity) {
              setHighestZIndex(prev => prev + 1)
              const newZIndex = highestZIndex + 1
              
              // Load saved window state
              let savedState = null
              if (typeof window !== 'undefined') {
                const saved = localStorage.getItem(`window-state-${windowId}`)
                if (saved) {
                  try {
                    savedState = JSON.parse(saved)
                  } catch (e) {}
                }
              }
              
              return [
                ...prevWindows,
                {
                  id: windowId,
                  visible: true,
                  minimized: savedState?.minimized || false,
                  component: entity.component,
                  iconSrc: entity.iconSrc,
                  title: entity.title,
                  zIndex: newZIndex,
                  initPositionX: entity.initPositionX,
                  initPositionY: entity.initPositionY,
                  initWidth: entity.initWidth,
                  initHeight: entity.initHeight,
                  minWidth: entity.minWidth,
                  minHeight: entity.minHeight,
                  leftMenuType: entity.leftMenuType,
                  headerToolsId: entity.headerToolsId,
                  menuHeaderItemsId: entity.menuHeaderItemsId,
                  resizable: entity.resizable,
                  windowsHeaderLogo: entity.windowsHeaderLogo,
                  isSearchVisible: entity.isSearchVisible,
                  customTheme: entity.customTheme,
                },
              ]
            }
          }
          return prevWindows
        })
      })
    }
  }, [windowsStore.openWindowIds])

  const toggleStartMenu = () => {
    setShowStartMenu((s) => !s)
  }

  const findWindowZIndex = (windowId: string) => {
    const window = windows.find((window) => window.id === windowId)
    return window ? window.zIndex : 0
  }

  const handleWindowClick = useCallback((windowId: string) => {
    // Close start menu if it's open
    if (showStartMenu) {
      setShowStartMenu(false)
    }
    
    setWindows((prevWindows) => {
      const window = prevWindows.find((window) => window.id === windowId)
      if (!window) return prevWindows;

      // Window clicks only bring to front, don't minimize
      if (window.zIndex !== highestZIndex || activeWindow !== windowId) {
        const newZIndex = highestZIndex + 1;
        setHighestZIndex(newZIndex);
        setActiveWindow(windowId);
        return prevWindows.map((w) =>
          w.id === windowId
            ? { ...w, zIndex: newZIndex }
            : w
        );
      }
      
      return prevWindows;
    });
  }, [highestZIndex, activeWindow, showStartMenu]);

  const handleTaskbarClick = useCallback((windowId: string) => {
    setWindows((prevWindows) => {
      const window = prevWindows.find((w) => w.id === windowId);
      
      // If window doesn't exist, open it
      if (!window) {
        openWindow(windowId);
        return prevWindows;
      }

      // If window is minimized, restore it
      if (window.minimized) {
        const newZIndex = highestZIndex + 1;
        setHighestZIndex(newZIndex);
        setActiveWindow(windowId);
        return prevWindows.map((w) =>
          w.id === windowId
            ? { ...w, minimized: false, zIndex: newZIndex }
            : w
        );
      }
      
      // Check if this window has the highest zIndex (is on top)
      const isTopWindow = prevWindows.every(w => w.id === windowId || w.zIndex < window.zIndex);
      
      // If window is on top and visible, minimize it
      if (isTopWindow && !window.minimized) {
        setActiveWindow(null);
        return prevWindows.map((w) =>
          w.id === windowId
            ? { ...w, minimized: true }
            : w
        );
      }

      // Otherwise, bring window to front
      const newZIndex = highestZIndex + 1;
      setHighestZIndex(newZIndex);
      setActiveWindow(windowId);
      return prevWindows.map((w) =>
        w.id === windowId
          ? { ...w, zIndex: newZIndex, minimized: false }
          : w
      );
    });
  }, [highestZIndex, openWindow]);

  const closeWindow = useCallback((windowId: string) => {
    setWindows((prev) => prev.filter((window) => window.id !== windowId))
    windowsStore.removeWindow(windowId)
  }, [windowsStore])

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, minimized: true } : w))
    )
    setActiveWindow(prev => prev === windowId ? null : prev)
  }, [])

  const isWindowVisible = (windowId: string) => windows.some((window) => window.id === windowId)

  const handleOutsideClick = (event: React.MouseEvent) => {
    if (showStartMenu) {
      const menu = document.querySelector('#win11-start-menu-root')
      const isInside = menu && menu.contains(event.target as Node)
      const startBtn = document.querySelector('#win11-start-btn')
      if (startBtn && startBtn.contains(event.target as Node)) return
      if (!isInside) setShowStartMenu(false)
    }

    const clickedOutsideAnyWindow = windows.every((window) => {
      const windowElement = document.getElementById(window.id)
      return windowElement && !windowElement.contains(event.target as Node)
    })

    if (clickedOutsideAnyWindow) {
      setActiveWindow(null)
    }
  }

  return (
    <section
      className="h-svh w-screen overflow-hidden bg-no-repeat bg-cover bg-center relative"
      style={{ backgroundImage: `url('${require('@/data/cloudinary-images.json').win11Background}')` }}
      onMouseDown={handleOutsideClick}
    >
      <div id="win11-start-menu-root">
        <StartMenu
          isOpen={showStartMenu}
          onClose={() => setShowStartMenu(false)}
          onLaunch={(id) => {
            openWindow(id)
          }}
        />
      </div>
      <DesktopAppsLayout
        entities={entities}
        onToggleMyProjects={() => openWindow('myProjects')}
        onToggleContact={() => openWindow('contact')}
        onToggleAboutMe={() => openWindow('aboutme')}
        onToggleNotepad={() => openWindow('notepad')}
      />
      {windows.map((window) => (
        isWindowVisible(window.id) && (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            iconSrc={window.iconSrc}
            initPositionX={window.initPositionX}
            initPositionY={window.initPositionY}
            initWidth={window.initWidth}
            initHeight={window.initHeight}
            minWidth={window.minWidth}
            minHeight={window.minHeight}
            menuHeaderItemsId={window.menuHeaderItemsId}
            resizable={window.resizable}
            windowsHeaderLogo={window.windowsHeaderLogo}
            isSearchVisible={window.isSearchVisible}
            visible={window.visible}
            minimized={window.minimized}
            zIndex={window.zIndex}
            activeWindow={activeWindow}
            customTheme={window.customTheme}
            onToggleMinimize={() => minimizeWindow(window.id)}
            onCloseWindow={() => closeWindow(window.id)}
            onWindowClick={() => handleWindowClick(window.id)}
            onZIndexChange={(newZIndex) => {
              setHighestZIndex(newZIndex)
              setWindows((prev) =>
                prev.map((w) => (w.id === window.id ? { ...w, zIndex: newZIndex } : w))
              )
            }}
          >
            <window.component 
              onToggleMinimize={() => minimizeWindow(window.id)}
              onCloseWindow={() => closeWindow(window.id)}
              toggleMaximize={() => {
                // Toggle maximize logic can be added here if needed
              }}
              resizable={window.resizable}
              onOpenWindow={openWindow}
            />
          </Window>
        )
      ))}
      <Taskbar
        windows={windows}
        onLaunch={handleTaskbarClick}
        onStartToggle={toggleStartMenu}
        showStart={showStartMenu}
      />
      
      {/* Shutdown Dialog */}
      {showShutdownDialog && (
        <ShutdownDialog
          onCancel={() => setShowShutdownDialog(false)}
          onConfirm={(action) => {
            setShowShutdownDialog(false)
            if (action === 'sleep') {
              // Go to lock screen for sleep
              sessionStorage.setItem('currentScreen', 'lock')
              router.push('/')
            } else {
              // Go to login page for shutdown/restart
              sessionStorage.setItem('currentScreen', 'login')
              router.push('/')
            }
          }}
        />
      )}
    </section>
  )
}
