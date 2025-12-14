"use client"
import React, { useState, useMemo, useEffect } from 'react'
import pinnedApps from '@/data/pinned-apps.json'
import recommendedApps from '@/data/recommended-apps.json'
import windowsData from '@/data/windows-data.json'

interface AppItem {
  id: string
  title: string
  iconSrc: string
}

interface RecommendedItem extends AppItem {
  description: string
  url?: string
}

interface StartMenuProps {
  onLaunch: (id: string) => void
  onClose: () => void
  isOpen?: boolean
  onPowerAction?: (action: 'shutdown' | 'restart' | 'sleep') => void
}

export default function StartMenu({ onLaunch, onClose, isOpen = true, onPowerAction }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllApps, setShowAllApps] = useState(false)
  const [showPowerMenu, setShowPowerMenu] = useState(false)

  const handleClose = () => {
    onClose()
  }

  const handleLaunch = (id: string) => {
    onLaunch(id)
    handleClose()
  }

  const allApps = useMemo(() => {
    const combined = [
      ...(pinnedApps as AppItem[]),
      ...windowsData.map(w => ({
        id: w.id,
        title: w.title.en,
        iconSrc: w.iconSrc
      }))
    ]
    const uniqueMap = new Map()
    combined.forEach(app => uniqueMap.set(app.id, app))
    const sorted = Array.from(uniqueMap.values()).sort((a, b) => a.title.localeCompare(b.title))
    
    const grouped: { [key: string]: AppItem[] } = {}
    sorted.forEach(app => {
      const letter = app.title[0].toUpperCase()
      if (!grouped[letter]) grouped[letter] = []
      grouped[letter].push(app)
    })
    return grouped
  }, [])

  const filteredPinned = useMemo(() => {
    if (!searchQuery.trim()) return pinnedApps as AppItem[]
    const query = searchQuery.toLowerCase()
    return (pinnedApps as AppItem[]).filter(app => 
      app.title.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const filteredRecommended = useMemo(() => {
    if (!searchQuery.trim()) return recommendedApps as RecommendedItem[]
    const query = searchQuery.toLowerCase()
    return (recommendedApps as RecommendedItem[]).filter(item =>
      item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return windowsData.filter(win =>
      win.title.en.toLowerCase().includes(query) || 
      (win.subtitle?.en && win.subtitle.en.toLowerCase().includes(query))
    ).map(win => ({
      id: win.id,
      title: win.title.en,
      iconSrc: win.iconSrc,
      subtitle: win.subtitle?.en
    }))
  }, [searchQuery])

  return (
    <div className="fixed inset-0 pointer-events-none z-startmenu" onClick={handleClose}>
      {/* Menu slides behind taskbar - z-index is below taskbar */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 bottom-14 w-[640px] max-w-[92vw] h-[720px] max-h-[calc(100vh-20vh-3.5rem)] pointer-events-auto rounded-xl overflow-hidden shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%+3.5rem)]'}`}
        style={{
          background: 'rgba(40, 40, 40, 0.90)',
          backdropFilter: 'blur(80px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search bar */}
        <div className="px-6 pt-6 pb-2 flex-shrink-0">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Search for apps, settings, and documents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-3xl text-sm text-white placeholder-white/40 outline-none transition-all focus:ring-1 focus:ring-white/10 focus:border-white/10 shadow-inner"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}
            />
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto calendar-scrollbar">
          {/* Search results view */}
          {searchQuery.trim() && (
          <div className="px-8 py-6 max-h-[450px] overflow-y-auto calendar-scrollbar">
            <span className="text-white/90 text-[13px] font-semibold mb-4 block">Search results</span>
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLaunch(item.id)}
                    className="w-full flex items-center gap-4 rounded-lg p-3 hover:bg-white/[0.06] active:bg-white/[0.08] text-left transition-all"
                  >
                    <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                      <img src={item.iconSrc} alt={item.title} className="w-9 h-9" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[13px] text-white/95 leading-tight truncate">{item.title}</span>
                      {item.subtitle && <span className="text-[11px] text-white/50 leading-tight truncate mt-0.5">{item.subtitle}</span>}
                    </div>
                  </button>
                ))}
                {filteredPinned.length > 0 && (
                  <>
                    <div className="pt-4 pb-2"><span className="text-white/40 text-[11px] font-semibold uppercase tracking-wide">Apps</span></div>
                    {filteredPinned.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleLaunch(app.id)}
                        className="w-full flex items-center gap-4 rounded-lg p-3 hover:bg-white/[0.06] active:bg-white/[0.08] text-left transition-all"
                      >
                        <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                          <img src={app.iconSrc} alt={app.title} className="w-9 h-9" />
                        </div>
                        <span className="text-[13px] text-white/95">{app.title}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
                  <svg className="w-7 h-7 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/></svg>
                </div>
                <p className="text-[14px] text-white/60 font-medium">No results found</p>
                <p className="text-[12px] text-white/35 mt-1.5">Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {/* Default view when no search */}
        {!searchQuery.trim() && !showAllApps && (
          <>
            {/* Pinned apps */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-sm font-semibold tracking-wide text-white/90">Pinned</span>
                <button 
                  onClick={() => setShowAllApps(true)}
                  className="flex items-center gap-1 text-xs text-white/70 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.05] px-2.5 py-1 rounded transition-all"
                >
                  All
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M6 4l4 4-4 4"/></svg>
                </button>
              </div>
              <div className="grid grid-cols-6 gap-y-4 gap-x-2">
                {(pinnedApps as AppItem[]).slice(0, 18).map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleLaunch(app.id)}
                    className="group flex flex-col items-center gap-2 p-2 rounded hover:bg-white/[0.06] active:bg-white/[0.08] transition-all"
                  >
                    <div className="transition-transform group-active:scale-95 w-10 h-10 flex items-center justify-center">
                      <img src={app.iconSrc} alt={app.title} className="w-10 h-10" />
                    </div>
                    <span className="text-[11px] text-center w-full truncate px-1 text-white/90 font-medium leading-tight">
                      {app.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Recommended */}
            <div className="px-8 pb-8 pt-24">
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-sm font-semibold tracking-wide text-white/90">Recommended</span>
                <button className="flex items-center gap-1 text-xs text-white/70 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.05] px-2.5 py-1 rounded transition-all">
                  More
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M6 4l4 4-4 4"/></svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(recommendedApps as RecommendedItem[]).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.url) {
                        window.open(item.url, '_blank')
                        handleClose()
                      } else {
                        handleLaunch(item.id)
                      }
                    }}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-white/[0.06] active:bg-white/[0.08] text-left group transition-all"
                  >
                    <div className="w-8 h-8 flex-shrink-0">
                      <img src={item.iconSrc} alt={item.title} className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-white/90 truncate">{item.title}</span>
                      <span className="text-[11px] text-white/50 truncate">{item.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* All apps view */}
        {!searchQuery.trim() && showAllApps && (
          <div className="px-8 py-6 max-h-[450px] overflow-y-auto calendar-scrollbar">
            <div className="flex items-center justify-between mb-5">
              <span className="text-white/90 text-[13px] font-semibold">All apps</span>
              <button 
                onClick={() => setShowAllApps(false)}
                className="text-[12px] text-white/60 hover:text-white/90 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/[0.06] transition-all"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M10 12l-4-4 4-4"/></svg>
                Back
              </button>
            </div>
            <div className="space-y-5">
              {Object.entries(allApps).map(([letter, apps]) => (
                <div key={letter}>
                  <div className="sticky top-0 py-2 mb-1" style={{ background: 'rgba(32, 32, 32, 0.85)', backdropFilter: 'blur(20px)' }}>
                    <span className="text-white/95 text-[14px] font-semibold">{letter}</span>
                  </div>
                  <div className="space-y-0.5">
                    {apps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleLaunch(app.id)}
                        className="w-full flex items-center gap-4 rounded-lg p-3 hover:bg-white/[0.06] active:bg-white/[0.08] text-left transition-all"
                      >
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <img src={app.iconSrc} alt={app.title} className="w-8 h-8" />
                        </div>
                        <span className="text-[13px] text-white/95 font-normal">{app.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>

        {/* Footer row - always at bottom */}
        <div className="h-16 px-12 flex items-center justify-between mt-auto flex-shrink-0" style={{ background: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 hover:bg-white/10 -ml-4 px-4 py-2 rounded-md cursor-pointer transition-colors group">
            <div className="w-8 h-8 rounded-full overflow-hidden relative border border-white/10">
              <img src={require('@/data/cloudinary-images.json').profile} alt="User" className="w-full h-full object-cover" onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML = '<span class="text-white text-[10px] font-semibold flex items-center justify-center w-full h-full">SK</span>'
              }} />
            </div>
            <span className="text-xs font-medium text-white/90 group-hover:text-white tracking-wide">
              SNK
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowPowerMenu(!showPowerMenu)}
              className="p-2.5 rounded-md hover:bg-white/10 active:bg-white/5 text-white/80 hover:text-white transition-colors"
              title="Power"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"/></svg>
            </button>
            
            {/* Power menu */}
            {showPowerMenu && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-[120px] rounded-lg overflow-hidden shadow-xl transition-transform duration-300 ease-out translate-y-0 opacity-100"
                style={{
                  background: 'rgba(40, 40, 40, 0.95)',
                  backdropFilter: 'blur(80px) saturate(200%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  animation: 'slideUpFade 200ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
                }}
              >
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.08] active:bg-white/[0.04] text-left transition-colors text-white/90 hover:text-white text-[13px] whitespace-nowrap"
                  onClick={() => {
                    setShowPowerMenu(false)
                    onClose()
                    onPowerAction?.('sleep')
                  }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M12 17a1 1 0 100-2 1 1 0 000 2z" />
                    <path d="M8 11V7a4 4 0 118 0v4" />
                  </svg>
                  Lock
                </button>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.08] active:bg-white/[0.04] text-left transition-colors text-white/90 hover:text-white text-[13px] whitespace-nowrap"
                  onClick={() => {
                    setShowPowerMenu(false)
                    onClose()
                    onPowerAction?.('shutdown')
                  }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"/>
                  </svg>
                  Shut down
                </button>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.08] active:bg-white/[0.04] text-left transition-colors text-white/90 hover:text-white text-[13px] whitespace-nowrap"
                  onClick={() => {
                    setShowPowerMenu(false)
                    onClose()
                    onPowerAction?.('restart')
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Restart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
