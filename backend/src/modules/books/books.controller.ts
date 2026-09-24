import type { Request, Response } from 'express'
import { asyncHandler } from '../../common/asyncHandler'
import { paramId } from '../../common/params'
import * as booksService from './books.service'

export const listBooksHandler = asyncHandler(async (req: Request, res: Response) => {
  const { search, status } = req.query
  const books = await booksService.listBooks(search as string, status as string)
  res.json(books)
})

export const getBookHandler = asyncHandler(async (req: Request, res: Response) => {
  const book = await booksService.getBook(paramId(req.params.id))
  res.json(book)
})

export const createBookHandler = asyncHandler(async (req: Request, res: Response) => {
  const book = await booksService.createBook(req.body)
  res.status(201).json(book)
})

export const updateBookHandler = asyncHandler(async (req: Request, res: Response) => {
  const book = await booksService.updateBook(paramId(req.params.id), req.body)
  res.json(book)
})

export const deleteBookHandler = asyncHandler(async (req: Request, res: Response) => {
  await booksService.deleteBook(paramId(req.params.id))
  res.status(204).send()
})
