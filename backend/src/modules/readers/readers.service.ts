import { prisma } from '../../config/prisma'
import { ApiError } from '../../common/ApiError'
import type { CreateReaderInput, UpdateReaderInput } from './readers.schema'

export function listReaders(search?: string, status?: string) {
  return prisma.reader.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { code: { contains: search } },
                { fullName: { contains: search } },
                { email: { contains: search } },
              ],
            }
          : {},
        status ? { status: status as never } : {},
      ],
    },
    include: { _count: { select: { loans: { where: { status: { in: ['borrowing', 'overdue'] } } } } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getReader(id: string) {
  const reader = await prisma.reader.findUnique({ where: { id } })
  if (!reader) throw new ApiError(404, 'Không tìm thấy độc giả')
  return reader
}

export function createReader(data: CreateReaderInput) {
  return prisma.reader.create({ data })
}

export async function updateReader(id: string, data: UpdateReaderInput) {
  await getReader(id)
  return prisma.reader.update({ where: { id }, data })
}

export async function deleteReader(id: string) {
  await getReader(id)
  await prisma.reader.delete({ where: { id } })
}
