export type SupplierContractStatus = 'active' | 'expiring' | 'expired' | 'liquidated'

export interface SupplierContract {
  id: string
  code: string
  title: string
  supplierName: string
  type: string
  value: number
  signedDate: string
  expiryDate: string
  status: SupplierContractStatus
}

export type LoanStatus = 'borrowing' | 'returned' | 'overdue'

export interface LoanSlip {
  id: string
  code: string
  readerId: string
  bookId: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
  status: LoanStatus
}

export type ReaderStatus = 'active' | 'locked' | 'expired'

export interface Reader {
  id: string
  code: string
  fullName: string
  email: string
  phone: string
  cardExpiry: string
  status: ReaderStatus
}

export type BookStatus = 'available' | 'borrowed_out' | 'liquidated'

export interface BookRecord {
  id: string
  code: string
  title: string
  author: string
  publisher: string
  category: string
  quantity: number
  available: number
  status: BookStatus
}

export type SystemRole = 'admin' | 'librarian'

export interface SystemUser {
  id: string
  fullName: string
  email: string
  role: SystemRole
  active: boolean
}
