import { api } from './api'
import type { LoanSlip, Reader, BookRecord } from '../types'

export interface LoanSlipWithRelations extends LoanSlip {
  reader: Reader
  book: BookRecord
}

export function fetchLoans(params?: { search?: string; status?: string }) {
  return api.get<LoanSlipWithRelations[]>('/loans', { params }).then((res) => res.data)
}

export interface CreateLoanPayload {
  code: string
  readerId: string
  bookId: string
  borrowDate: string
  dueDate: string
}

export function createLoan(payload: CreateLoanPayload) {
  return api.post<LoanSlip>('/loans', payload).then((res) => res.data)
}

export function returnLoan(id: string) {
  return api.post<LoanSlip>(`/loans/${id}/return`).then((res) => res.data)
}
