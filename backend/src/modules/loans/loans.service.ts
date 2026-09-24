import { prisma } from '../../config/prisma'
import { ApiError } from '../../common/ApiError'
import type { CreateLoanInput } from './loans.schema'

export function listLoans(search?: string, status?: string) {
  return prisma.loanSlip.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { code: { contains: search } },
                { reader: { fullName: { contains: search } } },
                { book: { title: { contains: search } } },
              ],
            }
          : {},
        status ? { status: status as never } : {},
      ],
    },
    include: { reader: true, book: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getLoan(id: string) {
  const loan = await prisma.loanSlip.findUnique({ where: { id }, include: { reader: true, book: true } })
  if (!loan) throw new ApiError(404, 'Không tìm thấy phiếu mượn')
  return loan
}

export async function createLoan(data: CreateLoanInput) {
  return prisma.$transaction(async (tx) => {
    const book = await tx.book.findUnique({ where: { id: data.bookId } })
    if (!book) throw new ApiError(404, 'Không tìm thấy sách')
    if (book.available <= 0) throw new ApiError(400, 'Sách đã hết, không thể lập phiếu mượn')

    const loan = await tx.loanSlip.create({ data })

    const available = book.available - 1
    await tx.book.update({
      where: { id: book.id },
      data: { available, status: available === 0 ? 'borrowed_out' : book.status },
    })

    return loan
  })
}

export async function returnLoan(id: string) {
  return prisma.$transaction(async (tx) => {
    const loan = await tx.loanSlip.findUnique({ where: { id } })
    if (!loan) throw new ApiError(404, 'Không tìm thấy phiếu mượn')
    if (loan.status === 'returned') throw new ApiError(400, 'Phiếu mượn này đã được trả')

    const updated = await tx.loanSlip.update({
      where: { id },
      data: { status: 'returned', returnDate: new Date() },
    })

    const book = await tx.book.findUnique({ where: { id: loan.bookId } })
    if (book) {
      await tx.book.update({
        where: { id: book.id },
        data: { available: book.available + 1, status: 'available' },
      })
    }

    return updated
  })
}
