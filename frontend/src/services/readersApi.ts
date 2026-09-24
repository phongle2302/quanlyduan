import { api } from './api'
import type { Reader } from '../types'

interface ReaderWithLoanCount extends Reader {
  _count?: { loans: number }
}

export function fetchReaders(params?: { search?: string; status?: string }) {
  return api.get<ReaderWithLoanCount[]>('/readers', { params }).then((res) => res.data)
}

export type CreateReaderPayload = Omit<Reader, 'id'>

export function createReader(payload: CreateReaderPayload) {
  return api.post<Reader>('/readers', payload).then((res) => res.data)
}

export function deleteReader(id: string) {
  return api.delete(`/readers/${id}`)
}
