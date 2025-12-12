'use client'

import React, { useState } from 'react'
import { 
  Send, 
  Paperclip, 
  X, 
  MoreHorizontal, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  ImageIcon, 
  Smile,
  Trash2,
  Copy,
  Scissors,
  Clipboard,
  Linkedin
} from 'lucide-react'

export default function Mail() {
  const [to, setTo] = useState('shombhunathkaran@gmail.com')
  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSend = () => {
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    window.location.href = mailtoLink
  }

  return (
    <div className="w-full h-full bg-[#202020] text-white font-sans flex flex-col overflow-hidden select-none">
      
      {/* --------------------------------------------------------------------------------
          TOP COMMAND BAR (Modern Toolbar)
      ----------------------------------------------------------------------------------*/}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.06] bg-[#202020]">
        <div className="flex items-center gap-2">
          {/* Primary Action: Send */}
          <button 
            onClick={handleSend}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#0078D4] hover:bg-[#006cbd] active:bg-[#005a9e] text-white rounded-[4px] shadow-sm transition-all group"
          >
            <Send size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            <span className="text-[14px] font-semibold">Send</span>
          </button>

          <div className="w-px h-5 bg-white/10 mx-1"></div>

          {/* Secondary Actions (Cut/Copy/Paste from image, modernized) */}
          <button className="p-2 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-all" title="Cut">
            <Scissors size={18} strokeWidth={1.5} />
          </button>
          <button className="p-2 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-all" title="Copy">
            <Copy size={18} strokeWidth={1.5} />
          </button>
           <button className="p-2 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-all" title="Paste">
            <Clipboard size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-2">
           {/* Social / LinkedIn Badge (From Reference Image) */}
           <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/30 rounded-[4px] transition-all">
             <Linkedin size={16} />
             <span className="text-[13px] font-medium">LinkedIn</span>
           </button>
           
           <div className="w-px h-5 bg-white/10 mx-1"></div>

           <button className="p-2 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-all">
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------------------
          ADDRESSING AREA
      ----------------------------------------------------------------------------------*/}
      <div className="px-6 py-4 space-y-3 bg-[#202020]">
        
        {/* TO Field */}
        <div className="group flex items-center">
          <label className="w-[60px] text-[13px] text-white/60 font-medium pt-1">To:</label>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-[#2D2D2D] hover:bg-[#323232] focus:bg-[#1C1C1C] border border-transparent focus:border-[#0078D4] rounded-[4px] px-3 py-1.5 text-[14px] text-white placeholder-white/40 outline-none transition-all"
            />
          </div>
        </div>

        {/* FROM Field (Recreated from image) */}
        <div className="group flex items-center">
          <label className="w-[60px] text-[13px] text-white/60 font-medium pt-1">From:</label>
          <div className="flex-1 relative">
            <input 
              type="email" 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-[#2D2D2D] hover:bg-[#323232] focus:bg-[#1C1C1C] border border-transparent focus:border-[#0078D4] rounded-[4px] px-3 py-1.5 text-[14px] text-white placeholder-white/40 outline-none transition-all"
            />
          </div>
        </div>

        {/* SUBJECT Field */}
        <div className="group flex items-center">
          <label className="w-[60px] text-[13px] text-white/60 font-medium pt-1">Subject:</label>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject of your message"
              className="w-full bg-[#2D2D2D] hover:bg-[#323232] focus:bg-[#1C1C1C] border border-transparent focus:border-[#0078D4] rounded-[4px] px-3 py-1.5 text-[14px] font-medium text-white placeholder-white/40 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------------
          EDITOR TOOLBAR (Modern Contextual)
      ----------------------------------------------------------------------------------*/}
      <div className="mx-6 px-1 py-1 flex items-center gap-1 border-b border-white/[0.06] mb-2 bg-[#202020]">
         <button className="p-1.5 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-colors"><Bold size={16} /></button>
         <button className="p-1.5 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-colors"><Italic size={16} /></button>
         <button className="p-1.5 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-colors"><Underline size={16} /></button>
         <div className="w-px h-4 bg-white/10 mx-1"></div>
         <button className="p-1.5 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-colors"><AlignLeft size={16} /></button>
         <button className="p-1.5 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-colors"><Paperclip size={16} /></button>
         <button className="p-1.5 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-colors"><ImageIcon size={16} /></button>
         <button className="p-1.5 text-white/70 hover:bg-white/[0.06] hover:text-white rounded-[4px] transition-colors"><Smile size={16} /></button>
      </div>

      {/* --------------------------------------------------------------------------------
          MAIN TEXT AREA
      ----------------------------------------------------------------------------------*/}
      <div className="flex-1 px-6 pb-6 overflow-hidden bg-[#1A1A1A]">
        <textarea 
          className="w-full h-full bg-transparent resize-none text-[14px] leading-6 text-white placeholder-white/30 outline-none custom-scrollbar"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          spellCheck={false}
        />
      </div>

      {/* --------------------------------------------------------------------------------
          STATUS BAR
      ----------------------------------------------------------------------------------*/}
      <div className="h-8 bg-[#191919] border-t border-white/[0.06] flex items-center px-4 justify-between">
        <span className="text-[11px] text-white/40">
           Draft saved
        </span>
        <div className="resize-handle text-white/20">
           <svg viewBox="0 0 10 10" className="w-2.5 h-2.5">
             <path d="M10 10L10 0L0 10Z" fill="currentColor" />
           </svg>
        </div>
      </div>
    </div>
  )
}
