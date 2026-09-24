import { useState, type FormEvent } from 'react'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import type { SupplierContract, SupplierContractStatus } from '../../types'
import type { ContractPayload } from '../../services/contractsApi'

interface ContractFormModalProps {
  initial?: SupplierContract
  onClose: () => void
  onSubmit: (payload: ContractPayload) => Promise<void>
}

function toDateInput(value?: string) {
  return value ? value.slice(0, 10) : ''
}

export default function ContractFormModal({ initial, onClose, onSubmit }: ContractFormModalProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [supplierName, setSupplierName] = useState(initial?.supplierName ?? '')
  const [type, setType] = useState(initial?.type ?? '')
  const [value, setValue] = useState(String(initial?.value ?? ''))
  const [signedDate, setSignedDate] = useState(toDateInput(initial?.signedDate))
  const [expiryDate, setExpiryDate] = useState(toDateInput(initial?.expiryDate))
  const [status, setStatus] = useState<SupplierContractStatus>(initial?.status ?? 'active')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit({
        code: initial?.code,
        title,
        supplierName,
        type,
        value: Number(value),
        signedDate,
        expiryDate,
        status,
      })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={initial ? 'Sửa hợp đồng' : 'Thêm hợp đồng nhà cung cấp'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        {initial ? (
          <label className="form-field">
            <span>Mã hợp đồng</span>
            <input value={initial.code} disabled />
          </label>
        ) : (
          <p className="form-note">Mã hợp đồng sẽ được hệ thống tự sinh khi lưu.</p>
        )}

        <label className="form-field">
          <span>Nội dung</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label className="form-field">
          <span>Nhà cung cấp</span>
          <input value={supplierName} onChange={(e) => setSupplierName(e.target.value)} required />
        </label>

        <div className="form-row">
          <label className="form-field">
            <span>Loại hợp đồng</span>
            <input value={type} onChange={(e) => setType(e.target.value)} required />
          </label>
          <label className="form-field">
            <span>Giá trị (đ)</span>
            <input type="number" min={0} value={value} onChange={(e) => setValue(e.target.value)} required />
          </label>
        </div>

        <div className="form-row">
          <label className="form-field">
            <span>Ngày ký</span>
            <input type="date" value={signedDate} onChange={(e) => setSignedDate(e.target.value)} required />
          </label>
          <label className="form-field">
            <span>Ngày hết hạn</span>
            <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
          </label>
        </div>

        <label className="form-field">
          <span>Trạng thái</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as SupplierContractStatus)}>
            <option value="active">Đang hiệu lực</option>
            <option value="expiring">Sắp hết hạn</option>
            <option value="expired">Hết hạn</option>
            <option value="liquidated">Đã thanh lý</option>
          </select>
        </label>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
