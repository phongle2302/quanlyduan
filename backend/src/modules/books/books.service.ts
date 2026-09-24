import { prisma } from '../../config/prisma'
import { ApiError } from '../../common/ApiError'
import { nextBookCode } from '../../common/codeGenerator'
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

export async function createBook(data: CreateBookInput) {
  const code = data.code ?? (await nextBookCode())
  return prisma.book.create({ data: { ...data, code } })
}

export async function updateBook(id: string, data: UpdateBookInput) {
  await getBook(id)
  return prisma.book.update({ where: { id }, data })
}

export async function deleteBook(id: string) {
  await getBook(id)

  const loanCount = await prisma.loanSlip.count({ where: { bookId: id } })
  if (loanCount > 0) {
    throw new ApiError(
      400,
      `Sách này có ${loanCount} phiếu mượn trong hệ thống nên không thể xóa. Hãy chuyển trạng thái sang "Đã thanh lý" thay vì xóa.`,
    )
  }

  await prisma.book.delete({ where: { id } })
}
