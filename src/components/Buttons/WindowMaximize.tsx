export default function WindowMaximize({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-5 h-5 flex items-center justify-center bg-window-white rounded-sm ${
        disabled ? 'opacity-60 cursor-default' : 'hover:bg-blue-100 cursor-pointer'
      }`}
      title="Maximize"
      disabled={disabled}
    >
      <div className="w-2 h-2 border border-gray-800"></div>
    </button>
  )
}
