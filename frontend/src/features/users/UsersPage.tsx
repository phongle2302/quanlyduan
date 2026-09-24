import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import TableToolbar from '../../components/common/TableToolbar'
import { IconPlus } from '../../components/common/icons'
import '../../components/common/TableCard.css'
import { fetchUsers } from '../../services/usersApi'
import { extractErrorMessage } from '../../services/api'
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

  useEffect(() => {
    setLoading(true)
    fetchUsers()
      .then(setUsers)
      .catch((err) => setError(extractErrorMessage(err, 'Không thể tải danh sách người dùng')))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    )
  }, [users, search])

  return (
    <div>
      <PageHeader
        title="Người dùng hệ thống"
        description="Quản lý tài khoản nhân viên/thủ thư và phân quyền truy cập hệ thống."
        action={
          <Button>
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
            { key: 'name', header: 'Họ tên', render: (u) => u.fullName },
            { key: 'email', header: 'Email', render: (u) => u.email },
            { key: 'role', header: 'Vai trò', render: (u) => roleLabel[u.role] },
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
          ]}
          data={filtered}
          getRowId={(u) => u.id}
          emptyText={loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy người dùng phù hợp'}
        />
      </div>
    </div>
  )
}
