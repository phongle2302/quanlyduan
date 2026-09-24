import type { Request, Response } from 'express'
import { asyncHandler } from '../../common/asyncHandler'
import { paramId } from '../../common/params'
import * as contractsService from './contracts.service'

export const listContractsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { search, status } = req.query
  const contracts = await contractsService.listContracts(search as string, status as string)
  res.json(contracts)
})

export const getContractHandler = asyncHandler(async (req: Request, res: Response) => {
  const contract = await contractsService.getContract(paramId(req.params.id))
  res.json(contract)
})

export const createContractHandler = asyncHandler(async (req: Request, res: Response) => {
  const contract = await contractsService.createContract(req.body)
  res.status(201).json(contract)
})

export const updateContractHandler = asyncHandler(async (req: Request, res: Response) => {
  const contract = await contractsService.updateContract(paramId(req.params.id), req.body)
  res.json(contract)
})

export const deleteContractHandler = asyncHandler(async (req: Request, res: Response) => {
  await contractsService.deleteContract(paramId(req.params.id))
  res.status(204).send()
})
