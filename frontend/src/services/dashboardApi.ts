import { api } from './api'
import type { SupplierContract, LoanSlip, Reader, BookRecord } from '../types'

export interface DashboardSummary {
  activeContracts: number
  expiringContracts: SupplierContract[]
  borrowingLoans: number
  overdueLoans: (LoanSlip & { reader: Reader; book: BookRecord })[]
  activeReaders: number
  totalReaders: number
  totalBooks: number
  totalBookTitles: number
}

export function fetchDashboardSummary() {
  return api.get<DashboardSummary>('/dashboard/summary').then((res) => res.data)
}
