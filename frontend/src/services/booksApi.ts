import { api } from './api'
import type { BookRecord } from '../types'

export function fetchBooks(params?: { search?: string; status?: string }) {
  return api.get<BookRecord[]>('/books', { params }).then((res) => res.data)
}

export type BookPayload = Omit<BookRecord, 'id' | 'code'> & { code?: string }

export function createBook(payload: BookPayload) {
  return api.post<BookRecord>('/books', payload).then((res) => res.data)
}

export function updateBook(id: string, payload: BookPayload) {
  return api.put<BookRecord>(`/books/${id}`, payload).then((res) => res.data)
}

export function deleteBook(id: string) {
  return api.delete(`/books/${id}`)
}
