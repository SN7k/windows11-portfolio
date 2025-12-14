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
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

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
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
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
            You'll only see banners for priority notifications and alarms.
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
        >
          <div className="px-4 pt-3 pb-2">
          {/* Month Year Controls: "December 2025" */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-[15px] text-white hover:text-gray-300 cursor-pointer transition-colors pl-1">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <div className="flex gap-1">
              <button 
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                </svg>
              </button>
              <button 
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-[13px] text-white font-semibold">
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
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
        </div>
        </div>

      </div>
    </div>
  )
}
