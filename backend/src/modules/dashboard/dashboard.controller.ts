import type { Request, Response } from 'express'
import { asyncHandler } from '../../common/asyncHandler'
import * as dashboardService from './dashboard.service'

export const getSummaryHandler = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await dashboardService.getSummary()
  res.json(summary)
})
