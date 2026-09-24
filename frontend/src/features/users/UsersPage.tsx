import { useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import TableToolbar from '../../components/common/TableToolbar'
import { IconPlus } from '../../components/common/icons'
import '../../components/common/TableCard.css'
import { systemUsers } from '../../services/mockData'

const roleLabel: Record<string, string> = {
  admin: 'Quản trị viên',
  librarian: 'Thủ thư',
}

export default function UsersPage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return systemUsers.filter(
      (u) =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search])

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
          emptyText="Không tìm thấy người dùng phù hợp"
        />
      </div>
    </div>
  )
}
