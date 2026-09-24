import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../config/prisma'
import { env } from '../../config/env'
import { ApiError } from '../../common/ApiError'
import type { LoginInput } from './auth.schema'

export async function login({ email, password }: LoginInput) {
  const user = await prisma.systemUser.findUnique({ where: { email } })
  if (!user || !user.active) {
    throw new ApiError(401, 'Email hoặc mật khẩu không đúng')
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    throw new ApiError(401, 'Email hoặc mật khẩu không đúng')
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as jwt.SignOptions,
  )

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  }
}
