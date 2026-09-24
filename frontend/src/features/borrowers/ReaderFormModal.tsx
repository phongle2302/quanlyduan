import { useState, type FormEvent } from 'react'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import type { Reader, ReaderStatus } from '../../types'
import type { ReaderPayload } from '../../services/readersApi'

interface ReaderFormModalProps {
  initial?: Reader
  onClose: () => void
  onSubmit: (payload: ReaderPayload) => Promise<void>
}

export default function ReaderFormModal({ initial, onClose, onSubmit }: ReaderFormModalProps) {
  const [code, setCode] = useState(initial?.code ?? '')
  const [fullName, setFullName] = useState(initial?.fullName ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [cardExpiry, setCardExpiry] = useState(initial?.cardExpiry.slice(0, 10) ?? '')
  const [status, setStatus] = useState<ReaderStatus>(initial?.status ?? 'active')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit({ code, fullName, email, phone, cardExpiry, status })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={initial ? 'Sửa hồ sơ độc giả' : 'Thêm độc giả'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <label className="form-field">
          <span>Mã thẻ</span>
          <input value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>

        <label className="form-field">
          <span>Họ tên</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>

        <label className="form-field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <div className="form-row">
          <label className="form-field">
            <span>Điện thoại</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>
          <label className="form-field">
            <span>Hạn thẻ</span>
            <input type="date" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required />
          </label>
        </div>

        <label className="form-field">
          <span>Trạng thái</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as ReaderStatus)}>
            <option value="active">Hoạt động</option>
            <option value="locked">Bị khóa</option>
            <option value="expired">Hết hạn thẻ</option>
          </select>
        </label>

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
