import type { Request, Response } from 'express'
import { asyncHandler } from '../../common/asyncHandler'
import { paramId } from '../../common/params'
import * as loansService from './loans.service'

export const listLoansHandler = asyncHandler(async (req: Request, res: Response) => {
  const { search, status } = req.query
  const loans = await loansService.listLoans(search as string, status as string)
  res.json(loans)
})

export const getLoanHandler = asyncHandler(async (req: Request, res: Response) => {
  const loan = await loansService.getLoan(paramId(req.params.id))
  res.json(loan)
})

export const createLoanHandler = asyncHandler(async (req: Request, res: Response) => {
  const loan = await loansService.createLoan(req.body)
  res.status(201).json(loan)
})

export const returnLoanHandler = asyncHandler(async (req: Request, res: Response) => {
  const loan = await loansService.returnLoan(paramId(req.params.id))
  res.json(loan)
})
