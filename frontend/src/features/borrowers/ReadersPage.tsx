import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import TableToolbar from '../../components/common/TableToolbar'
import { IconEdit, IconPlus, IconTrash } from '../../components/common/icons'
import '../../components/common/TableCard.css'
import ReaderFormModal from './ReaderFormModal'
import {
  fetchReaders,
  createReader,
  updateReader,
  deleteReader,
  type ReaderPayload,
  type ReaderWithLoanCount,
} from '../../services/readersApi'
import { extractErrorMessage } from '../../services/api'
import { readerStatusMap } from '../../constants/statusMaps'
import { formatDate } from '../../utils/format'
import type { Reader, ReaderStatus } from '../../types'

export default function ReadersPage() {
  const [readers, setReaders] = useState<ReaderWithLoanCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ReaderStatus | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Reader | undefined>(undefined)

  function load() {
    setLoading(true)
    fetchReaders()
      .then(setReaders)
      .catch((err) => setError(extractErrorMessage(err, 'Không thể tải danh sách độc giả')))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

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

  function openCreate() {
    setEditing(undefined)
    setModalOpen(true)
  }

  function openEdit(r: Reader) {
    setEditing(r)
    setModalOpen(true)
  }

  async function handleSubmit(payload: ReaderPayload) {
    try {
      if (editing) {
        await updateReader(editing.id, payload)
      } else {
        await createReader(payload)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Không thể lưu độc giả'))
    }
  }

  async function handleDelete(r: Reader) {
    if (!confirm(`Xóa độc giả "${r.fullName}"?`)) return
    try {
      await deleteReader(r.id)
      load()
    } catch (err) {
      setError(extractErrorMessage(err, 'Không thể xóa độc giả'))
    }
  }

  return (
    <div>
      <PageHeader
        title="Hồ sơ độc giả"
        description="Thông tin đăng ký thẻ, liên hệ và tình trạng mượn sách của độc giả."
        action={
          <Button onClick={openCreate}>
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
            { key: 'code', header: 'Mã thẻ', render: (r) => <span className="cell-code">{r.code}</span> },
            { key: 'name', header: 'Họ tên', render: (r) => <span className="cell-primary">{r.fullName}</span> },
            { key: 'email', header: 'Email', render: (r) => <span className="cell-muted">{r.email}</span> },
            { key: 'phone', header: 'Điện thoại', render: (r) => r.phone },
            { key: 'expiry', header: 'Hạn thẻ', render: (r) => formatDate(r.cardExpiry) },
            {
              key: 'borrowing',
              header: 'Đang mượn',
              align: 'center',
              render: (r) => <span className="cell-number">{r._count?.loans ?? 0}</span>,
            },
            {
              key: 'status',
              header: 'Trạng thái',
              render: (r) => {
                const s = readerStatusMap[r.status]
                return <StatusBadge label={s.label} tone={s.tone} />
              },
            },
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (r) => (
                <div className="row-actions">
                  <Button variant="ghost" onClick={() => openEdit(r)} title="Sửa">
                    <IconEdit />
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(r)} title="Xóa">
                    <IconTrash />
                  </Button>
                </div>
              ),
            },
          ]}
          data={filtered}
          getRowId={(r) => r.id}
          emptyText={loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy độc giả phù hợp'}
        />
        {!loading && (
          <div className="table-card__footer">
            Hiển thị {filtered.length} / {readers.length} độc giả
          </div>
        )}
      </div>

      {modalOpen && <ReaderFormModal initial={editing} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />}
    </div>
  )
}
