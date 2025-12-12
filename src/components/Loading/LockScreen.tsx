'use client'

import { useEffect, useRef, useState } from 'react'

interface LockScreenProps {
  onUnlock: () => void
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const update = () => {
    const now = new Date()
    setTime(now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }))
    setDate(now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }))
  }

  useEffect(() => {
    update()
    const timer = setInterval(update, 1000)
    rootRef.current?.focus()

    return () => clearInterval(timer)
  }, [])

  const handleUnlock = () => {
    if (isUnlocking) return
    setIsUnlocking(true)
    setTimeout(() => onUnlock(), 450)
  }

  return (
    <section
      ref={rootRef}
      className={`lock-root h-svh w-screen relative overflow-hidden z-10 bg-black ${isUnlocking ? 'unlocking' : ''}`}
      onClick={handleUnlock}
      onKeyDown={(e) => {
        e.preventDefault()
        handleUnlock()
      }}
      tabIndex={0}
      style={{
        backgroundImage: "url('/img/Windows11lock.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="relative h-full w-full flex items-start justify-center">
        <div className="mt-20 text-center select-none center-content">
          <div className="text-white font-semibold text-5xl md:text-7xl">{time}</div>
          <div className="text-white/90 mt-2 text-base md:text-xl">{date}</div>
        </div>
      </div>

      <div className="hint absolute bottom-6 w-full text-center text-white/80 text-xs md:text-sm select-none">
        Click or press any key to sign in
      </div>

      <style jsx>{`
        .lock-root .center-content,
        .lock-root .hint {
          transition:
            transform 400ms cubic-bezier(0.4, 0, 0.2, 1),
            opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .lock-root.unlocking .center-content {
          transform: translateY(-18%);
          opacity: 0;
        }

        .lock-root.unlocking .hint {
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
