import { api } from './api'
import type { BookRecord } from '../types'

export function fetchBooks(params?: { search?: string; status?: string }) {
  return api.get<BookRecord[]>('/books', { params }).then((res) => res.data)
}

export type CreateBookPayload = Omit<BookRecord, 'id'>

export function createBook(payload: CreateBookPayload) {
  return api.post<BookRecord>('/books', payload).then((res) => res.data)
}

export function deleteBook(id: string) {
  return api.delete(`/books/${id}`)
}
