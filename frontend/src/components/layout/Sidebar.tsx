import { NavLink } from 'react-router-dom'
import {
  IconBook,
  IconDashboard,
  IconFileContract,
  IconLoan,
  IconReader,
  IconUsers,
} from '../common/icons'
import './Sidebar.css'

interface NavItem {
  to: string
  label: string
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    title: 'Tổng quan',
    items: [{ to: '/', label: 'Bảng điều khiển', icon: IconDashboard }],
  },
  {
    title: 'Hợp đồng',
    items: [
      { to: '/contracts', label: 'Hợp đồng nhà cung cấp', icon: IconFileContract },
      { to: '/loans', label: 'Phiếu mượn / trả', icon: IconLoan },
    ],
  },
  {
    title: 'Hồ sơ',
    items: [
      { to: '/readers', label: 'Hồ sơ độc giả', icon: IconReader },
      { to: '/books', label: 'Hồ sơ sách / tài liệu', icon: IconBook },
    ],
  },
  {
    title: 'Hệ thống',
    items: [{ to: '/users', label: 'Người dùng hệ thống', icon: IconUsers }],
  },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">TV</div>
        <div>
          <p className="sidebar__brand-title">Thư viện Số</p>
          <p className="sidebar__brand-subtitle">Quản lý Hợp đồng / Hồ sơ</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {groups.map((group) => (
          <div className="sidebar__group" key={group.title}>
            <p className="sidebar__group-title">{group.title}</p>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
