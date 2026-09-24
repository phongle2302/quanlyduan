import type { Request, Response } from 'express'
import { asyncHandler } from '../../common/asyncHandler'
import * as authService from './auth.service'

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body)
  res.json(result)
})
