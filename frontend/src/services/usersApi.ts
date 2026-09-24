import { api } from './api'
import type { SystemUser } from '../types'

export function fetchUsers(params?: { search?: string }) {
  return api.get<SystemUser[]>('/users', { params }).then((res) => res.data)
}
