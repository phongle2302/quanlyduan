import { useEffect, useState, type FormEvent } from 'react'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { fetchReaders } from '../../services/readersApi'
import { fetchBooks } from '../../services/booksApi'
import type { CreateLoanPayload } from '../../services/loansApi'
import type { Reader, BookRecord } from '../../types'

interface LoanFormModalProps {
  onClose: () => void
  onSubmit: (payload: CreateLoanPayload) => Promise<void>
}

function dateInput(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

export default function LoanFormModal({ onClose, onSubmit }: LoanFormModalProps) {
  const [readers, setReaders] = useState<Reader[]>([])
  const [books, setBooks] = useState<BookRecord[]>([])
  const [readerId, setReaderId] = useState('')
  const [bookId, setBookId] = useState('')
  const [borrowDate, setBorrowDate] = useState(dateInput())
  const [dueDate, setDueDate] = useState(dateInput(14))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(true)

  useEffect(() => {
    Promise.all([fetchReaders(), fetchBooks()])
      .then(([readerList, bookList]) => {
        setReaders(readerList.filter((r) => r.status === 'active'))
        setBooks(bookList.filter((b) => b.available > 0))
      })
      .catch(() => setError('Không thể tải danh sách độc giả/sách'))
      .finally(() => setLoadingOptions(false))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!readerId || !bookId || !dueDate) {
      setError('Vui lòng chọn đầy đủ thông tin')
      return
    }
    setSaving(true)
    try {
      await onSubmit({ readerId, bookId, borrowDate, dueDate })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Lập phiếu mượn" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        {loadingOptions ? (
          <p>Đang tải danh sách...</p>
        ) : (
          <>
            <label className="form-field">
              <span>Độc giả</span>
              <select value={readerId} onChange={(e) => setReaderId(e.target.value)} required>
                <option value="">-- Chọn độc giả --</option>
                {readers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.code} - {r.fullName}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Sách</span>
              <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
                <option value="">-- Chọn sách --</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code} - {b.title} (còn {b.available})
                  </option>
                ))}
              </select>
            </label>

            <div className="form-row">
              <label className="form-field">
                <span>Ngày mượn</span>
                <input type="date" value={borrowDate} onChange={(e) => setBorrowDate(e.target.value)} required />
              </label>
              <label className="form-field">
                <span>Hạn trả</span>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </label>
            </div>
          </>
        )}

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={saving || loadingOptions}>
            {saving ? 'Đang lưu...' : 'Lập phiếu'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
