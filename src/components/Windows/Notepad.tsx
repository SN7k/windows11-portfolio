'use client'

import { useState } from 'react'

export default function Notepad() {
  const [text, setText] = useState('')

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E] text-white font-['Consolas','Courier_New',monospace] overflow-hidden">
      <style jsx>{`
        textarea::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
      {/* Menu Bar */}
      <div className="h-10 flex items-center px-3 bg-[#2D2D2D] border-b border-[#3E3E3E] text-[13px] flex-shrink-0">
        <button className="px-3 py-1 hover:bg-[#3E3E3E] rounded">File</button>
        <button className="px-3 py-1 hover:bg-[#3E3E3E] rounded">Edit</button>
        <button className="px-3 py-1 hover:bg-[#3E3E3E] rounded">View</button>
        
        {/* Settings icon on the right */}
        <div className="ml-auto">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#3E3E3E] rounded">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              <path d="M14 8.5v-1l-1.5-.5a5 5 0 00-.5-1.2l.8-1.3-1-1-1.3.8a5 5 0 00-1.2-.5L9 2h-2l-.5 1.5a5 5 0 00-1.2.5l-1.3-.8-1 1 .8 1.3a5 5 0 00-.5 1.2L2 7.5v1l1.5.5a5 5 0 00.5 1.2l-.8 1.3 1 1 1.3-.8a5 5 0 001.2.5L7 14h2l.5-1.5a5 5 0 001.2-.5l1.3.8 1-1-.8-1.3a5 5 0 00.5-1.2l1.3-.5z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Text Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        <textarea
          className="w-full h-full p-4 bg-[#1E1E1E] text-[#CCCCCC] resize-none focus:outline-none text-[14px] leading-[1.6] font-['Consolas','Courier_New',monospace]"
          style={{ caretColor: '#FFFFFF' }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder=""
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 flex items-center justify-between px-4 bg-[#2D2D2D] border-t border-[#3E3E3E] text-[11px] text-[#CCCCCC] flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>Ln {text.split('\n').length}, Col {text.length - text.lastIndexOf('\n')}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>100%</span>
          <span>Windows (CRLF)</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  )
}
