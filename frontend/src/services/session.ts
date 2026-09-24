import type { SystemUser } from '../types'

const TOKEN_KEY = 'quanlyduan_token'
const USER_KEY = 'quanlyduan_user'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser(): Pick<SystemUser, 'id' | 'fullName' | 'email' | 'role'> | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function saveSession(token: string, user: Pick<SystemUser, 'id' | 'fullName' | 'email' | 'role'>) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
