import bcrypt from 'bcryptjs'
import { prisma } from '../../config/prisma'
import { ApiError } from '../../common/ApiError'
import type { CreateUserInput, UpdateUserInput } from './users.schema'

const publicSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
} as const

export function listUsers(search?: string) {
  return prisma.systemUser.findMany({
    where: search
      ? { OR: [{ fullName: { contains: search } }, { email: { contains: search } }] }
      : undefined,
    select: publicSelect,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getUser(id: string) {
  const user = await prisma.systemUser.findUnique({ where: { id }, select: publicSelect })
  if (!user) throw new ApiError(404, 'Không tìm thấy người dùng')
  return user
}

export async function createUser(data: CreateUserInput) {
  const existing = await prisma.systemUser.findUnique({ where: { email: data.email } })
  if (existing) throw new ApiError(409, 'Email đã được sử dụng')

  const passwordHash = await bcrypt.hash(data.password, 10)
  return prisma.systemUser.create({
    data: { fullName: data.fullName, email: data.email, role: data.role, passwordHash },
    select: publicSelect,
  })
}

export async function updateUser(id: string, data: UpdateUserInput) {
  await getUser(id)
  return prisma.systemUser.update({ where: { id }, data, select: publicSelect })
}

export async function deleteUser(id: string) {
  await getUser(id)
  await prisma.systemUser.delete({ where: { id } })
}
