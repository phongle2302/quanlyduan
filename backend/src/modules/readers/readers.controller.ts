import type { Request, Response } from 'express'
import { asyncHandler } from '../../common/asyncHandler'
import { paramId } from '../../common/params'
import * as readersService from './readers.service'

export const listReadersHandler = asyncHandler(async (req: Request, res: Response) => {
  const { search, status } = req.query
  const readers = await readersService.listReaders(search as string, status as string)
  res.json(readers)
})

export const getReaderHandler = asyncHandler(async (req: Request, res: Response) => {
  const reader = await readersService.getReader(paramId(req.params.id))
  res.json(reader)
})

export const createReaderHandler = asyncHandler(async (req: Request, res: Response) => {
  const reader = await readersService.createReader(req.body)
  res.status(201).json(reader)
})

export const updateReaderHandler = asyncHandler(async (req: Request, res: Response) => {
  const reader = await readersService.updateReader(paramId(req.params.id), req.body)
  res.json(reader)
})

export const deleteReaderHandler = asyncHandler(async (req: Request, res: Response) => {
  await readersService.deleteReader(paramId(req.params.id))
  res.status(204).send()
})
