import { api } from './api'
import type { SystemUser, SystemRole } from '../types'

export function fetchUsers(params?: { search?: string }) {
  return api.get<SystemUser[]>('/users', { params }).then((res) => res.data)
}

export interface CreateUserPayload {
  fullName: string
  email: string
  password: string
  role: SystemRole
}

export function createUser(payload: CreateUserPayload) {
  return api.post<SystemUser>('/users', payload).then((res) => res.data)
}

export interface UpdateUserPayload {
  fullName?: string
  role?: SystemRole
  active?: boolean
}

export function updateUser(id: string, payload: UpdateUserPayload) {
  return api.put<SystemUser>(`/users/${id}`, payload).then((res) => res.data)
}

export function deleteUser(id: string) {
  return api.delete(`/users/${id}`)
}
