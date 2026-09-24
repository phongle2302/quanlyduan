import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { ApiError } from '../common/ApiError'

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Không tìm thấy đường dẫn ${req.originalUrl}` })
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: err.flatten() })
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  console.error(err)
  return res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau' })
}
