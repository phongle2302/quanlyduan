import { useState, type FormEvent } from 'react'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import type { BookRecord, BookStatus } from '../../types'
import type { BookPayload } from '../../services/booksApi'

interface BookFormModalProps {
  initial?: BookRecord
  onClose: () => void
  onSubmit: (payload: BookPayload) => Promise<void>
}

export default function BookFormModal({ initial, onClose, onSubmit }: BookFormModalProps) {
  const [code, setCode] = useState(initial?.code ?? '')
  const [title, setTitle] = useState(initial?.title ?? '')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [publisher, setPublisher] = useState(initial?.publisher ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? '1'))
  const [available, setAvailable] = useState(String(initial?.available ?? '1'))
  const [status, setStatus] = useState<BookStatus>(initial?.status ?? 'available')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit({
        code,
        title,
        author,
        publisher,
        category,
        quantity: Number(quantity),
        available: Number(available),
        status,
      })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={initial ? 'Sửa sách / tài liệu' : 'Thêm đầu sách'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <label className="form-field">
          <span>Mã sách</span>
          <input value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>

        <label className="form-field">
          <span>Tên sách</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <div className="form-row">
          <label className="form-field">
            <span>Tác giả</span>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </label>
          <label className="form-field">
            <span>Nhà xuất bản</span>
            <input value={publisher} onChange={(e) => setPublisher(e.target.value)} required />
          </label>
        </div>

        <label className="form-field">
          <span>Thể loại</span>
          <input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </label>

        <div className="form-row">
          <label className="form-field">
            <span>Tổng số</span>
            <input type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </label>
          <label className="form-field">
            <span>Còn lại</span>
            <input type="number" min={0} value={available} onChange={(e) => setAvailable(e.target.value)} required />
          </label>
        </div>

        <label className="form-field">
          <span>Trạng thái</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as BookStatus)}>
            <option value="available">Còn sẵn</option>
            <option value="borrowed_out">Đã mượn hết</option>
            <option value="liquidated">Đã thanh lý</option>
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
