import { prisma } from '../config/prisma'

async function nextSequence(prefix: string, lastCode: string | undefined, width: number): Promise<string> {
  const current = lastCode ? Number(lastCode.slice(prefix.length)) : 0
  return prefix + String(current + 1).padStart(width, '0')
}

export async function nextContractCode(): Promise<string> {
  const prefix = `HD-${new Date().getFullYear()}-`
  const last = await prisma.supplierContract.findFirst({
    where: { code: { startsWith: prefix } },
    orderBy: { code: 'desc' },
    select: { code: true },
  })
  return nextSequence(prefix, last?.code, 3)
}

export async function nextReaderCode(): Promise<string> {
  const prefix = 'DG-'
  const last = await prisma.reader.findFirst({
    where: { code: { startsWith: prefix } },
    orderBy: { code: 'desc' },
    select: { code: true },
  })
  return nextSequence(prefix, last?.code, 5)
}

export async function nextBookCode(): Promise<string> {
  const prefix = 'S-'
  const last = await prisma.book.findFirst({
    where: { code: { startsWith: prefix } },
    orderBy: { code: 'desc' },
    select: { code: true },
  })
  return nextSequence(prefix, last?.code, 5)
}

export async function nextLoanCode(): Promise<string> {
  const prefix = 'PM-'
  const last = await prisma.loanSlip.findFirst({
    where: { code: { startsWith: prefix } },
    orderBy: { code: 'desc' },
    select: { code: true },
  })
  return nextSequence(prefix, last?.code, 6)
}
