import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import TableToolbar from '../../components/common/TableToolbar'
import { IconPlus } from '../../components/common/icons'
import '../../components/common/TableCard.css'
import LoanFormModal from './LoanFormModal'
import {
  fetchLoans,
  createLoan,
  returnLoan,
  type LoanSlipWithRelations,
  type CreateLoanPayload,
} from '../../services/loansApi'
import { extractErrorMessage } from '../../services/api'
import { loanStatusMap } from '../../constants/statusMaps'
import { formatDate, daysUntil } from '../../utils/format'
import type { LoanStatus } from '../../types'

export default function LoanSlipsPage() {
  const [loans, setLoans] = useState<LoanSlipWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<LoanStatus | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)

  function load() {
    setLoading(true)
    fetchLoans()
      .then(setLoans)
      .catch((err) => setError(extractErrorMessage(err, 'Không thể tải danh sách phiếu mượn')))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    return loans.filter((l) => {
      const matchSearch =
        l.reader.fullName.toLowerCase().includes(search.toLowerCase()) ||
        l.book.title.toLowerCase().includes(search.toLowerCase()) ||
        l.code.toLowerCase().includes(search.toLowerCase())
      const matchStatus = status === 'all' || l.status === status
      return matchSearch && matchStatus
    })
  }, [loans, search, status])

  async function handleCreate(payload: CreateLoanPayload) {
    try {
      await createLoan(payload)
      setModalOpen(false)
      load()
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Không thể lập phiếu mượn'))
    }
  }

  async function handleReturn(l: LoanSlipWithRelations) {
    if (!confirm(`Xác nhận trả sách "${l.book.title}" của độc giả "${l.reader.fullName}"?`)) return
    try {
      await returnLoan(l.id)
      load()
    } catch (err) {
      setError(extractErrorMessage(err, 'Không thể xác nhận trả sách'))
    }
  }

  return (
    <div>
      <PageHeader
        title="Phiếu mượn / trả"
        description="Theo dõi phiếu mượn sách của độc giả, hạn trả và tình trạng quá hạn."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <IconPlus /> Lập phiếu mượn
          </Button>
        }
      />

      <div className="table-card">
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Tìm theo mã phiếu, độc giả, tên sách..."
          filters={
            <select value={status} onChange={(e) => setStatus(e.target.value as LoanStatus | 'all')}>
              <option value="all">Tất cả trạng thái</option>
              <option value="borrowing">Đang mượn</option>
              <option value="overdue">Quá hạn</option>
              <option value="returned">Đã trả</option>
            </select>
          }
        />
        {error && <p className="table-card__error">{error}</p>}
        <DataTable
          columns={[
            { key: 'code', header: 'Mã phiếu', render: (l) => <span className="cell-code">{l.code}</span> },
            {
              key: 'reader',
              header: 'Độc giả',
              render: (l) => (
                <div className="cell-stack">
                  <span className="cell-primary">{l.reader.fullName}</span>
                  <small className="cell-hint">{l.reader.code}</small>
                </div>
              ),
            },
            { key: 'book', header: 'Sách', render: (l) => l.book.title },
            { key: 'borrow', header: 'Ngày mượn', render: (l) => formatDate(l.borrowDate) },
            {
              key: 'due',
              header: 'Hạn trả',
              render: (l) => (
                <div className="cell-stack">
                  <span>{formatDate(l.dueDate)}</span>
                  {l.status === 'overdue' && (
                    <small className="cell-hint cell-hint--danger">trễ {Math.abs(daysUntil(l.dueDate))} ngày</small>
                  )}
                </div>
              ),
            },
            {
              key: 'return',
              header: 'Ngày trả',
              render: (l) => (l.returnDate ? formatDate(l.returnDate) : <span className="cell-muted">—</span>),
            },
            {
              key: 'status',
              header: 'Trạng thái',
              render: (l) => {
                const s = loanStatusMap[l.status]
                return <StatusBadge label={s.label} tone={s.tone} />
              },
            },
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (l) =>
                l.status !== 'returned' ? (
                  <div className="row-actions">
                    <Button variant="secondary" onClick={() => handleReturn(l)}>
                      Trả sách
                    </Button>
                  </div>
                ) : null,
            },
          ]}
          data={filtered}
          getRowId={(l) => l.id}
          emptyText={loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy phiếu mượn phù hợp'}
        />
        {!loading && (
          <div className="table-card__footer">
            Hiển thị {filtered.length} / {loans.length} phiếu mượn
          </div>
        )}
      </div>

      {modalOpen && <LoanFormModal onClose={() => setModalOpen(false)} onSubmit={handleCreate} />}
    </div>
  )
}
