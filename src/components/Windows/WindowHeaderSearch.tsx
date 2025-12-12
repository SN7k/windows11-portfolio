interface WindowHeaderSearchProps {
  id: string
  title: string
  iconSrc: string
  isSearchVisible: boolean
}

export default function WindowHeaderSearch({ id, title, iconSrc, isSearchVisible }: WindowHeaderSearchProps) {
  if (!isSearchVisible) return null

  return (
    <div className="flex items-center h-8 bg-gradient-to-b from-blue-50 to-blue-100 border-b border-gray-300 px-2 gap-2">
      <span className="text-xs">Search:</span>
      <input
        type="text"
        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
        placeholder={`Search in ${title}`}
      />
    </div>
  )
}
