import { api } from './api'
import type { Reader } from '../types'

export interface ReaderWithLoanCount extends Reader {
  _count?: { loans: number }
}

export function fetchReaders(params?: { search?: string; status?: string }) {
  return api.get<ReaderWithLoanCount[]>('/readers', { params }).then((res) => res.data)
}

export type ReaderPayload = Omit<Reader, 'id' | 'code'> & { code?: string }

export function createReader(payload: ReaderPayload) {
  return api.post<Reader>('/readers', payload).then((res) => res.data)
}

export function updateReader(id: string, payload: ReaderPayload) {
  return api.put<Reader>(`/readers/${id}`, payload).then((res) => res.data)
}

export function deleteReader(id: string) {
  return api.delete(`/readers/${id}`)
}
