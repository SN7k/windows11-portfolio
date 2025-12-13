'use client'

import { useState } from 'react'

interface ShutdownDialogProps {
  onCancel: () => void
  onConfirm: (action: 'shutdown' | 'restart' | 'sleep') => void
}

// Windows Logo SVG
const WindowsLogo = () => (
  <svg width="46" height="46" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#0078D4" d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm0 34.423l35.67.203.017 34.402L0 76.994zm40.415-33.825l47.581-6.574v41.227l-47.581.276zm47.581 35.188l-.047 41.166-47.534-6.551-.015-34.391z"/>
  </svg>
)

// Computer Icon SVG
const ComputerIcon = () => (
  <svg width="50" height="50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Monitor Stand Base */}
    <path d="M22 48L24 44H40L42 48H22Z" fill="#9CA3AF" stroke="#6B7280" strokeWidth="0.5"/>
    
    {/* Monitor Screen Outer */}
    <rect x="8" y="10" width="48" height="32" rx="1" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>
    {/* Monitor Screen Inner (Bezel) */}
    <rect x="10" y="12" width="44" height="28" fill="#374151"/>
    {/* Display Area */}
    <rect x="12" y="14" width="40" height="24" fill="url(#screen-gradient)"/>
    
    {/* Reflection on screen */}
    <path d="M12 38L52 14V38H12Z" fill="white" fillOpacity="0.1"/>

    {/* Keyboard */}
    <g transform="translate(4, 46)">
        <path d="M0 4C0 2.89543 0.89543 2 2 2H54C55.1046 2 56 2.89543 56 4V10C56 11.1046 55.1046 12 54 12H2C0.89543 12 0 11.1046 0 10V4Z" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1"/>
        {/* Keys */}
        <rect x="4" y="5" width="4" height="4" rx="0.5" fill="white" stroke="#E5E7EB"/>
        <rect x="10" y="5" width="4" height="4" rx="0.5" fill="white" stroke="#E5E7EB"/>
        <rect x="16" y="5" width="4" height="4" rx="0.5" fill="white" stroke="#E5E7EB"/>
        <rect x="22" y="5" width="4" height="4" rx="0.5" fill="white" stroke="#E5E7EB"/>
        <rect x="28" y="5" width="4" height="4" rx="0.5" fill="white" stroke="#E5E7EB"/>
        <rect x="34" y="5" width="4" height="4" rx="0.5" fill="white" stroke="#E5E7EB"/>
        <rect x="40" y="5" width="4" height="4" rx="0.5" fill="white" stroke="#E5E7EB"/>
        <rect x="46" y="5" width="4" height="4" rx="0.5" fill="white" stroke="#E5E7EB"/>
    </g>

    <defs>
      <linearGradient id="screen-gradient" x1="12" y1="14" x2="52" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
    </defs>
  </svg>
)

export default function ShutdownDialog({ onCancel, onConfirm }: ShutdownDialogProps) {
  const [action, setAction] = useState<'shutdown' | 'restart' | 'sleep'>('shutdown')

  // Descriptions map based on selection
  const descriptions: Record<'shutdown' | 'restart' | 'sleep', string> = {
    shutdown: "Closes all apps and turns off the PC.",
    restart: "Closes all apps, turns off the PC, and then turns it on again.",
    sleep: "The PC stays on but uses low power. Apps stay open so when the PC wakes up, you're back to where you left off.",
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-[520px] rounded-lg shadow-2xl overflow-hidden bg-white select-none relative animate-scaleIn"
        style={{
          boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.25)',
          fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar - NO Close Button */}
        <div 
          className="h-[30px] flex items-center px-3"
          style={{
            background: 'linear-gradient(to bottom, #888484ff 0%, #767676 100%)'
          }}
        >
          <span className="text-[12px] text-[#ffffffff] tracking-wide font-normal">Shut Down Windows</span>
        </div>

        {/* Content Body */}
        <div className="p-4 pb-0">
          
          {/* Header: Windows 11 Logo */}
          <div className="flex items-center justify-center mb-5">
            <img src={require('@/data/cloudinary-images.json').windowsFull} alt="Windows 11" className="h-[72px] w-auto" />
          </div>

          {/* Main Interaction Area */}
          <div className="flex gap-4">
            {/* Left: Computer Icon */}
            <div className="w-14 -mt-1 flex justify-center opacity-90">
              <img src="/img/icons/computer.png" alt="Computer" className="w-[50px] h-[50px]" />
            </div>

            {/* Right: Controls */}
            <div className="flex-1 pr-1">
              <p className="text-[12px] text-[#1A1A1A] mb-1">
                What do you want the computer to do?
              </p>

              {/* Native-like Dropdown */}
              <div className="relative mb-5 group">
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as 'shutdown' | 'restart' | 'sleep')}
                  className="w-full h-[28px] pl-2 pr-8 text-[12px] border border-[#7A7A7A] hover:border-[#0078D4] focus:border-[#0078D4] bg-white rounded-[3px] outline-none shadow-sm appearance-none cursor-default transition-colors text-[#1A1A1A]"
                >
                  <option value="shutdown">Shut down</option>
                  <option value="restart">Restart</option>
                  <option value="sleep">Sleep</option>
                </select>
                
                {/* Custom Chevron */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="#555" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Description Text */}
              <div className="min-h-[40px]">
                <p className="text-[12px] text-[#1A1A1A] leading-snug">
                  {descriptions[action]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-white px-3 pb-3 pt-4 flex items-center justify-between">
            {/* Spacer to push buttons right */}
            <div />
            
            <div className="flex gap-2.5">
              <button 
                onClick={() => onConfirm(action)}
                className="w-[74px] h-[24px] text-[12px] bg-white border border-[#0078D4] rounded-[3px] hover:bg-[#E5F1FB] hover:border-[#0078D4] active:bg-[#CCE4F7] focus:ring-1 focus:ring-[#0078D4] focus:ring-inset transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[#1A1A1A]"
              >
                OK
              </button>
              
              <button 
                onClick={onCancel}
                className="w-[74px] h-[24px] text-[12px] bg-white border border-[#ADADAD] rounded-[3px] hover:bg-[#E5E5E5] hover:border-[#7A7A7A] active:bg-[#CCE4F7] active:border-[#005499] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[#1A1A1A]"
              >
                Cancel
              </button>
            </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}
