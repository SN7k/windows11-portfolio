'use client'

import React, { useState } from 'react'

interface DayData {
  day: number
  month: number
  year: number
  isCurrentMonth: boolean
  isToday: boolean
  date: Date
}

// Utility to get days for the grid
const getDaysInMonth = (date: Date): DayData[] => {
  const year = date.getFullYear()
  const month = date.getMonth()
  
  // First day of the month
  const firstDay = new Date(year, month, 1).getDay()
  // Total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Total days in prev month
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  
  const days: DayData[] = []
  
  // Previous month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(year, month - 1, daysInPrevMonth - i)
    })
  }
  
  // Current month fill
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i)
    days.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true,
      isToday: d.toDateString() === today.toDateString(),
      date: d
    })
  }
  
  // Next month fill to complete 42 (6 rows * 7 cols) grid for visual consistency
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(year, month + 1, i)
    })
  }
  
  return days
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sidebarDate, setSidebarDate] = useState(new Date())
  const [view, setView] = useState<'day' | 'week' | 'month'>('month')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedDate, setHighlightedDate] = useState<Date | null>(null)

  // Navigate functions
  const navMainMonth = (dir: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + dir, 1))
  }

  const navMainDay = (dir: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + dir)
    setCurrentDate(newDate)
  }

  const navMainWeek = (dir: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (dir * 7))
    setCurrentDate(newDate)
  }

  const handleNavigation = (dir: number) => {
    if (view === 'day') navMainDay(dir)
    else if (view === 'week') navMainWeek(dir)
    else navMainMonth(dir)
  }
  
  const navSidebarMonth = (dir: number) => {
    setSidebarDate(new Date(sidebarDate.getFullYear(), sidebarDate.getMonth() + dir, 1))
  }

  const goToday = () => {
    const now = new Date()
    setCurrentDate(now)
    setSidebarDate(now)
  }

  // Search for date
  const handleSearch = (value: string) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '')
    
    if (digits.length === 8) {
      // Parse as DDMMYYYY
      const day = parseInt(digits.substring(0, 2))
      const month = parseInt(digits.substring(2, 4)) - 1
      const year = parseInt(digits.substring(4, 8))
      
      const parsedDate = new Date(year, month, day)
      
      if (!isNaN(parsedDate.getTime()) && 
          parsedDate.getDate() === day && 
          parsedDate.getMonth() === month) {
        setCurrentDate(new Date(year, month, 1))
        setSidebarDate(new Date(year, month, 1))
        setHighlightedDate(parsedDate)
        setView('month')
        setSearchQuery('')
        setIsSearchOpen(false)
      }
    }
  }

  const formatSearchInput = (value: string) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '').substring(0, 8)
    
    let formatted = ''
    if (digits.length > 0) {
      formatted = digits.substring(0, 2)
      if (digits.length >= 3) {
        formatted += '/' + digits.substring(2, 4)
      }
      if (digits.length >= 5) {
        formatted += '/' + digits.substring(4, 8)
      }
    }
    
    return formatted
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSearchInput(e.target.value)
    setSearchQuery(formatted)
    handleSearch(formatted)
  }

  // Get current week days
  const getWeekDays = (date: Date): DayData[] => {
    const dayOfWeek = date.getDay()
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - dayOfWeek)
    
    const weekDays: DayData[] = []
    const today = new Date()
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      weekDays.push({
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        isCurrentMonth: true,
        isToday: d.toDateString() === today.toDateString(),
        date: d
      })
    }
    
    return weekDays
  }

  // Data for rendering
  const mainGridDays = getDaysInMonth(currentDate)
  const weekDays = getWeekDays(currentDate)
  const sidebarGridDays = getDaysInMonth(sidebarDate)

  // Formatters
  const monthYearFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
  const weekYearFormat = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const weekShortFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
  const dayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const sidebarMonthFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })

  // Get week date range text
  const getWeekRangeText = () => {
    if (view !== 'week') return ''
    const start = weekDays[0].date
    const end = weekDays[6].date
    return `${weekShortFormat.format(start)} - ${weekShortFormat.format(end)}, ${start.getFullYear()}`
  }

  return (
    <div className="flex h-full w-full bg-[#202020] text-white font-sans overflow-hidden select-none -mt-px">
      <style jsx>{`
        /* Custom scrollbar styling */
        :global(.calendar-scrollbar::-webkit-scrollbar) {
          width: 6px;
          height: 6px;
        }
        :global(.calendar-scrollbar::-webkit-scrollbar-track) {
          background: transparent;
        }
        :global(.calendar-scrollbar::-webkit-scrollbar-thumb) {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }
        :global(.calendar-scrollbar::-webkit-scrollbar-thumb:hover) {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
      
      {/* --------------------------------------------------------------------------------
          LEFT SIDEBAR 
      ----------------------------------------------------------------------------------*/}
      <div className="w-[320px] flex flex-col bg-[#202020] border-r border-white/[0.06] relative z-20">
        
        {/* Mini Calendar Container */}
        <div className="px-4 pb-6 pt-4">
          {/* Mini Calendar Header */}
          <div className="flex items-center justify-between mb-4 pl-2">
            <span className="text-[14px] font-semibold text-white/90">
              {sidebarMonthFormat.format(sidebarDate)}
            </span>
            <div className="flex gap-1">
              <button onClick={() => navSidebarMonth(-1)} className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button onClick={() => navSidebarMonth(1)} className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mini Calendar Grid */}
          <div className="grid grid-cols-7 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-[11px] font-medium text-white/50 py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {sidebarGridDays.slice(0, 42).map((d, i) => (
              <button 
                key={i}
                className={`
                  w-8 h-8 mx-auto flex items-center justify-center text-[12px] rounded-full transition-all border border-transparent
                  ${d.isToday ? 'bg-[#0078D4] text-white font-bold' : ''}
                  ${!d.isToday && d.isCurrentMonth ? 'text-white/90 hover:bg-white/10 hover:border-white/10' : ''}
                  ${!d.isCurrentMonth ? 'text-white/30 hover:text-white/50' : ''}
                `}
              >
                {d.day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------------
          MAIN CONTENT AREA
      ----------------------------------------------------------------------------------*/}
      <div className="flex-1 flex flex-col bg-[#1A1A1A]">
        
        {/* Top Header Toolbar */}
        <div className="h-16 flex items-center justify-between px-3 sm:px-6 border-b border-white/[0.06] min-w-0 bg-[#202020]">
          
          {/* Left: Date & Nav */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0 flex-1">
             <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleNavigation(-1)} className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={() => handleNavigation(1)} className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
             </div>
             <h1 className="text-[14px] sm:text-[18px] lg:text-[24px] font-semibold text-white/90 tracking-tight truncate overflow-hidden">
               {view === 'day' ? dayFormat.format(currentDate) : 
                view === 'week' ? getWeekRangeText() :
                monthYearFormat.format(currentDate)}
             </h1>
          </div>

          {/* Right: Tools */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 bg-[#2D2D2D] rounded px-3 py-1.5 border border-white/10">
                <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder="DD/MM/YYYY"
                  className="bg-transparent outline-none text-[13px] text-white/90 placeholder:text-white/40 w-32"
                  autoFocus
                />
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="text-white/50 hover:text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
            
            <div className="flex bg-[#2D2D2D] rounded-md p-0.5 border border-white/[0.06]">
                <button 
                  onClick={() => setView('day')}
                  className={`px-3 py-1 rounded-[4px] text-[13px] font-medium transition-colors ${
                    view === 'day' 
                      ? 'bg-[#3A3A3A] text-white shadow-sm border border-white/5' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Day
                </button>
                <button 
                  onClick={() => setView('month')}
                  className={`px-3 py-1 rounded-[4px] text-[13px] font-medium transition-colors ${
                    view === 'month' 
                      ? 'bg-[#3A3A3A] text-white shadow-sm border border-white/5' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setView('week')}
                  className={`px-3 py-1 rounded-[4px] text-[13px] font-medium transition-colors ${
                    view === 'week' 
                      ? 'bg-[#3A3A3A] text-white shadow-sm border border-white/5' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Week
                </button>
            </div>
          </div>
        </div>

        {/* Main Grid Header */}
        {view !== 'day' && (
          <div className="grid grid-cols-7 border-b border-white/[0.06] bg-[#202020]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
               <div key={day} className={`text-center py-3 text-[13px] font-semibold ${i === 0 ? 'text-[#0078D4]' : 'text-white/70'}`}>
                 {day}
               </div>
            ))}
          </div>
        )}

        {/* DAY VIEW */}
        {view === 'day' && (
          <div className="flex-1 overflow-auto calendar-scrollbar">
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-white/60 text-[13px] mb-4">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                
                {/* Time slots */}
                <div className="space-y-0 relative">
                  {Array.from({ length: 24 }, (_, i) => {
                    const now = new Date()
                    const isToday = currentDate.toDateString() === now.toDateString()
                    const currentHour = now.getHours()
                    const currentMinute = now.getMinutes()
                    const isCurrentHour = isToday && i === currentHour
                    
                    return (
                      <div key={i} className="flex border-b border-white/[0.06] min-h-[60px] relative">
                        <div className={`w-20 text-[13px] pt-2 pr-4 text-right ${isCurrentHour ? 'text-[#0078D4] font-semibold' : 'text-white/50'}`}>
                          {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                        </div>
                        <div className="flex-1 relative">
                          {/* Current time indicator */}
                          {isCurrentHour && (
                            <div 
                              className="absolute left-0 right-0 flex items-center z-10"
                              style={{ top: `${currentMinute}px` }}
                            >
                              <div className="w-3 h-3 bg-[#0078D4] rounded-full border-2 border-white/20"></div>
                              <div className="flex-1 h-[2px] bg-[#0078D4]"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WEEK VIEW */}
        {view === 'week' && (
          <div className="flex-1 overflow-auto calendar-scrollbar">
            <div className="grid grid-cols-7 min-h-0">
              {weekDays.map((d, dayIndex) => (
                <div key={dayIndex} className="border-r border-white/[0.06] last:border-r-0">
                  {/* Day header */}
                  <div className={`text-center py-3 border-b border-white/[0.06] ${d.isToday ? 'bg-[#0078D4]/20' : ''}`}>
                    <div className={`text-[11px] font-medium ${dayIndex === 0 ? 'text-[#0078D4]' : 'text-white/70'}`}>
                      {d.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-[20px] font-semibold mt-1 ${
                      d.isToday 
                        ? 'bg-[#0078D4] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                        : 'text-white/90'
                    }`}>
                      {d.day}
                    </div>
                  </div>
                  
                  {/* Time slots for each day */}
                  <div className="space-y-0">
                    {Array.from({ length: 24 }, (_, hour) => (
                      <div key={hour} className="border-b border-white/[0.06] h-[60px] relative hover:bg-white/[0.02]">
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MONTH VIEW */}
        {view === 'month' && (
          <div className="flex-1 grid grid-cols-7 grid-rows-6 overflow-auto calendar-scrollbar">
            {mainGridDays.map((d, i) => {
              const isHighlighted = highlightedDate && 
                d.day === highlightedDate.getDate() && 
                d.month === highlightedDate.getMonth() && 
                d.year === highlightedDate.getFullYear()
              
              return (
                <div 
                  key={i} 
                  className={`
                    relative p-2 group transition-colors select-none
                    border-b border-r border-white/[0.06]
                    ${!d.isCurrentMonth ? 'bg-[#1A1A1A] text-white/30' : 'bg-[#1A1A1A] text-white/90'}
                    ${isHighlighted ? 'bg-[#0078D4]/20 ring-2 ring-[#0078D4] ring-inset' : 'hover:bg-[#252525]'}
                  `}
                >
                  {/* Date Number */}
                  <span className={`
                    text-[13px] font-medium inline-block
                    ${d.isToday 
                      ? 'bg-[#0078D4] text-white rounded-full w-6 h-6 flex items-center justify-center -ml-1 -mt-1' 
                      : i % 7 === 0 && d.isCurrentMonth ? 'text-[#0078D4]' : ''}
                  `}>
                    {d.isToday ? d.day : (d.day === 1 ? `${d.date.toLocaleString('default', { month: 'short' })} ${d.day}` : d.day)}
                  </span>

                  {/* Hover Effect Border Overlay */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 pointer-events-none transition-colors"></div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
