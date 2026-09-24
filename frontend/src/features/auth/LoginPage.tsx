import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-card__brand">
          <div className="login-card__brand-mark">TV</div>
          <div>
            <p className="login-card__brand-title">Thư viện Số</p>
            <p className="login-card__brand-subtitle">Hệ thống Quản lý Hợp đồng / Hồ sơ</p>
          </div>
        </div>

        <h1 className="login-card__heading">Đăng nhập</h1>
        <p className="login-card__hint">Đăng nhập bằng tài khoản nhân viên/thủ thư được cấp.</p>

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ten.nhanvien@thuvien.edu.vn"
          />
        </label>

        <label className="login-field">
          <span>Mật khẩu</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        <Button type="submit" className="login-card__submit">
          Đăng nhập
        </Button>
      </form>
    </div>
  )
}
