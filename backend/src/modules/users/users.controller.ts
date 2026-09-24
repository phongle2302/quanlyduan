import type { Request, Response } from 'express'
import { asyncHandler } from '../../common/asyncHandler'
import { paramId } from '../../common/params'
import * as usersService from './users.service'

export const listUsersHandler = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query
  const users = await usersService.listUsers(search as string)
  res.json(users)
})

export const getUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.getUser(paramId(req.params.id))
  res.json(user)
})

export const createUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.createUser(req.body)
  res.status(201).json(user)
})

export const updateUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.updateUser(paramId(req.params.id), req.body)
  res.json(user)
})

export const deleteUserHandler = asyncHandler(async (req: Request, res: Response) => {
  await usersService.deleteUser(paramId(req.params.id))
  res.status(204).send()
})
