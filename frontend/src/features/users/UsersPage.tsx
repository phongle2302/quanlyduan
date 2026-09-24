import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import TableToolbar from '../../components/common/TableToolbar'
import { IconEdit, IconPlus, IconTrash } from '../../components/common/icons'
import '../../components/common/TableCard.css'
import UserFormModal from './UserFormModal'
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  type CreateUserPayload,
  type UpdateUserPayload,
} from '../../services/usersApi'
import { extractErrorMessage } from '../../services/api'
import { getCurrentUser } from '../../services/session'
import type { SystemUser } from '../../types'

const roleLabel: Record<string, string> = {
  admin: 'Quản trị viên',
  librarian: 'Thủ thư',
}

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SystemUser | undefined>(undefined)
  const currentUser = getCurrentUser()

  function load() {
    setLoading(true)
    fetchUsers()
      .then(setUsers)
      .catch((err) => setError(extractErrorMessage(err, 'Không thể tải danh sách người dùng')))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    )
  }, [users, search])

  function openCreate() {
    setEditing(undefined)
    setModalOpen(true)
  }

  function openEdit(u: SystemUser) {
    setEditing(u)
    setModalOpen(true)
  }

  async function handleSubmit(payload: CreateUserPayload | UpdateUserPayload) {
    try {
      if (editing) {
        await updateUser(editing.id, payload as UpdateUserPayload)
      } else {
        await createUser(payload as CreateUserPayload)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Không thể lưu người dùng'))
    }
  }

  async function handleDelete(u: SystemUser) {
    if (!confirm(`Xóa người dùng "${u.fullName}"?`)) return
    try {
      await deleteUser(u.id)
      load()
    } catch (err) {
      setError(extractErrorMessage(err, 'Không thể xóa người dùng'))
    }
  }

  return (
    <div>
      <PageHeader
        title="Người dùng hệ thống"
        description="Quản lý tài khoản nhân viên/thủ thư và phân quyền truy cập hệ thống."
        action={
          <Button onClick={openCreate}>
            <IconPlus /> Thêm người dùng
          </Button>
        }
      />

      <div className="table-card">
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Tìm theo họ tên, email..."
        />
        {error && <p className="table-card__error">{error}</p>}
        <DataTable
          columns={[
            { key: 'name', header: 'Họ tên', render: (u) => <span className="cell-primary">{u.fullName}</span> },
            { key: 'email', header: 'Email', render: (u) => <span className="cell-muted">{u.email}</span> },
            {
              key: 'role',
              header: 'Vai trò',
              render: (u) =>
                u.role === 'admin' ? (
                  <StatusBadge label={roleLabel[u.role]} tone="primary" />
                ) : (
                  <StatusBadge label={roleLabel[u.role]} tone="neutral" />
                ),
            },
            {
              key: 'status',
              header: 'Trạng thái',
              render: (u) =>
                u.active ? (
                  <StatusBadge label="Đang hoạt động" tone="success" />
                ) : (
                  <StatusBadge label="Đã khóa" tone="neutral" />
                ),
            },
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (u) => (
                <div className="row-actions">
                  <Button variant="ghost" onClick={() => openEdit(u)} title="Sửa">
                    <IconEdit />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(u)}
                    title="Xóa"
                    disabled={u.id === currentUser?.id}
                  >
                    <IconTrash />
                  </Button>
                </div>
              ),
            },
          ]}
          data={filtered}
          getRowId={(u) => u.id}
          emptyText={loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy người dùng phù hợp'}
        />
        {!loading && (
          <div className="table-card__footer">
            Hiển thị {filtered.length} / {users.length} tài khoản
          </div>
        )}
      </div>

      {modalOpen && <UserFormModal initial={editing} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />}
    </div>
  )
}
