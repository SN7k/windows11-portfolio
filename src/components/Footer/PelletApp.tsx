'use client'

interface PelletAppProps {
  entity: any
  onToggleWindow: (windowId: string) => void
}

export default function PelletApp({ entity, onToggleWindow }: PelletAppProps) {
  const activeWindow = entity.id // Simplified for now

  const toggleWindow = () => {
    onToggleWindow(entity.id)
  }

  const getLocalizedTitle = (entity: any) => {
    return entity.title.en
  }

  return (
    <div className="flex items-center h-full gap-1 py-1 mt-px sm:w-44 select-none cursor-pointer" onClick={toggleWindow}>
      <div
        className={`flex items-center px-2 w-full h-full rounded-sm hover:brightness-110 ${
          entity.visible
            ? 'bg-pellet-blue-active shadow-pellet-footer-active'
            : 'bg-pellet-blue-deactivated shadow-pellet-footer-deactivated'
        }`}
      >
        <div className="flex gap-1 mt-px">
          <img src={entity.iconSrc} alt={`Icon ${getLocalizedTitle(entity)}`} className="w-4 h-4" />
          <p className="small-p text-white truncate hidden sm:block">{getLocalizedTitle(entity)}</p>
        </div>
      </div>
    </div>
  )
}
