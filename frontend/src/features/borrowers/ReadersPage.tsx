import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import TableToolbar from '../../components/common/TableToolbar'
import { IconPlus } from '../../components/common/icons'
import '../../components/common/TableCard.css'
import { fetchReaders } from '../../services/readersApi'
import { extractErrorMessage } from '../../services/api'
import { readerStatusMap } from '../../constants/statusMaps'
import { formatDate } from '../../utils/format'
import type { Reader, ReaderStatus } from '../../types'

interface ReaderRow extends Reader {
  _count?: { loans: number }
}

export default function ReadersPage() {
  const [readers, setReaders] = useState<ReaderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ReaderStatus | 'all'>('all')

  useEffect(() => {
    setLoading(true)
    fetchReaders()
      .then(setReaders)
      .catch((err) => setError(extractErrorMessage(err, 'Không thể tải danh sách độc giả')))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return readers.filter((r) => {
      const matchSearch =
        r.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.code.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase())
      const matchStatus = status === 'all' || r.status === status
      return matchSearch && matchStatus
    })
  }, [readers, search, status])

  return (
    <div>
      <PageHeader
        title="Hồ sơ độc giả"
        description="Thông tin đăng ký thẻ, liên hệ và tình trạng mượn sách của độc giả."
        action={
          <Button>
            <IconPlus /> Thêm độc giả
          </Button>
        }
      />

      <div className="table-card">
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Tìm theo mã thẻ, họ tên, email..."
          filters={
            <select value={status} onChange={(e) => setStatus(e.target.value as ReaderStatus | 'all')}>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Bị khóa</option>
              <option value="expired">Hết hạn thẻ</option>
            </select>
          }
        />
        {error && <p className="table-card__error">{error}</p>}
        <DataTable
          columns={[
            { key: 'code', header: 'Mã thẻ', render: (r) => <strong>{r.code}</strong> },
            { key: 'name', header: 'Họ tên', render: (r) => r.fullName },
            { key: 'email', header: 'Email', render: (r) => r.email },
            { key: 'phone', header: 'Điện thoại', render: (r) => r.phone },
            { key: 'expiry', header: 'Hạn thẻ', render: (r) => formatDate(r.cardExpiry) },
            { key: 'borrowing', header: 'Đang mượn', align: 'center', render: (r) => r._count?.loans ?? 0 },
            {
              key: 'status',
              header: 'Trạng thái',
              render: (r) => {
                const s = readerStatusMap[r.status]
                return <StatusBadge label={s.label} tone={s.tone} />
              },
            },
          ]}
          data={filtered}
          getRowId={(r) => r.id}
          emptyText={loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy độc giả phù hợp'}
        />
      </div>
    </div>
  )
}
