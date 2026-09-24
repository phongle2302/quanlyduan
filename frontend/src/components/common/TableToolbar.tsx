import type { ReactNode } from 'react'
import { IconSearch } from './icons'

interface TableToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  placeholder?: string
  filters?: ReactNode
  action?: ReactNode
}

export default function TableToolbar({
  searchValue,
  onSearchChange,
  placeholder = 'Tìm kiếm...',
  filters,
  action,
}: TableToolbarProps) {
  return (
    <div className="table-card__toolbar">
      <div className="table-card__search">
        <IconSearch />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      <div className="table-card__filters">
        {filters}
        {action}
      </div>
    </div>
  )
}
