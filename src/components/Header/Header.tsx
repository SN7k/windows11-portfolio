'use client'

import { useVolumeStore } from '@/contexts/VolumeContext'
import ProfilePicture from '../ProfilePicture'

interface HeaderProps {
  entities: any[]
  onToggleHeader: () => void
  onToggleMyProjects: () => void
  onToggleContact: () => void
  onToggleMyCV: () => void
  onToggleMusic: () => void
  onToggleCalendar: () => void
  onToggleNotepad: () => void
  onToggleTerminal: () => void
}

export default function Header({
  entities,
  onToggleHeader,
  onToggleMyProjects,
  onToggleContact,
  onToggleMyCV,
  onToggleMusic,
  onToggleCalendar,
  onToggleNotepad,
  onToggleTerminal,
}: HeaderProps) {
  const volumeStore = useVolumeStore()

  const turnOffHeader = () => {
    onToggleHeader()
  }

  const toggleWindow = (buttonName: string) => {
    turnOffHeader()
    const toggleMap: { [key: string]: () => void } = {
      myProjects: onToggleMyProjects,
      contact: onToggleContact,
      myCV: onToggleMyCV,
      music: onToggleMusic,
      calendar: onToggleCalendar,
      notepad: onToggleNotepad,
      terminal: onToggleTerminal,
    }
    toggleMap[buttonName]?.()
  }

  const shutdown = () => {
    volumeStore.unmuteAudio()
  }

  const leftEntities = entities.filter((e) => e.headerPosition === 'left')
  const rightEntities = entities.filter((e) => e.headerPosition === 'right')

  return (
    <header className="header-component select-none">
      <div className="absolute left-0 header-radius overflow-hidden bottom-0 mb-8 modal-size z-max bg-color-blue-window">
        <div className="w-full h-full relative overflow-hidden">
          <div className="h-16 flex items-center px-2 header-top-background">
            <ProfilePicture className="w-11 h-11 stroke-white-1 header-profile-shadow" />
            <h2 className="text-lg ml-2 text-white text-shadow-header">SNK</h2>
          </div>
          <section className="relative w-full h-full px-0.5">
            <hr className="absolute top-0 left-0 right-0 bg-orange-hr block" />
            <div className="w-full h-full flex">
              <div className="w-7/12 h-full bg-white px-1 py-1">
                {leftEntities.map((entity) => (
                  <div key={entity.id} className="flex flex-col gap-3 py-2">
                    <button
                      onClick={() => toggleWindow(entity.id)}
                      className="flex items-center gap-3 p-2 hover:bg-blue-100 cursor-pointer rounded"
                    >
                      <img src={entity.imgSrc} alt={entity.title.en} className="w-8 h-8" />
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{entity.title.en}</span>
                        {entity.subtitle && <span className="text-xs text-gray-600">{entity.subtitle.en}</span>}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-1/2 h-full bg-color-blue-header-left left-blue-header-1 px-1">
                <div className="py-2">
                  {rightEntities.map((entity) => (
                    <button
                      key={entity.id}
                      onClick={() => toggleWindow(entity.id)}
                      className="flex items-center gap-2 p-2 w-full hover:bg-blue-400 cursor-pointer rounded text-white"
                    >
                      <img src={entity.iconSrc} alt={entity.title.en} className="w-6 h-6" />
                      <span>{entity.title.en}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <div className="absolute bottom-0 h-12 w-full">
            <div className="header-bot-background h-full flex justify-end items-center">
              <div className="flex h-5/6 gap-3 mr-2">
                <button onClick={turnOffHeader} className="cursor-pointer px-4 py-1 bg-blue-500 text-white rounded">
                  Log Off
                </button>
                <button onClick={shutdown} className="cursor-pointer px-4 py-1 bg-red-500 text-white rounded">
                  Shut Down
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header-radius {
          border-radius: 5px 5px 0px 0px;
        }

        .modal-size {
          width: 430px;
          height: 530px;
        }

        @media (max-width: 768px) {
          .modal-size {
            width: 300px;
            height: 410px;
          }
        }
      `}</style>
    </header>
  )
}
