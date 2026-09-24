import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import TableToolbar from '../../components/common/TableToolbar'
import { IconEdit, IconPlus, IconTrash } from '../../components/common/icons'
import '../../components/common/TableCard.css'
import ContractFormModal from './ContractFormModal'
import {
  fetchContracts,
  createContract,
  updateContract,
  deleteContract,
  type ContractPayload,
} from '../../services/contractsApi'
import { extractErrorMessage } from '../../services/api'
import { contractStatusMap } from '../../constants/statusMaps'
import { formatCurrency, formatDate } from '../../utils/format'
import type { SupplierContract, SupplierContractStatus } from '../../types'

export default function SupplierContractsPage() {
  const [contracts, setContracts] = useState<SupplierContract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<SupplierContractStatus | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SupplierContract | undefined>(undefined)

  function load() {
    setLoading(true)
    fetchContracts()
      .then(setContracts)
      .catch((err) => setError(extractErrorMessage(err, 'Không thể tải danh sách hợp đồng')))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.supplierName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = status === 'all' || c.status === status
      return matchSearch && matchStatus
    })
  }, [contracts, search, status])

  function openCreate() {
    setEditing(undefined)
    setModalOpen(true)
  }

  function openEdit(c: SupplierContract) {
    setEditing(c)
    setModalOpen(true)
  }

  async function handleSubmit(payload: ContractPayload) {
    try {
      if (editing) {
        await updateContract(editing.id, payload)
      } else {
        await createContract(payload)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Không thể lưu hợp đồng'))
    }
  }

  async function handleDelete(c: SupplierContract) {
    if (!confirm(`Xóa hợp đồng "${c.title}"?`)) return
    try {
      await deleteContract(c.id)
      load()
    } catch (err) {
      setError(extractErrorMessage(err, 'Không thể xóa hợp đồng'))
    }
  }

  return (
    <div>
      <PageHeader
        title="Hợp đồng nhà cung cấp"
        description="Quản lý hợp đồng mua sách, thiết bị, dịch vụ ký với nhà cung cấp/nhà xuất bản."
        action={
          <Button onClick={openCreate}>
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
        {error && <p className="table-card__error">{error}</p>}
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
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (c) => (
                <div className="row-actions">
                  <Button variant="ghost" onClick={() => openEdit(c)} title="Sửa">
                    <IconEdit />
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(c)} title="Xóa">
                    <IconTrash />
                  </Button>
                </div>
              ),
            },
          ]}
          data={filtered}
          getRowId={(c) => c.id}
          emptyText={loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy hợp đồng phù hợp'}
        />
      </div>

      {modalOpen && (
        <ContractFormModal initial={editing} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      )}
    </div>
  )
}
