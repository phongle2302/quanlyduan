import type { BadgeTone } from '../components/common/StatusBadge'
import type { BookStatus, LoanStatus, ReaderStatus, SupplierContractStatus } from '../types'

export const contractStatusMap: Record<SupplierContractStatus, { label: string; tone: BadgeTone }> = {
  active: { label: 'Đang hiệu lực', tone: 'success' },
  expiring: { label: 'Sắp hết hạn', tone: 'warning' },
  expired: { label: 'Hết hạn', tone: 'danger' },
  liquidated: { label: 'Đã thanh lý', tone: 'neutral' },
}

export const loanStatusMap: Record<LoanStatus, { label: string; tone: BadgeTone }> = {
  borrowing: { label: 'Đang mượn', tone: 'primary' },
  returned: { label: 'Đã trả', tone: 'success' },
  overdue: { label: 'Quá hạn', tone: 'danger' },
}

export const readerStatusMap: Record<ReaderStatus, { label: string; tone: BadgeTone }> = {
  active: { label: 'Hoạt động', tone: 'success' },
  locked: { label: 'Bị khóa', tone: 'danger' },
  expired: { label: 'Hết hạn thẻ', tone: 'neutral' },
}

export const bookStatusMap: Record<BookStatus, { label: string; tone: BadgeTone }> = {
  available: { label: 'Còn sẵn', tone: 'success' },
  borrowed_out: { label: 'Đã mượn hết', tone: 'warning' },
  liquidated: { label: 'Đã thanh lý', tone: 'neutral' },
}
