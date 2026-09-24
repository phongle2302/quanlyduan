import { useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import TableToolbar from '../../components/common/TableToolbar'
import { IconPlus } from '../../components/common/icons'
import '../../components/common/TableCard.css'
import { supplierContracts } from '../../services/mockData'
import { contractStatusMap } from '../../constants/statusMaps'
import { formatCurrency, formatDate } from '../../utils/format'
import type { SupplierContractStatus } from '../../types'

export default function SupplierContractsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<SupplierContractStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return supplierContracts.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.supplierName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = status === 'all' || c.status === status
      return matchSearch && matchStatus
    })
  }, [search, status])

  return (
    <div>
      <PageHeader
        title="Hợp đồng nhà cung cấp"
        description="Quản lý hợp đồng mua sách, thiết bị, dịch vụ ký với nhà cung cấp/nhà xuất bản."
        action={
          <Button>
            <IconPlus /> Thêm hợp đồng
          </Button>
        }
      />

      <div className="table-card">
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Tìm theo mã, nội dung, nhà cung cấp..."
          filters={
            <select value={status} onChange={(e) => setStatus(e.target.value as SupplierContractStatus | 'all')}>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hiệu lực</option>
              <option value="expiring">Sắp hết hạn</option>
              <option value="expired">Hết hạn</option>
              <option value="liquidated">Đã thanh lý</option>
            </select>
          }
        />
        <DataTable
          columns={[
            { key: 'code', header: 'Mã HĐ', render: (c) => <strong>{c.code}</strong> },
            { key: 'title', header: 'Nội dung', render: (c) => c.title },
            { key: 'supplier', header: 'Nhà cung cấp', render: (c) => c.supplierName },
            { key: 'type', header: 'Loại', render: (c) => c.type },
            { key: 'value', header: 'Giá trị', align: 'right', render: (c) => formatCurrency(c.value) },
            { key: 'signed', header: 'Ngày ký', render: (c) => formatDate(c.signedDate) },
            { key: 'expiry', header: 'Ngày hết hạn', render: (c) => formatDate(c.expiryDate) },
            {
              key: 'status',
              header: 'Trạng thái',
              render: (c) => {
                const s = contractStatusMap[c.status]
                return <StatusBadge label={s.label} tone={s.tone} />
              },
            },
          ]}
          data={filtered}
          getRowId={(c) => c.id}
          emptyText="Không tìm thấy hợp đồng phù hợp"
        />
      </div>
    </div>
  )
}
