import { prisma } from '../../config/prisma'
import { ApiError } from '../../common/ApiError'
import type { CreateBookInput, UpdateBookInput } from './books.schema'

export function listBooks(search?: string, status?: string) {
  return prisma.book.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { code: { contains: search } },
                { title: { contains: search } },
                { author: { contains: search } },
              ],
            }
          : {},
        status ? { status: status as never } : {},
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getBook(id: string) {
  const book = await prisma.book.findUnique({ where: { id } })
  if (!book) throw new ApiError(404, 'Không tìm thấy sách/tài liệu')
  return book
}

export function createBook(data: CreateBookInput) {
  return prisma.book.create({ data })
}

export async function updateBook(id: string, data: UpdateBookInput) {
  await getBook(id)
  return prisma.book.update({ where: { id }, data })
}

export async function deleteBook(id: string) {
  await getBook(id)
  await prisma.book.delete({ where: { id } })
}
