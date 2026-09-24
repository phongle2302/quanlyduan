import { prisma } from '../../config/prisma'
import { syncOverdueLoans } from '../loans/loans.service'

export async function getSummary() {
  await syncOverdueLoans()

  const in30Days = new Date()
  in30Days.setDate(in30Days.getDate() + 30)

  const [
    activeContracts,
    expiringContracts,
    borrowingLoans,
    overdueLoans,
    activeReaders,
    totalReaders,
    totalBooksQuantity,
    totalBookTitles,
    returnedThisMonth,
  ] = await Promise.all([
    prisma.supplierContract.count({ where: { status: { in: ['active', 'expiring'] } } }),
    prisma.supplierContract.findMany({
      where: {
        status: { in: ['active', 'expiring'] },
        expiryDate: { lte: in30Days },
      },
      orderBy: { expiryDate: 'asc' },
      take: 5,
    }),
    prisma.loanSlip.count({ where: { status: { in: ['borrowing', 'overdue'] } } }),
    prisma.loanSlip.findMany({
      where: { status: 'overdue' },
      include: { reader: true, book: true },
      orderBy: { dueDate: 'asc' },
      take: 5,
    }),
    prisma.reader.count({ where: { status: 'active' } }),
    prisma.reader.count(),
    prisma.book.aggregate({ _sum: { quantity: true, available: true } }),
    prisma.book.count(),
    prisma.loanSlip.count({
      where: {
        status: 'returned',
        returnDate: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
  ])

  return {
    activeContracts,
    expiringContracts,
    borrowingLoans,
    overdueLoans,
    activeReaders,
    totalReaders,
    totalBooks: totalBooksQuantity._sum.quantity ?? 0,
    availableBooks: totalBooksQuantity._sum.available ?? 0,
    totalBookTitles,
    returnedThisMonth,
  }
}
