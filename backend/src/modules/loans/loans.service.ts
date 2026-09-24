import { prisma } from '../../config/prisma'
import { ApiError } from '../../common/ApiError'
import { nextLoanCode } from '../../common/codeGenerator'
import type { CreateLoanInput } from './loans.schema'

export function syncOverdueLoans() {
  return prisma.loanSlip.updateMany({
    where: { status: 'borrowing', dueDate: { lt: new Date() } },
    data: { status: 'overdue' },
  })
}

export async function listLoans(search?: string, status?: string) {
  await syncOverdueLoans()

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
  const code = data.code ?? (await nextLoanCode())

  return prisma.$transaction(async (tx) => {
    const book = await tx.book.findUnique({ where: { id: data.bookId } })
    if (!book) throw new ApiError(404, 'Không tìm thấy sách')
    if (book.available <= 0) throw new ApiError(400, 'Sách đã hết, không thể lập phiếu mượn')

    const reader = await tx.reader.findUnique({ where: { id: data.readerId } })
    if (!reader) throw new ApiError(404, 'Không tìm thấy độc giả')
    if (reader.status !== 'active') throw new ApiError(400, 'Thẻ độc giả đang bị khóa hoặc đã hết hạn')

    const loan = await tx.loanSlip.create({ data: { ...data, code } })

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
    if (book && book.status !== 'liquidated') {
      const available = Math.min(book.available + 1, book.quantity)
      await tx.book.update({
        where: { id: book.id },
        data: { available, status: available > 0 ? 'available' : book.status },
      })
    }

    return updated
  })
}
