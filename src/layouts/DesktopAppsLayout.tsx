'use client'

import { useState, useEffect, useRef } from 'react'

interface Entity {
  id: string
  title: { en: string }
  imgSrc: string
  onDesktop: boolean
  isActive?: boolean
  isHovered?: boolean
}

interface DesktopAppsLayoutProps {
  entities: Entity[]
  onToggleMyProjects: () => void
  onToggleContact: () => void
  onToggleAboutMe: () => void
  onToggleNotepad: () => void
}

export default function DesktopAppsLayout({
  entities,
  onToggleMyProjects,
  onToggleContact,
  onToggleAboutMe,
  onToggleNotepad,
}: DesktopAppsLayoutProps) {
  const [localEntities, setLocalEntities] = useState<Entity[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setLocalEntities(entities.map((e) => ({ ...e, isActive: false, isHovered: false })))
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent))
  }, [entities])

  const desktopEntities = localEntities.filter((entity) => entity.onDesktop)

  const toggleEffect = (selectedEntity: Entity) => {
    setLocalEntities((prev) =>
      prev.map((entity) => ({
        ...entity,
        isActive: entity.id === selectedEntity.id,
      }))
    )
  }

  const handleHoverEnter = (entity: Entity) => {
    setLocalEntities((prev) =>
      prev.map((e) => ({
        ...e,
        isHovered: e.id === entity.id ? true : e.isHovered,
      }))
    )
  }

  const handleHoverLeave = (entity: Entity) => {
    setLocalEntities((prev) =>
      prev.map((e) => ({
        ...e,
        isHovered: e.id === entity.id ? false : e.isHovered,
      }))
    )
  }

  const removeFilterAndToggle = (entity: Entity) => {
    setLocalEntities((prev) => prev.map((e) => ({ ...e, isActive: false })))
    
    const toggleMap: { [key: string]: () => void } = {
      myProjects: onToggleMyProjects,
      contact: onToggleContact,
      aboutme: onToggleAboutMe,
      notepad: onToggleNotepad,
    }

    toggleMap[entity.id]?.()
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.grid')) {
        setLocalEntities((prev) => prev.map((entity) => ({ ...entity, isActive: false })))
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <section className="absolute top-0 left-0">
      <div className="grid grid-cols-1 gap-5 pt-6 pl-6">
        {desktopEntities.map((entity) => (
          <button
            key={entity.id}
            className={`flex flex-col gap-2 items-center w-full cursor-pointer transition-all duration-150 rounded-lg px-3 py-2 select-none ${
              entity.isActive || entity.isHovered ? 'bg-white/[0.12]' : ''
            }`}
            onClick={() => (isMobile ? removeFilterAndToggle(entity) : toggleEffect(entity))}
            onDoubleClick={() => !isMobile && removeFilterAndToggle(entity)}
            onMouseEnter={() => handleHoverEnter(entity)}
            onMouseLeave={() => handleHoverLeave(entity)}
            style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
          >
            <img
              className="w-11 h-11"
              src={entity.imgSrc}
              alt={entity.title.en}
              draggable={false}
            />
            <p
              className="text-white text-xs font-normal py-px px-1 rounded transition-all duration-150"
              style={{
                backgroundColor: 'transparent',
                textShadow: '0px 1px 1px rgba(1, 1, 1, 1), 0px 0px 4px #000',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {entity.title.en}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}
