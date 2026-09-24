import { prisma } from '../../config/prisma'
import { ApiError } from '../../common/ApiError'
import type { CreateContractInput, UpdateContractInput } from './contracts.schema'

export function listContracts(search?: string, status?: string) {
  return prisma.supplierContract.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { code: { contains: search } },
                { title: { contains: search } },
                { supplierName: { contains: search } },
              ],
            }
          : {},
        status ? { status: status as never } : {},
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getContract(id: string) {
  const contract = await prisma.supplierContract.findUnique({ where: { id } })
  if (!contract) throw new ApiError(404, 'Không tìm thấy hợp đồng')
  return contract
}

export function createContract(data: CreateContractInput) {
  return prisma.supplierContract.create({ data })
}

export async function updateContract(id: string, data: UpdateContractInput) {
  await getContract(id)
  return prisma.supplierContract.update({ where: { id }, data })
}

export async function deleteContract(id: string) {
  await getContract(id)
  await prisma.supplierContract.delete({ where: { id } })
}
