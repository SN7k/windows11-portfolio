'use client'

import React, { useState } from 'react'
import { 
  Minus, 
  Square, 
  X, 
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Star,
  MoreHorizontal,
  Plus,
  LayoutGrid,
  MapPin,
  Briefcase,
  UserCircle,
  Mic,
  Settings,
  ShieldCheck,
  Eye,
  Bus,
  ArrowUpRight
} from 'lucide-react'
import projectsData from '@/data/projects.json'

interface MyProjectsProps {
  onToggleMinimize?: () => void
  onCloseWindow?: () => void
  toggleMaximize?: () => void
  resizable?: boolean
  onDragStart?: (e: React.MouseEvent) => void
}

export default function MyProjects({
  onToggleMinimize,
  onCloseWindow,
  toggleMaximize,
  resizable = true,
  onDragStart
}: MyProjectsProps = {}) {
  const [tabs, setTabs] = React.useState([{
    id: 1,
    title: 'New tab',
    icon: '',
    url: 'edge://newtab',
    displayUrl: 'edge://newtab',
    history: ['edge://newtab'],
    historyIndex: 0,
    isLoading: false,
    showNewTab: true
  }])
  const [activeTabId, setActiveTabId] = React.useState(1)
  const [nextTabId, setNextTabId] = React.useState(2)
  const [searchQuery, setSearchQuery] = React.useState('')

  const activeTab = tabs.find(tab => tab.id === activeTabId)!
  const currentUrl = activeTab.url
  const displayUrl = activeTab.displayUrl
  const isLoading = activeTab.isLoading
  const showNewTab = activeTab.showNewTab
  const history = activeTab.history
  const historyIndex = activeTab.historyIndex
  const tabTitle = activeTab.title
  const tabIcon = activeTab.icon

  const updateActiveTab = (updates: Partial<typeof activeTab>) => {
    setTabs(tabs.map(tab => 
      tab.id === activeTabId ? { ...tab, ...updates } : tab
    ))
  }

  const createNewTab = () => {
    const newTab = {
      id: nextTabId,
      title: 'New tab',
      icon: '',
      url: 'edge://newtab',
      displayUrl: 'edge://newtab',
      history: ['edge://newtab'],
      historyIndex: 0,
      isLoading: false,
      showNewTab: true
    }
    setTabs([...tabs, newTab])
    setActiveTabId(nextTabId)
    setNextTabId(nextTabId + 1)
  }

  const closeTab = (tabId: number) => {
    if (tabs.length === 1) return // Don't close last tab
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId)
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(newTabs)
    
    // Switch to adjacent tab if closing active tab
    if (tabId === activeTabId) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)]
      setActiveTabId(newActiveTab.id)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Check if it's a URL
      let url = searchQuery.trim()
      
      // If it doesn't have a protocol, check if it's a valid URL
      if (!url.match(/^https?:\/\//)) {
        // Check if it looks like a domain
        if (url.match(/^[\w-]+(\.[\w-]+)+/)) {
          url = 'https://' + url
        } else {
          // Otherwise, use Google search
          url = `https://www.google.com/search?q=${encodeURIComponent(url)}`
        }
      }
      
      navigateToUrl(url)
      setSearchQuery('')
    }
  }

  const navigateToUrl = (url: string) => {
    const newHistory = [...history.slice(0, historyIndex + 1), url]
    
    // Get site info
    const urlObj = new URL(url)
    const siteName = urlObj.hostname.replace('www.', '').split('.')[0]
    const title = siteName.charAt(0).toUpperCase() + siteName.slice(1)
    const icon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=16`
    
    updateActiveTab({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      url: url,
      displayUrl: url,
      showNewTab: false,
      isLoading: true,
      title: title,
      icon: icon
    })
  }

  const goHome = () => {
    const newHistory = [...history, 'edge://newtab']
    updateActiveTab({
      showNewTab: true,
      url: 'edge://newtab',
      displayUrl: 'edge://newtab',
      isLoading: false,
      title: 'New tab',
      icon: '',
      history: newHistory,
      historyIndex: newHistory.length - 1
    })
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const url = history[newIndex]
      
      if (url === 'edge://newtab') {
        updateActiveTab({
          historyIndex: newIndex,
          showNewTab: true,
          url: 'edge://newtab',
          displayUrl: 'edge://newtab',
          title: 'New tab',
          icon: ''
        })
      } else {
        const urlObj = new URL(url)
        const siteName = urlObj.hostname.replace('www.', '').split('.')[0]
        updateActiveTab({
          historyIndex: newIndex,
          url: url,
          displayUrl: url,
          showNewTab: false,
          title: siteName.charAt(0).toUpperCase() + siteName.slice(1),
          icon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=16`
        })
      }
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const url = history[newIndex]
      
      if (url === 'edge://newtab') {
        updateActiveTab({
          historyIndex: newIndex,
          showNewTab: true,
          url: 'edge://newtab',
          displayUrl: 'edge://newtab',
          title: 'New tab',
          icon: ''
        })
      } else {
        const urlObj = new URL(url)
        const siteName = urlObj.hostname.replace('www.', '').split('.')[0]
        updateActiveTab({
          historyIndex: newIndex,
          url: url,
          displayUrl: url,
          showNewTab: false,
          title: siteName.charAt(0).toUpperCase() + siteName.slice(1),
          icon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=16`
        })
      }
    }
  }

  const reload = () => {
    if (!showNewTab) {
      updateActiveTab({ isLoading: true })
    }
  }

  return (
    <div className="w-full h-full bg-[#202020] flex flex-col overflow-hidden font-sans text-white select-none">
      
      {/* --------------------------------------------------------------------------------
          TAB STRIP
      ----------------------------------------------------------------------------------*/}
      <div className="h-[42px] flex items-end pl-0 pr-0 bg-[#171717] select-none shrink-0 relative pt-2 justify-between">
           <div className="flex items-end flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
           {/* Tabs */}
           {tabs.map((tab, index) => (
             <div 
               key={tab.id}
               onClick={() => setActiveTabId(tab.id)}
               className={`min-w-[200px] max-w-[240px] h-[34px] ${
                 tab.id === activeTabId ? 'bg-[#333333]' : 'bg-[#252525] hover:bg-[#2a2a2a]'
               } ${index === 0 ? 'rounded-tl-[8px]' : ''} rounded-tr-[8px] flex items-center justify-between px-3 relative group cursor-pointer transition-colors ${
                 tab.id === activeTabId ? 'z-10 shadow-[0_-1px_4px_rgba(0,0,0,0.2)]' : 'z-0'
               }`}
             >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                   {tab.icon && (
                     <img src={tab.icon} alt="" className="w-4 h-4 flex-shrink-0" />
                   )}
                   <span className={`text-[12px] font-medium truncate ${
                     tab.id === activeTabId ? 'text-white' : 'text-white/70'
                   }`}>{tab.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                  className="text-white/50 hover:bg-white/20 rounded p-0.5 cursor-pointer transition-colors flex-shrink-0"
                >
                  <X size={14} />
                </button>
             </div>
           ))}

           {/* New Tab Button */}
           <div 
             onClick={createNewTab}
             className="w-[32px] h-[32px] flex items-center justify-center hover:bg-white/10 rounded-[4px] ml-1 cursor-pointer transition-colors mb-0.5 flex-shrink-0"
           >
              <Plus size={18} className="text-white/70" />
           </div>
           
           {/* Draggable Area */}
           <div 
             className="flex-1 h-[34px] cursor-move mb-0.5"
             onMouseDown={onDragStart}
             onDoubleClick={toggleMaximize}
           />
           </div>

           {/* Window Controls */}
           <div className="flex items-center h-full">
              <button
                onClick={onToggleMinimize}
                className="w-11 h-10 flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                title="Minimize"
              >
                <Minus size={14} className="text-white" />
              </button>
              <button
                onClick={toggleMaximize}
                disabled={!resizable}
                className={`w-11 h-10 flex items-center justify-center transition-colors ${
                  resizable ? 'hover:bg-[rgba(255,255,255,0.1)]' : 'opacity-50 cursor-default'
                }`}
                title="Maximize"
              >
                <Square size={12} className="text-white" />
              </button>
              <button
                onClick={onCloseWindow}
                className="w-11 h-10 flex items-center justify-center hover:bg-[#E81123] transition-colors rounded-tr-[8px]"
                title="Close"
              >
                <X size={14} className="text-white" />
              </button>
           </div>
        </div>

        {/* --------------------------------------------------------------------------------
            NAVIGATION BAR
        ----------------------------------------------------------------------------------*/}
        <div className="h-[44px] bg-[#333333] flex items-center px-2 gap-2 border-b border-black/40 shrink-0 z-20">
           <div className="flex items-center gap-1">
              <button 
                onClick={goBack}
                disabled={historyIndex <= 0}
                className={`p-2 hover:bg-white/10 rounded-[4px] transition-colors ${
                  historyIndex <= 0 ? 'text-white/30 cursor-not-allowed' : 'text-white/80'
                }`}
              >
                <ArrowLeft size={16} />
              </button>
              <button 
                onClick={goForward}
                disabled={historyIndex >= history.length - 1}
                className={`p-2 hover:bg-white/10 rounded-[4px] transition-colors ${
                  historyIndex >= history.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white/80'
                }`}
              >
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={reload}
                className="p-2 hover:bg-white/10 rounded-[4px] text-white hover:text-white transition-colors"
              >
                <RotateCw size={14} />
              </button>
           </div>

           <button 
              onClick={goHome}
              className="p-2 hover:bg-white/10 rounded-[4px] text-white/80"
           >
              <Home size={16} />
           </button>

           {/* Address Bar */}
           <div className="flex-1 h-[32px] bg-[#202020] rounded-[20px] border border-white/10 flex items-center px-4 hover:border-white/20 transition-colors group relative shadow-inner">
              <ShieldCheck size={14} className="text-white/50 mr-3" />
              <span className="text-[13px] text-white/90 selection:bg-[#0078D4] selection:text-white cursor-text w-full truncate">
                {displayUrl}
              </span>
              <div className="ml-auto flex items-center gap-2 text-white/50">
                 <div className="h-4 w-px bg-white/10 mx-1"></div>
                 <Star size={14} className="hover:text-white cursor-pointer transition-colors" />
              </div>
           </div>

           <div className="flex items-center gap-1 pl-1">
              <button className="p-2 hover:bg-white/10 rounded-[4px] text-white/80">
                <img src={require('@/data/cloudinary-images.json').snkIcon} alt="Profile" className="w-5 h-5 rounded-full" />
              </button>
           </div>
        </div>

        {/* --------------------------------------------------------------------------------
            NEW TAB PAGE CONTENT / IFRAME VIEWER
        ----------------------------------------------------------------------------------*/}
        {showNewTab ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-gradient-to-br from-[#1a2942] via-[#0f1b2d] to-[#0a1929]">
           
           {/* Subtle blur overlay for depth */}
           <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-indigo-950/20 backdrop-blur-[2px]"></div>

           {/* Page Content */}
           <div className="relative z-10 w-full h-full flex flex-col items-center pt-[15vh] px-4 sm:px-6 md:px-8">
              
              {/* Header Icons (Top Right) */}
              <div className="absolute top-6 right-6 flex items-center gap-4 text-white/90 text-[13px]">
                 <div className="flex items-center gap-2 cursor-pointer hover:bg-black/20 px-2 py-1 rounded transition-colors">
                    <span>Kolkata</span>
                    <span className="font-semibold text-[14px]">25°C</span>
                    <div className="w-6 h-6 flex items-center justify-center">☁️</div>
                 </div>
              </div>

              {/* ----------------------------------------------------------------
                  SEARCH BAR (EXACT REPLICA)
              ------------------------------------------------------------------*/}
              <form onSubmit={handleSearch} className="w-full max-w-[700px] h-[52px] bg-white rounded-full shadow-md flex items-center px-5 gap-3 mb-10 group transition-all hover:shadow-lg">
                 <Search size={18} className="text-gray-400 flex-shrink-0" />
                 <input 
                    type="text" 
                    placeholder="Search the web" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[16px] text-gray-700 placeholder-gray-400 h-full pb-0.5"
                 />
                 <div className="flex items-center gap-3 flex-shrink-0">
                    <Mic size={20} className="text-gray-500 hover:text-gray-800 cursor-pointer transition-colors" />
                    
                    {/* Multi-colored Visual Search Icon */}
                    <div className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity">
                       <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3.5C10 2.67157 10.6716 2 11.5 2H16.5C19.5376 2 22 4.46243 22 7.5V12.5C22 13.3284 21.3284 14 20.5 14C19.6716 14 19 13.3284 19 12.5V7.5C19 6.11929 17.8807 5 16.5 5H11.5C10.6716 5 10 4.32843 10 3.5Z" fill="#3B82F6"/>
                          <path d="M22 17.5C22 18.3284 21.3284 19 20.5 19H16.5C13.4624 19 11 16.5376 11 13.5V8.5C11 7.67157 11.6716 7 12.5 7C13.3284 7 14 7.67157 14 8.5V13.5C14 14.8807 15.1193 16 16.5 16H20.5C21.3284 16 22 16.6716 22 17.5Z" fill="#A855F7"/>
                          <path d="M14 20.5C14 21.3284 13.3284 22 12.5 22H7.5C4.46243 22 2 19.5376 2 16.5V11.5C2 10.6716 2.67157 10 3.5 10C4.32843 10 5 10.6716 5 11.5V16.5C5 17.8807 6.11929 19 7.5 19H12.5C13.3284 19 14 19.6716 14 20.5Z" fill="#F59E0B"/>
                          <path d="M2 6.5C2 5.67157 2.67157 5 3.5 5H7.5C10.5376 5 13 7.46243 13 10.5V15.5C13 16.3284 12.3284 17 11.5 17C10.6716 17 10 16.3284 10 15.5V10.5C10 9.11929 8.88071 8 7.5 8H3.5C2.67157 8 2 7.32843 2 6.5Z" fill="#EC4899"/>
                       </svg>
                    </div>
                 </div>
              </form>

              {/* ----------------------------------------------------------------
                  QUICK LINKS (Shortcuts)
              ------------------------------------------------------------------*/}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-[1000px] px-4">
                 
                 {/* All Projects from JSON */}
                 {projectsData.projects.map((project) => {
                   return (
                     <EdgeQuickLink 
                       key={project.id}
                       label={project.name} 
                       iconUrl={project.image}
                       bg="bg-[#2D2D2D]"
                       url={project.demo}
                       isCustomIcon={true}
                       onClick={() => navigateToUrl(project.demo)}
                     />
                   )
                 })}

              </div>

           </div>
        </div>
        ) : (
          <div className="flex-1 relative bg-white">
            {isLoading && (
              <div className="absolute inset-0 bg-white z-10 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
              </div>
            )}
            <iframe 
              key={currentUrl}
              src={currentUrl}
              className="w-full h-full border-none"
              onLoad={() => updateActiveTab({ isLoading: false })}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        )}

    </div>
  )
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------

function EdgeQuickLink({ label, icon, iconUrl, bg, url, isCustomIcon, onClick }: { label: string; icon?: React.ReactNode; iconUrl?: string; bg: string; url?: string; isCustomIcon?: boolean; onClick?: () => void }) {
   const [imgError, setImgError] = React.useState(false)
   
   const handleClick = () => {
      if (onClick) {
         onClick()
      }
   }

   return (
      <div className="flex flex-col gap-3 group cursor-pointer bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl" onClick={handleClick}>
         {/* Image Container - Responsive height */}
         <div className={`w-full aspect-video rounded-t-xl ${bg} flex items-center justify-center overflow-hidden shadow-lg relative`}>
            {iconUrl && !imgError ? (
               <img 
                  src={iconUrl} 
                  alt={label} 
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
               />
            ) : icon ? (
               <div className="text-3xl">{icon}</div>
            ) : (
               <div className="text-xl font-bold text-white/80">{label.charAt(0)}</div>
            )}
         </div>
         
         {/* Label - Better organized */}
         <div className="px-4 pb-4">
            <span className="text-[13px] text-white font-medium text-left block">
               {label}
            </span>
         </div>
      </div>
   )
}
