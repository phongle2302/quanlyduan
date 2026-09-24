import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { ApiError } from '../common/ApiError'

export interface AuthPayload {
  id: string
  email: string
  role: 'admin' | 'librarian'
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Thiếu token xác thực')
  }

  const token = header.slice('Bearer '.length)
  try {
    req.user = jwt.verify(token, env.jwtSecret) as AuthPayload
    next()
  } catch {
    throw new ApiError(401, 'Token không hợp lệ hoặc đã hết hạn')
  }
}

export function requireRole(...roles: AuthPayload['role'][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'Bạn không có quyền thực hiện thao tác này')
    }
    next()
  }
}
