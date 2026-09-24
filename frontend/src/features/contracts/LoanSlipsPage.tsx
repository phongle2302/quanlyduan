import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import TableToolbar from '../../components/common/TableToolbar'
import { IconPlus } from '../../components/common/icons'
import '../../components/common/TableCard.css'
import { fetchLoans, type LoanSlipWithRelations } from '../../services/loansApi'
import { extractErrorMessage } from '../../services/api'
import { loanStatusMap } from '../../constants/statusMaps'
import { formatDate } from '../../utils/format'
import type { LoanStatus } from '../../types'

export default function LoanSlipsPage() {
  const [loans, setLoans] = useState<LoanSlipWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<LoanStatus | 'all'>('all')

  useEffect(() => {
    setLoading(true)
    fetchLoans()
      .then(setLoans)
      .catch((err) => setError(extractErrorMessage(err, 'Không thể tải danh sách phiếu mượn')))
      .finally(() => setLoading(false))
  }, [])

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

  return (
    <div>
      <PageHeader
        title="Phiếu mượn / trả"
        description="Theo dõi phiếu mượn sách của độc giả, hạn trả và tình trạng quá hạn."
        action={
          <Button>
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
            { key: 'code', header: 'Mã phiếu', render: (l) => <strong>{l.code}</strong> },
            { key: 'reader', header: 'Độc giả', render: (l) => l.reader.fullName },
            { key: 'book', header: 'Sách', render: (l) => l.book.title },
            { key: 'borrow', header: 'Ngày mượn', render: (l) => formatDate(l.borrowDate) },
            { key: 'due', header: 'Hạn trả', render: (l) => formatDate(l.dueDate) },
            { key: 'return', header: 'Ngày trả', render: (l) => (l.returnDate ? formatDate(l.returnDate) : '—') },
            {
              key: 'status',
              header: 'Trạng thái',
              render: (l) => {
                const s = loanStatusMap[l.status]
                return <StatusBadge label={s.label} tone={s.tone} />
              },
            },
          ]}
          data={filtered}
          getRowId={(l) => l.id}
          emptyText={loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy phiếu mượn phù hợp'}
        />
      </div>
    </div>
  )
}
