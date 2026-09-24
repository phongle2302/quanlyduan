import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import BookIllustration from './BookIllustration'
import { login } from '../../services/authApi'
import { extractErrorMessage } from '../../services/api'
import { saveSession } from '../../services/session'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token, user } = await login(email, password)
      saveSession(token, user)
      navigate('/')
    } catch (err) {
      setError(extractErrorMessage(err, 'Không thể đăng nhập, vui lòng thử lại'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <aside className="login-visual">
          <div className="login-visual__brand">
            <div className="login-visual__mark">TV</div>
            <div>
              <p className="login-visual__name">Thư viện Số</p>
              <p className="login-visual__tag">Quản lý Hợp đồng &amp; Hồ sơ</p>
            </div>
          </div>

          <BookIllustration />

          <p className="login-visual__caption">
            Quản lý hợp đồng, phiếu mượn và hồ sơ thư viện trên một hệ thống duy nhất.
          </p>
        </aside>

        <main className="login-form-panel">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-form__heading">Đăng nhập</h1>

            {error && <p className="login-form__error">{error}</p>}

            <label className="login-field">
              <span>Email</span>
              <input
                type="text"
                required
                autoFocus
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="login-field">
              <span>Mật khẩu</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <Button type="submit" className="login-form__submit" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </main>
      </div>
    </div>
  )
}
