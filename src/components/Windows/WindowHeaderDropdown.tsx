interface WindowHeaderDropdownProps {
  dropdownItems: string[]
  windowsHeaderLogo: boolean
}

export default function WindowHeaderDropdown({ dropdownItems, windowsHeaderLogo }: WindowHeaderDropdownProps) {
  if (!dropdownItems || dropdownItems.length === 0) return null

  return (
    <div className="flex items-center h-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-300 px-1">
      {dropdownItems.map((item, index) => (
        <div key={index} className="px-2 text-xs hover:bg-blue-200 cursor-pointer rounded">
          {item}
        </div>
      ))}
    </div>
  )
}
