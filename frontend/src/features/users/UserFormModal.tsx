import { useState, type FormEvent } from 'react'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import type { SystemRole, SystemUser } from '../../types'
import type { CreateUserPayload, UpdateUserPayload } from '../../services/usersApi'

interface UserFormModalProps {
  initial?: SystemUser
  onClose: () => void
  onSubmit: (payload: CreateUserPayload | UpdateUserPayload) => Promise<void>
}

export default function UserFormModal({ initial, onClose, onSubmit }: UserFormModalProps) {
  const [fullName, setFullName] = useState(initial?.fullName ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<SystemRole>(initial?.role ?? 'librarian')
  const [active, setActive] = useState(initial?.active ?? true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (initial) {
        await onSubmit({ fullName, role, active })
      } else {
        await onSubmit({ fullName, email, password, role })
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={initial ? 'Sửa người dùng' : 'Thêm người dùng'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <label className="form-field">
          <span>Họ tên</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>

        <label className="form-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!initial}
          />
        </label>

        {!initial && (
          <label className="form-field">
            <span>Mật khẩu</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
        )}

        <label className="form-field">
          <span>Vai trò</span>
          <select value={role} onChange={(e) => setRole(e.target.value as SystemRole)}>
            <option value="librarian">Thủ thư</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </label>

        {initial && (
          <label className="form-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            <span>Đang hoạt động</span>
          </label>
        )}

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
