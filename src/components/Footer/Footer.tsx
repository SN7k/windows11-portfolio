import StartButton from '../Buttons/StartButton'
import FooterRight from './FooterRight'
import PelletApp from './PelletApp'

interface FooterProps {
  entities: any[]
  onToggleHeader: () => void
  onToggleWindow: (windowId: string) => void
}

export default function Footer({ entities, onToggleHeader, onToggleWindow }: FooterProps) {
  return (
    <footer>
      <div className="absolute bottom-0 footer-gradient shadow-footer w-full z-max">
        <div className="h-8 flex items-center">
          <div className="flex items-center h-full overflow-hidden">
            <StartButton onClick={onToggleHeader} />
            <div className="flex w-10/12 h-full ml-px sm:ml-2 sm:gap-0.5">
              {entities.map((entity) => (
                <PelletApp key={entity.id} entity={entity} onToggleWindow={onToggleWindow} />
              ))}
            </div>
          </div>
          <FooterRight />
        </div>
      </div>
    </footer>
  )
}
