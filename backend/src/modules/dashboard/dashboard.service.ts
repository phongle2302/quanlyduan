import { prisma } from '../../config/prisma'

export async function getSummary() {
  const [activeContracts, expiringContracts, borrowingLoans, overdueLoans, activeReaders, totalBooks] =
    await Promise.all([
      prisma.supplierContract.count({ where: { status: 'active' } }),
      prisma.supplierContract.findMany({ where: { status: 'expiring' }, take: 5 }),
      prisma.loanSlip.count({ where: { status: { in: ['borrowing', 'overdue'] } } }),
      prisma.loanSlip.findMany({ where: { status: 'overdue' }, include: { reader: true, book: true }, take: 5 }),
      prisma.reader.count({ where: { status: 'active' } }),
      prisma.book.aggregate({ _sum: { quantity: true } }),
    ])

  return {
    activeContracts,
    expiringContracts,
    borrowingLoans,
    overdueLoans,
    activeReaders,
    totalBooks: totalBooks._sum.quantity ?? 0,
  }
}
