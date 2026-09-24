import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import TableToolbar from '../../components/common/TableToolbar'
import { IconEdit, IconPlus, IconTrash } from '../../components/common/icons'
import '../../components/common/TableCard.css'
import BookFormModal from './BookFormModal'
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
  type BookPayload,
} from '../../services/booksApi'
import { extractErrorMessage } from '../../services/api'
import { bookStatusMap } from '../../constants/statusMaps'
import type { BookRecord, BookStatus } from '../../types'

export default function BooksPage() {
  const [books, setBooks] = useState<BookRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<BookStatus | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BookRecord | undefined>(undefined)

  function load() {
    setLoading(true)
    fetchBooks()
      .then(setBooks)
      .catch((err) => setError(extractErrorMessage(err, 'Không thể tải danh sách sách')))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.code.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      const matchStatus = status === 'all' || b.status === status
      return matchSearch && matchStatus
    })
  }, [books, search, status])

  function openCreate() {
    setEditing(undefined)
    setModalOpen(true)
  }

  function openEdit(b: BookRecord) {
    setEditing(b)
    setModalOpen(true)
  }

  async function handleSubmit(payload: BookPayload) {
    try {
      if (editing) {
        await updateBook(editing.id, payload)
      } else {
        await createBook(payload)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Không thể lưu sách'))
    }
  }

  async function handleDelete(b: BookRecord) {
    if (!confirm(`Xóa sách "${b.title}"?`)) return
    try {
      await deleteBook(b.id)
      load()
    } catch (err) {
      setError(extractErrorMessage(err, 'Không thể xóa sách'))
    }
  }

  return (
    <div>
      <PageHeader
        title="Hồ sơ sách / tài liệu"
        description="Danh mục đầu sách, số lượng tồn kho và tình trạng trong thư viện."
        action={
          <Button onClick={openCreate}>
            <IconPlus /> Thêm đầu sách
          </Button>
        }
      />

      <div className="table-card">
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Tìm theo mã sách, tên sách, tác giả..."
          filters={
            <select value={status} onChange={(e) => setStatus(e.target.value as BookStatus | 'all')}>
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Còn sẵn</option>
              <option value="borrowed_out">Đã mượn hết</option>
              <option value="liquidated">Đã thanh lý</option>
            </select>
          }
        />
        {error && <p className="table-card__error">{error}</p>}
        <DataTable
          columns={[
            { key: 'code', header: 'Mã sách', render: (b) => <strong>{b.code}</strong> },
            { key: 'title', header: 'Tên sách', render: (b) => b.title },
            { key: 'author', header: 'Tác giả', render: (b) => b.author },
            { key: 'publisher', header: 'Nhà xuất bản', render: (b) => b.publisher },
            { key: 'category', header: 'Thể loại', render: (b) => b.category },
            { key: 'quantity', header: 'Tổng số', align: 'center', render: (b) => b.quantity },
            { key: 'available', header: 'Còn lại', align: 'center', render: (b) => b.available },
            {
              key: 'status',
              header: 'Trạng thái',
              render: (b) => {
                const s = bookStatusMap[b.status]
                return <StatusBadge label={s.label} tone={s.tone} />
              },
            },
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (b) => (
                <div className="row-actions">
                  <Button variant="ghost" onClick={() => openEdit(b)} title="Sửa">
                    <IconEdit />
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(b)} title="Xóa">
                    <IconTrash />
                  </Button>
                </div>
              ),
            },
          ]}
          data={filtered}
          getRowId={(b) => b.id}
          emptyText={loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy sách phù hợp'}
        />
      </div>

      {modalOpen && <BookFormModal initial={editing} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />}
    </div>
  )
}
