export default function WindowMinimize({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-5 h-5 flex items-center justify-center bg-window-white rounded-sm hover:bg-blue-100 cursor-pointer"
      title="Minimize"
    >
      <div className="w-2 h-0.5 bg-gray-800"></div>
    </button>
  )
}
