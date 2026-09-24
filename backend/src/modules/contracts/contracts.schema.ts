import { z } from 'zod'

export const contractStatusEnum = z.enum(['active', 'expiring', 'expired', 'liquidated'])

export const createContractSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  supplierName: z.string().min(1),
  type: z.string().min(1),
  value: z.number().nonnegative(),
  signedDate: z.coerce.date(),
  expiryDate: z.coerce.date(),
  status: contractStatusEnum.default('active'),
})

export const updateContractSchema = createContractSchema.partial()

export type CreateContractInput = z.infer<typeof createContractSchema>
export type UpdateContractInput = z.infer<typeof updateContractSchema>
