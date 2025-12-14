'use client'

import React, { useState, useEffect, useRef } from 'react'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewDate, setViewDate] = useState(new Date())
  const [focusMinutes, setFocusMinutes] = useState(30)
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true)
  const [calendarView, setCalendarView] = useState<'date' | 'month' | 'year'>('date')
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollAccumulator = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        // Don't close if clicking the notification button or time/date
        if (!target.closest('[data-notification-trigger]') && !target.closest('[data-clock-trigger]')) {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Reset to current date and default view when opened
      setViewDate(new Date())
      setCalendarView('date')
      setIsCalendarExpanded(true)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Handle scroll in calendar with smooth accumulation
  const handleCalendarScroll = (e: React.WheelEvent) => {
    e.preventDefault()
    
    // Don't process if currently transitioning
    if (isScrolling) return
    
    // Accumulate scroll delta
    scrollAccumulator.current += e.deltaY
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }
    
    // Reset accumulator after period of inactivity
    scrollTimeout.current = setTimeout(() => {
      scrollAccumulator.current = 0
    }, 150)
    
    // Threshold for triggering navigation (higher = less sensitive)
    const threshold = 100
    
    // Check if accumulated scroll exceeds threshold
    if (Math.abs(scrollAccumulator.current) >= threshold) {
      setIsScrolling(true)
      
      if (scrollAccumulator.current > 0) {
        // Scroll down - go to next
        handleNextMonth()
      } else {
        // Scroll up - go to previous
        handlePrevMonth()
      }
      
      // Reset accumulator
      scrollAccumulator.current = 0
      
      // Reset scrolling state after animation
      setTimeout(() => {
        setIsScrolling(false)
      }, 300)
    }
  }

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  // Format Header Date (e.g., Sun, 14 Dec)
  const formatHeaderDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const generateCalendarGrid = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    
    // Previous month filler
    const daysInPrevMonth = getDaysInMonth(year, month - 1)
    const prevMonthDays = []
    for (let i = firstDay - 1; i >= 0; i--) {
      prevMonthDays.push({ day: daysInPrevMonth - i, type: 'prev' })
    }

    // Current month days
    const currentMonthDays = []
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({ day: i, type: 'current' })
    }

    // Next month filler (to complete 42 cells grid 6x7)
    const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length)
    const nextMonthDays = []
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push({ day: i, type: 'next' })
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }

  const calendarGrid = generateCalendarGrid()
  
  const isSelectedDate = (day: number, type: string) => {
    if (type !== 'current') return false
    return day === currentDate.getDate() && 
           viewDate.getMonth() === currentDate.getMonth() && 
           viewDate.getFullYear() === currentDate.getFullYear()
  }

  const handlePrevMonth = () => {
    if (calendarView === 'date') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
    } else if (calendarView === 'month') {
      setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1))
    } else if (calendarView === 'year') {
      setViewDate(new Date(viewDate.getFullYear() - 10, viewDate.getMonth(), 1))
    }
  }

  const handleNextMonth = () => {
    if (calendarView === 'date') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
    } else if (calendarView === 'month') {
      setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1))
    } else if (calendarView === 'year') {
      setViewDate(new Date(viewDate.getFullYear() + 10, viewDate.getMonth(), 1))
    }
  }

  const handleMonthClick = (monthIndex: number, year: number) => {
    setViewDate(new Date(year, monthIndex, 1))
    setCalendarView('date')
  }

  const handleYearClick = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1))
    setCalendarView('month')
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const getMonthsGrid = () => {
    const months = []
    const currentYear = viewDate.getFullYear()
    
    // Current year all 12 months
    for (let i = 0; i < 12; i++) {
      months.push({ month: i, year: currentYear, type: 'current' })
    }
    
    // Next year first 4 months (Jan, Feb, Mar, Apr)
    for (let i = 0; i < 4; i++) {
      months.push({ month: i, year: currentYear + 1, type: 'next' })
    }
    
    return months // Show 4x4 grid (16 months)
  }
  
  const getYearRange = () => {
    const currentYear = viewDate.getFullYear()
    const currentDecadeStart = Math.floor(currentYear / 10) * 10
    // Show 3 years before decade, 10 years in decade, 3 years after
    const startYear = currentDecadeStart - 3
    return Array.from({ length: 16 }, (_, i) => startYear + i)
  }

  return (
    <div 
      ref={panelRef}
      className={`
        fixed bottom-14 right-3 w-[360px] flex flex-col gap-2 
        transition-all duration-300 ease-in-out z-tooltip
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[110%] opacity-0 pointer-events-none'}
      `}
    >
      {/* Notifications Section */}
      <div 
        className="rounded-xl shadow-2xl relative overflow-hidden border border-white/[0.08]"
        style={{
          background: 'rgba(40, 40, 40, 0.90)',
          backdropFilter: 'blur(80px) saturate(200%)'
        }}
      >
        {/* Gradient glow at top like Windows */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

        <div className="flex justify-between items-start mb-6 p-6 pb-0">
          <h3 className="font-semibold text-[15px] tracking-wide text-white">Notifications</h3>
          <div className="p-1.5 hover:bg-white/5 rounded transition-colors cursor-pointer bg-white/[0.04] border border-white/[0.08]">
            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
        </div>
        
        {/* DND Alert */}
        <div className="mb-8 px-6">
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-[18px] h-[18px] text-white fill-white" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span className="font-semibold text-[14px] text-white">Do not disturb is on</span>
          </div>
          <p className="text-[13px] text-gray-400 ml-[30px] leading-snug">
            You&apos;ll only see banners for priority notifications and alarms.
          </p>
          <div className="ml-[30px] mt-1">
            <span className="text-[13px] text-[#60cdff] underline decoration-transparent hover:decoration-[#60cdff] cursor-pointer transition-all">
              Notification settings
            </span>
          </div>
        </div>

        <div className="flex justify-center items-center pb-6 px-6 text-[13px] text-white/60 font-medium">
          No new notifications
        </div>
      </div>
      {/* Calendar Section */}
      <div 
        className="rounded-xl shadow-2xl overflow-hidden relative border border-white/[0.08]"
        style={{
          background: 'rgba(40, 40, 40, 0.90)',
          backdropFilter: 'blur(80px) saturate(200%)'
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

        {/* Header Date: "Sun, 14 Dec" */}
        <div 
          onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
          className="px-4 py-4 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <span className="text-[15px] font-semibold text-white">{formatHeaderDate(currentDate)}</span>
          <div className="w-6 h-6 flex items-center justify-center rounded border border-white/[0.08] bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors">
            <svg 
              className={`w-3 h-3 text-gray-300 transition-transform duration-200 ${isCalendarExpanded ? '' : 'rotate-180'}`}
              fill="currentColor" 
              viewBox="0 0 16 16"
            >
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
        </div>

        {/* Divider */}
        <div 
          className={`h-[1px] bg-white/[0.08] mx-0 transition-all duration-200 ${
            isCalendarExpanded ? 'opacity-100' : 'opacity-0 h-0'
          }`}
        />

        {/* Calendar Body */}
        <div 
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isCalendarExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          onWheel={handleCalendarScroll}
        >
          <div className="px-4 pt-3 pb-2">
          {/* Month Year Controls */}
          <div className="flex justify-between items-center mb-4">
            <span 
              onClick={() => {
                if (calendarView === 'date') setCalendarView('month')
                else if (calendarView === 'month') setCalendarView('year')
              }}
              className="font-semibold text-[15px] text-white hover:text-gray-300 cursor-pointer transition-colors pl-1"
            >
              {calendarView === 'date' && viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {calendarView === 'month' && viewDate.getFullYear()}
              {calendarView === 'year' && `${getYearRange()[3]} - ${getYearRange()[12]}`}
            </span>
            <div className="flex gap-1">
              <button 
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                </svg>
              </button>
              <button 
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Date View */}
          {calendarView === 'date' && (
            <>
              {/* Days Header */}
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-[13px] text-white font-semibold">
                    {day}
                  </div>
                ))}
              </div>

              {/* Date Grid */}
              <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                {calendarGrid.map((dateObj, index) => (
                  <div 
                    key={index}
                    className={`
                      h-9 w-9 mx-auto flex items-center justify-center rounded-full text-[13px] cursor-default border border-transparent transition-all
                      ${dateObj.type !== 'current' ? 'text-gray-500' : 'text-white hover:border-gray-500'}
                      ${isSelectedDate(dateObj.day, dateObj.type) ? '!bg-[#dadada] !text-black font-semibold !border-transparent' : ''} 
                    `}
                  >
                    {dateObj.day}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Month View */}
          {calendarView === 'month' && (
            <div className="grid grid-cols-4 gap-x-0 gap-y-2 px-2">
              {getMonthsGrid().map((item, index) => {
                const isCurrentMonth = item.month === currentDate.getMonth() && item.year === currentDate.getFullYear()
                const isNextYear = item.type === 'next'
                
                return (
                  <button
                    key={index}
                    onClick={() => handleMonthClick(item.month, item.year)}
                    className={`
                      w-16 h-16 mx-auto flex items-center justify-center rounded-full text-[13px] transition-all cursor-pointer
                      ${isCurrentMonth ? 'bg-[#c8c8c8] text-black font-medium' : isNextYear ? 'text-gray-500 hover:bg-white/5' : 'text-white hover:bg-white/5'}
                    `}
                  >
                    {monthNames[item.month]}
                  </button>
                )
              })}
            </div>
          )}

          {/* Year View */}
          {calendarView === 'year' && (
            <div className="grid grid-cols-4 gap-x-0 gap-y-2 px-2">
              {getYearRange().map((year, index) => {
                const isCurrentYear = year === currentDate.getFullYear()
                const currentDecadeStart = Math.floor(currentDate.getFullYear() / 10) * 10
                const isOutOfMainDecade = year < currentDecadeStart || year >= currentDecadeStart + 10
                
                return (
                  <button
                    key={year}
                    onClick={() => handleYearClick(year)}
                    className={`
                      w-16 h-16 mx-auto flex items-center justify-center rounded-full text-[13px] transition-all cursor-pointer
                      ${isCurrentYear ? 'bg-[#c8c8c8] text-black font-medium' : isOutOfMainDecade ? 'text-gray-500 hover:bg-white/5' : 'text-white hover:bg-white/5'}
                    `}
                  >
                    {year}
                  </button>
                )
              })}
            </div>
          )}

        </div>
        </div>

      </div>
    </div>
  )
}
