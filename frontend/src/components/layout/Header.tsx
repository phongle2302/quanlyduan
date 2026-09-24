import { useNavigate } from 'react-router-dom'
import { IconBell, IconLogout } from '../common/icons'
import { clearSession, getCurrentUser } from '../../services/session'
import './Header.css'

interface HeaderProps {
  title: string
}

const roleLabel: Record<string, string> = {
  admin: 'Quản trị viên',
  librarian: 'Thủ thư',
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  return parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : fullName.slice(0, 2)
}

export default function Header({ title }: HeaderProps) {
  const navigate = useNavigate()
  const user = getCurrentUser()

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  return (
    <header className="header">
      <h2 className="header__title">{title}</h2>
      <div className="header__actions">
        <button className="header__icon-btn" title="Thông báo">
          <IconBell />
          <span className="header__dot" />
        </button>
        <div className="header__user">
          <div className="header__avatar">{user ? getInitials(user.fullName).toUpperCase() : '??'}</div>
          <div>
            <p className="header__user-name">{user?.fullName ?? 'Chưa đăng nhập'}</p>
            <p className="header__user-role">{user ? roleLabel[user.role] : ''}</p>
          </div>
        </div>
        <button className="header__icon-btn" title="Đăng xuất" onClick={handleLogout}>
          <IconLogout />
        </button>
      </div>
    </header>
  )
}
