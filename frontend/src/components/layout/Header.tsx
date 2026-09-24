import { useNavigate } from 'react-router-dom'
import { IconBell, IconLogout } from '../common/icons'
import './Header.css'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="header">
      <h2 className="header__title">{title}</h2>
      <div className="header__actions">
        <button className="header__icon-btn" title="Thông báo">
          <IconBell />
          <span className="header__dot" />
        </button>
        <div className="header__user">
          <div className="header__avatar">TN</div>
          <div>
            <p className="header__user-name">Trần Nam</p>
            <p className="header__user-role">Thủ thư</p>
          </div>
        </div>
        <button className="header__icon-btn" title="Đăng xuất" onClick={() => navigate('/login')}>
          <IconLogout />
        </button>
      </div>
    </header>
  )
}
