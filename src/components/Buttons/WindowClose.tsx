export default function WindowClose({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-5 h-5 flex items-center justify-center bg-red-500 rounded-sm hover:bg-red-600 cursor-pointer"
      title="Close"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  )
}
