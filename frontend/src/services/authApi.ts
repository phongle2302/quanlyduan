import { api } from './api'
import type { SystemUser } from '../types'

interface LoginResponse {
  token: string
  user: Pick<SystemUser, 'id' | 'fullName' | 'email' | 'role'>
}

export function login(email: string, password: string) {
  return api.post<LoginResponse>('/auth/login', { email, password }).then((res) => res.data)
}
